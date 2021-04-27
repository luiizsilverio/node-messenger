import { io } from '../http'
import { ConnectionsServices } from '../services/ConnectionsService'
import { UsersServices } from '../services/UsersServices'
import { MessagesServices } from '../services/MessagesServices'

interface IParams {
   text: string;
   email: string;
}

io.on('connect', (socket) => {
   const connectionsService = new ConnectionsServices()
   const usersService = new UsersServices()
   const messagesService = new MessagesServices()
   
   // "Ouve" evento 'client_first_access' (poderia ser qualquer nome)
   socket.on('client_first_access', async (params) => {
      const socket_id = socket.id
      const { text, email } = params as IParams
      let user_id = null
      
      const userExists = await usersService.findByEmail(email)

      if (!userExists) {
         const user = await usersService.create(email)
         await connectionsService.create({
            socket_id,
            user_id: user.id
         })

      user_id = user.id

      } else {
         const connection = await connectionsService.findByUserId(userExists.id)
         
         user_id = userExists.id

         if (!connection) {
            await connectionsService.create({
               socket_id,
               user_id: userExists.id
            })
         } else {
            connection.socket_id = socket_id
            await connectionsService.create(connection)
         }
      }

      await messagesService.create({
         text,
         user_id
      })

      const allMessages = await messagesService.listByUser(user_id)

      // Cria o evento 'client_list_all_messages'
      socket.emit("client_list_all_messages", allMessages)

      const allUsers = await connectionsService.findAllNoAdmin()

      io.emit('admin_list_all_users', allUsers)
   })

   socket.on('client_send_to_admin', async (params) => {
      const { text, socket_admin_id } = params
      const socket_id = socket.id

      const { user_id } = await connectionsService.findBySocketID(socket_id)
      
      const message = await messagesService.create({
         text,
         user_id
      })

      io.to(socket_admin_id).emit('admin_receive_message', {
         message,
         socket_id: socket_id
      })
   })
})