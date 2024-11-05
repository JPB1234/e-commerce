import vine from '@vinejs/vine'

/**
 * Valida a criação do usuário
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(), 
    email: vine.string().email().trim(),
    password: vine.string().minLength(3).confirmed({ confirmationField: 'password_confirm' }) // Define o campo de confirmação explicitamente
  })
)
