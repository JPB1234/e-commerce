import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { createUserValidator } from '#validators/user';
import { updateUserValidator } from '#validators/updateUserValidator';
import app from '@adonisjs/core/services/app' // Importa o Application Service para uso no caminho de upload
import path from 'path';

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

    // Valida o payload do formulário, exceto a imagem
    const payload = await request.validateUsing(updateUserValidator);
    user.merge(payload);

    // Manipulação do arquivo de imagem
    const avatar = request.file('avatar', {
      extnames: ['jpg', 'jpeg', 'png'], // Extensões permitidas
      size: '2mb',                      // Tamanho máximo permitido
    });

    if (avatar) {
      try {
        // Define o nome do arquivo e o diretório de upload
        const fileName = `${user.id}-${Date.now()}.${avatar.extname}`;
        const uploadDir = path.join(app.publicPath('uploads'));

        // Move o arquivo para o diretório especificado
        await avatar.move(uploadDir, {
          name: fileName,
          overwrite: true, // Sobrescreve caso já exista
        });

        // Atualiza a URL do avatar do usuário
        user.avatarUrl = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Erro ao fazer upload do avatar:', error);
        return response.redirect().back();
      }
    }

    // Salva as mudanças no usuário
    await user.save();
    return response.redirect().toRoute('home.show');
  }
}
