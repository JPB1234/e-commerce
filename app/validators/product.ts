import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    price: vine.number().min(0),
    description: vine.string().trim(),
    category_id: vine.number(),
    image: vine.file({
      size: '2mb', // Limite de 2MB
      extnames: ['jpg', 'jpeg', 'png'], // Extensões permitidas
    }),
  })
)
