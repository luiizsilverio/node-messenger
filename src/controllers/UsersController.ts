import { Request, Response } from 'express'
import { UsersServices } from '../services/UsersServices'

class UsersController {

   async create(req: Request, res: Response): Promise<Response> {
      const { email } = req.body

      const usersService = new UsersServices()

      try {
         const users = await usersService.create(email)
   
         return res.json(users)

      } catch (err) {
         return res.status(400).json({ message: err.message })
      }
   }
}

export { UsersController }
