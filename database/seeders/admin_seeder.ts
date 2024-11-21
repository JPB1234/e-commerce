import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'


export default class CategorySeeder extends BaseSeeder {
    public async run() {
        await User.create({
            full_name: 'Administrador',
            email: 'jpboechat11@gmail.com',
            username: 'Admin',
            password: 'admin', 
            admin: true,
    })
    }
  }