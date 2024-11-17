import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const isAdmin = ctx.auth.user?.admin == true


    if (!isAdmin){
      
      throw new Exception('Você não tem Autorização para fazer essa ação',{
        code: 'NOT_AUTHORIZED',
        status: 401,
      })
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}