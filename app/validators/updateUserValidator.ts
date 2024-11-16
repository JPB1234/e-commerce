import vine from '@vinejs/vine';

export const updateUserValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim(),
    password: vine.string().minLength(3).optional(),
    avatar: vine.file().optional() // Aceita arquivo opcionalmente
  })
);
