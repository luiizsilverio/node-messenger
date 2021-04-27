import { io } from '../http'
import { ConnectionsServices } from '../services/ConnectionsService'
import { MessagesServices } from '../services/MessagesServices'

io.on('connect', async (socket) => {
   const connectionsService = new ConnectionsServices()
   const messagesService = new MessagesServices()

   const allConnectionsNoAdmin = await connectionsService.findAllNoAdmin() 

   io.emit('admin_list_all_users', allConnectionsNoAdmin)

   socket.on('admin_list_messages_by_user', async (params, callback) => {
      const { user_id } = params
      const allMessages = await messagesService.listByUser(user_id)

      callback(allMessages)
   })

   socket.on('admin_send_message', async (params) => {
      const { user_id, text } = params

      await messagesService.create({
         text,
         user_id,
         admin_id: socket.id
      })

      const { socket_id } = await connectionsService.findByUserId(user_id)

      io.to(socket_id).emit('admin_send_to_client', {
         text,
         socket_id: socket_id
      })
   })

   socket.on('admin_user_in_support', async params => {
      const { user_id } = params
      await connectionsService.updateAdminID(user_id, socket.id)

      const allConnectionsNoAdmin = await connectionsService.findAllNoAdmin() 

      io.emit('admin_list_all_users', allConnectionsNoAdmin)
   })
})
