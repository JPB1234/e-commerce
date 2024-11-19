import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class CategorySeeder extends BaseSeeder {
  public async run() {
    await Category.createMany([
      { name: 'Livros e Campanhas' },
      { name: 'Dados e Kits' },
      { name: 'Acessórios' },
      { name: 'Roupas' },
      { name: 'Fantasias' },
      { name: 'Miniaturas' }
    ])
  }
}