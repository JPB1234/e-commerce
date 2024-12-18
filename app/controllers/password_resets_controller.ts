import type { HttpContext } from '@adonisjs/core/http'
import { passwordResetValidator } from '#validators/password_reset'
import User from '#models/user'
import Token from '#models/token'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import { emailValidator } from '#validators/email'
import { tokenValidator } from '#validators/token'

//ioc/core/build/services/router.js
export default class PasswordResetController {
    public async forgot({view}: HttpContext){
        return view.render('password/forgot')
    }

    public async send({request, response, session}: HttpContext){
        const{email} = await request.validateUsing(emailValidator)
        const user = await User.findBy('email', email)
        const token = await Token.generatePasswordResetToken(user)
        const resetLink = router.makeUrl('password.reset', [token])

        if (user) {
            await mail.sendLater(message => {
                message
                .from('noreply@trabweb.com')
                .to(user.email)
                .subject('Reset Your Password')
                .html(`resete sua senha <a href="${env.get('DOMAIN')}${resetLink}">clicando aqui</a>`)
            })
            
        }
        
        session.flash('sucesso', 'Se a conta for do email fornecido, você receberá um link para resetar sua senha')
        return response.redirect().back()
    }

    public async reset({view, params}: HttpContext){
        const token= params.token
        const isValid = await Token.verify(token)

        return view.render('password/reset', { isValid, token })
    }

    public async store({request, response, session, auth}: HttpContext){
        const{token} = await request.validateUsing(tokenValidator)
        const{password} = await request.validateUsing(passwordResetValidator)

        const user = await Token.getPasswordResetUser(token)

        if(!user){
            session.flash('Erro', 'Token expirou ou usuário associado não foi encontrado')
            return response.redirect().back()
        }

        await user.merge({password}).save()
        await auth.use('web').login(user)

        return response.redirect().toPath('/')

    }
}