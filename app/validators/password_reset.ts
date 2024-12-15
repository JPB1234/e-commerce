import vine from '@vinejs/vine'

export const passwordResetValidator = vine.compile(
    vine.object({
        password: vine.string().minLength(3),
    })
)

