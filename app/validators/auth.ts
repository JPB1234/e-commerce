import vine from '@vinejs/vine'

/**
 * Validates the auth's creation action
 */
export const createAuthValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(3),
    isRememberMe: vine.accepted().optional(),
  })
)
