import vine from '@vinejs/vine';

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().optional(), 
    full_name: vine.string().trim().optional(),
    avatar: vine.file({extnames: ['jpg', 'png', 'jpeg'], size: '5mb'}).optional(),
    avatarUrl: vine.string().optional(), 
    email: vine.string().email().trim().optional(),
    password: vine.string().minLength(3).confirmed({ confirmationField: 'password_confirm' }).optional(), // Define o campo de confirmação explicitamente
  })
);


