import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class CategorySeeder extends BaseSeeder {
  public async run() {
    await Category.createMany([
      { name: 'Dados e Acessórios' },
      { name: 'Livros e Manuais' },
      { name: 'Miniaturas' },
      { name: 'Itens Temáticos' },
      { name: 'Vestuário e Cosplay' },
      { name: 'Tabuleiros e Mapas' }
    ])
  }
}