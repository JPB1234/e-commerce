import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import UserSocial from './user_social.js'
import type { HasMany } from '@ioc/lucid/build/src/types/relations.js'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Token from './token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column() 
  declare full_name: string

  @column()
  declare email: string 

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare avatar_url: string | null

  @column()
  declare admin: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(()  => UserSocial)
  declare socials: HasMany<typeof UserSocial>

  @hasMany(()  => Token)
  declare tokens: HasMany<typeof Token>

  @hasMany(() => Token,{
    onQuery: query => query.where('type', 'PASSWORD_RESET')
  })
  declare passwordResetTokens: HasMany<typeof Token>
}
