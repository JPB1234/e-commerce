import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class CartController {

  // Exibe o carrinho
  public async show({ session, view }: HttpContext) {
    const cart = session.get('cart', [])
    return view.render('pages/cart/show', { cart })
  }

  public async store({ request, session, response }: HttpContext) {
    const productId = request.input('product_id')
    const quantity = Number(request.input('quantity')) // Converte a quantidade para número
  
    // Recupera os detalhes do produto do banco de dados
    const product = await Product.find(productId)
  
    // Verifica se o produto existe
    if (product) {
      let cart = session.get('cart', [])
  
      // Verifica se o produto já está no carrinho
      const existingProduct = cart.find((item: any) => item.product_id === product.id)
      
      if (existingProduct) {
        // Se o produto já estiver no carrinho, soma a quantidade
        existingProduct.quantity += quantity
        existingProduct.total = existingProduct.quantity * product.price // Atualiza o total
      } else {
        // Caso contrário, adiciona o novo produto ao carrinho
        cart.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity, // Garante que price seja tratado como número
        })
      }
  
      // Atualiza o carrinho na sessão
      session.put('cart', cart)
    }
  
    return response.redirect().toRoute('cart.show')
  }
 

  // Atualiza a quantidade de um item no carrinho
  public async update({ params, request, session, response }: HttpContext) {
    const productId = parseInt(params.id)
    const quantity = request.input('quantity')

    // Recupera o carrinho da sessão
    let cart = session.get('cart', [])

    // Encontra o produto no carrinho
    const product = cart.find((item: any) => item.product_id === productId)

    if (product) {
      // Atualiza a quantidade do produto no carrinho
      product.quantity = quantity
      product.total = Number(product.price) * quantity  // Garante que price seja tratado como número

      // Atualiza o carrinho na sessão
      session.put('cart', cart)
    }

    // Redireciona para a página do carrinho
    return response.redirect().toRoute('cart.show')
  }


  public async destroy({ params, session, response }: HttpContext) {
    const productId = parseInt(params.id);
  
    let cart = session.get('cart', []);
  
    // Filtra o carrinho para remover o item com o id fornecido
    cart = cart.filter((item: any) => item.product_id !== productId);
  
    // Atualiza o carrinho na sessão
    session.put('cart', cart);
  
    return response.redirect().toRoute('cart.show')}}