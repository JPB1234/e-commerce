import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { createUserValidator } from '#validators/user';
import { updateUserValidator } from '#validators/updateUserValidator';
import app from '@adonisjs/core/services/app' // Importa o Application Service para uso no caminho de upload
import { unlink } from 'node:fs/promises';

export default class UsersController {
  public async create({ view }: HttpContext) {
    return view.render('pages/users/create');
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator);

    const user = new User();
    user.merge(payload);
    await user.save();

    return response.redirect().toRoute('auth.create');
  }

  public async edit({ view, auth, response }: HttpContext) {
    const user = auth.user;
    if (!user) {
      return response.redirect().toRoute('auth.create');
    }
    return view.render('pages/users/edit', { user });
  }

  public async update({ request, response, auth }: HttpContext) {
    const user = auth.user;
    if (!user) {
      return response.redirect().toRoute('auth.create');
    }

    const {avatar, avatar_url} = await request.validateUsing(updateUserValidator)

    if (avatar) {
      await avatar.move(app.makePath('storage/avatars'))
      auth.user!.avatar_url = `/avatars/${avatar.fileName}`
    } else if(!avatar_url && auth.user?.avatar_url){
      await unlink(app.makePath('storage', auth.user.avatar_url))
      auth.user!.avatar_url = null
      
    }

    // Valida o payload do formulário, exceto a imagem
    const {username, full_name, email, password} = await request.validateUsing(updateUserValidator);
    user.merge({username, full_name, email, password});

    // Salva as mudanças no usuário
    await user.save();
    return response.redirect().toRoute('home.show');
  }
}
