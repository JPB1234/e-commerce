import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAvatarUrlToUsers extends BaseSchema {
  public async up () {
    this.schema.alterTable('users', (table) => {
      table.string('avatar_url').nullable() // Campo opcional para o avatar
    })
  }

  public async down () {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('avatar_url')
    })
  }
}