import vine from '@vinejs/vine'


export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim(), 
    full_name: vine.string().trim(), 
    email: vine.string().email().trim(),
    password: vine.string().minLength(3).confirmed({ confirmationField: 'password_confirm' }) 
  })
)
