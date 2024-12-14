import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SocialAuthsController {
    public redirect({ally, params}: HttpContext){
        return ally.use(params.provider).redirect()
    }
    public async callback({ally, params, auth, session, response}: HttpContext){
        const provider = ally.use(params.provider)
        if (provider.accessDenied()) {
            session.flash('error', 'Acesso negado')
            
            return response.redirect('/login')
        }

        if (provider.stateMisMatch()) {
            session.flash('error', 'Requisição expirada, tente novamente')
            
            return response.redirect('/login')
        }
        if (provider.hasError()){
            session.flash('error', provider.getError)
            
            return response.redirect('/login')
        }

        const providerUser = await provider.user()

        
        let user = await User.query().where('email', providerUser.email).orWhereHas('socials', (query) => {
            query.where('provider', params.provider).where('provider_id', providerUser.id)
        }).first()

        if(!user){
            user = await User.create({
                full_name: providerUser.name,
                email: providerUser.email,
                username: providerUser.nickName,

            })
        }

        await user.related('socials').firstOrCreate({provider: params.provider}, {providerId: providerUser.id})

        await auth.use('web').login(user)

        return response.redirect('/')
    }
}