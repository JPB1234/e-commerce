import vine from '@vinejs/vine';

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    password: vine.string().minLength(3).optional(),
    avatar: vine.file().optional() // Aceita arquivo opcionalmente
  })
);
