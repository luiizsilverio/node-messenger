import { getCustomRepository, Repository } from 'typeorm'
import { Message } from '../entities/Message'
import { MessagesRepository } from '../repositories/MessagesRepository'

interface IMessageCreate {
   admin_id?: string;
   text: string;
   user_id: string;
}

class MessagesServices {
   private messagesRepository: Repository<Message>

   constructor() {
      this.messagesRepository = getCustomRepository(MessagesRepository)
   }

   async create({ admin_id, text, user_id }: IMessageCreate) {     

      // Se admin_id for informado, significa que quem está enviando a mensagem
      // é o atendente. Se não for informado, é o usuário.
     
      const message = this.messagesRepository.create({
         admin_id,
         text,
         user_id
      })
      
      await this.messagesRepository.save(message) 

      return message
   }

   async listByUser(user_id: string) {
      
      const list = await this.messagesRepository.find({
         where: { user_id },
         relations: ["user"]
      })

      return list
   }
}

export { MessagesServices }
