import type { HttpContext } from '@adonisjs/core/http'

export default class CartController {
  public async show({ view }: HttpContext) {
    return view.render('pages/cart/show') 
  }
}
