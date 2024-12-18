import vine from '@vinejs/vine'

export const tokenValidator = vine.compile(
    vine.object({
        token: vine.string(),
    })
)