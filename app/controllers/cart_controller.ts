import type { HttpContext } from '@adonisjs/core/http';
import Product from '#models/product';
import db from '@adonisjs/lucid/services/db'
export default class CartController {
  // Exibe o carrinho
  public async show({ session, view }: HttpContext) {
    const cart = session.get('cart', []);
    return view.render('pages/cart/show', { cart });
  }

  // Adiciona um produto ao carrinho
  public async store({ request, session, response }: HttpContext) {
    const productId = request.input('product_id');
    const quantity = Number(request.input('quantity'));
    const product = await Product.find(productId);

    if (product) {
      let cart = session.get('cart', []);
      const existingProduct = cart.find((item: any) => item.product_id === product.id);

      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.total = existingProduct.quantity * product.price;
      } else {
        cart.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          stock: product.stock,
          total: product.price * quantity,
          imageUrl: product.imageUrl,
        });
      }

      session.put('cart', cart);
    }

    return response.redirect().toRoute('cart.show');
  }

  // Atualiza a quantidade de um item no carrinho
  public async update({ params, request, session, response }: HttpContext) {
    const productId = parseInt(params.id);
    const quantity = Number(request.input('quantity'));
    let cart = session.get('cart', []);

    const product = cart.find((item: any) => item.product_id === productId);
    if (product) {
      product.quantity = quantity;
      product.total = product.price * quantity;
      session.put('cart', cart);
    }

    return response.redirect().toRoute('cart.show');
  }

  public async destroy({ params, session, response }: HttpContext) {
    const productId = parseInt(params.id);
    let cart = session.get('cart', []);
    cart = cart.filter((item: any) => item.product_id !== productId);
    session.put('cart', cart);
  
    // Retornar o carrinho atualizado
    return response.json({ cart });
  }

  public async checkout({ session, response, view }: HttpContext) {
    const cart = session.get('cart', [])

    if (cart.length === 0) {
      session.flash('notification', 'Seu carrinho está vazio.')
      return response.redirect().toRoute('cart.show')
    }

    const trx = await db.transaction()

    try {
      for (const item of cart) {
        const product = await Product.query({ client: trx })
          .where('id', item.product_id)
          .firstOrFail()

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${product.name}`)
        }

        product.stock -= item.quantity
        await product.useTransaction(trx).save()
      }

      await trx.commit()

      session.forget('cart')

      return view.render('pages/cart/checkout', { cart })
    } catch (error) {
      await trx.rollback()

      session.flash('error', error.message)
      return response.redirect().toRoute('cart.show')
    }
  }
}
