import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.decimal('price').notNullable().checkPositive()
      table.text('description').notNullable()
      table.integer('category_id').unsigned().nullable().references('id').inTable('categories').onDelete('CASCADE')
      table.integer('stock').notNullable()

      table.string('image_url').nullable(); 
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}