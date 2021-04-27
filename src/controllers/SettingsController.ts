import { Request, Response } from 'express'
import { SettingsServices } from '../services/SettingsServices'

class SettingsController {

   async create(req: Request, res: Response) {
      const { chat, username } = req.body

      const settingsService = new SettingsServices()

      try {
         const settings = await settingsService.create({ chat, username })
   
         return res.json(settings)

      } catch (err) {
         return res.status(400).json({ message: err.message })
      }
   }

   async findByUsername(req: Request, res: Response) {
      const { username } = req.params

      const settingsService = new SettingsServices()

      const settings = await settingsService.findByUsername(username)

      return res.json(settings)
   }

   async update(req: Request, res: Response) {
      const { username } = req.params
      const { chat } = req.body

      const settingsService = new SettingsServices()

      const settings = await settingsService.update(username, chat)

      return res.json(settings)
   }
}

export { SettingsController }