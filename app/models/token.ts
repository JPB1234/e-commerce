import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@ioc/lucid/build/src/types/relations.js'
import string from '@adonisjs/core/helpers/string'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column() 
  declare type: string

  @column() 
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  public static async generatePasswordResetToken(user: User | null){
    const token = string.generateRandom(64)

    if(!user) return token


    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({hour: 1}),
      token 

    })
    return record.token
  }

  public static async expirePasswordResetTokens(user: User){
    await user.related('passwordResetTokens').query().update({
      expiresAt: DateTime.now()
    })
  }

  public static async getPasswordResetUser(token: string){
    const record = await Token.query()
    .preload('user')
    .where('token', token)
    .where('expiresAt', '>', DateTime.now().toSQL())
    .orderBy('createdAt', 'desc')
    .first()

    return record?.user
  }

  public static async verify(token: string){
    const record = await Token.query()
    .where('expiresAt', '>', DateTime.now().toSQL())
    .where('token', token)
    .first()

    return !!record
  }
}