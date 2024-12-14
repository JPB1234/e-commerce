import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SocialAuthsController {
    public redirect({ally}: HttpContext){
        return ally.use('github').redirect()
    }
    public async callback({ally, auth, session, response}: HttpContext){
        const github = ally.use('github')
        if (github.accessDenied()) {
            session.flash('error', 'Acesso negado')
            
            return response.redirect('/login')
        }

        if (github.stateMisMatch()) {
            session.flash('error', 'Requisição expirada, tente novamente')
            
            return response.redirect('/login')
        }
        if (github.hasError()){
            session.flash('error', github.getError)
            
            return response.redirect('/login')
        }

        const githubUser = await github.user()

        const user = await User.firstOrCreate(
        {            email: githubUser.email!,
        },    
        {
            username: githubUser.nickName,
            full_name: githubUser.name,
            provider: 'github',
            providerId: githubUser.id,
        })

        await auth.use('web').login(user)

        return response.redirect('/')
    }
}