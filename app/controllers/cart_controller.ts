import type { HttpContext } from '@adonisjs/core/http'
import Product from "#models/product"

export default class CartController {

    // Exibe os itens do carrinho
    public async show({ session, view }: HttpContext) {
      const cart = session.get('cart', []);
  
      // Carrega os produtos do banco de dados
      const productIds = cart.map((item: any) => item.product_id);
      const products = await Product.query().whereIn('id', productIds);
  
      // Mapear produtos com as quantidades e totais armazenados na sessão
      const cartDetails = cart.map((item: any) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          ...item,
          name: product?.name || 'Produto não encontrado',
          price: product?.price || 0,
          total: (product?.price || 0) * item.quantity,
        };
      });
  
      return view.render('pages/cart/show', { cart: cartDetails });
    }


  // Exibe os itens do carrinho
  public async index({ session, view }: HttpContext) {
    const cart = session.get('cart', []);

    // Carrega os produtos do banco de dados
    const productIds = cart.map((item: any) => item.product_id);
    const products = await Product.query().whereIn('id', productIds);

    // Mapear produtos com as quantidades e totais armazenados na sessão
    const cartDetails = cart.map((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        ...item,
        name: product?.name || 'Produto não encontrado',
        price: product?.price || 0,
        total: (product?.price || 0) * item.quantity,
      };
    });

    return view.render('pages/cart/show', { cart: cartDetails });
  }

  // Adiciona um produto ao carrinho
  public async store({ request, session, response }: HttpContext) {
    const { product_id, quantity } = request.only(['product_id', 'quantity']);

    // Verifica se o produto existe
    const product = await Product.find(product_id);
    if (!product) {
      return response.redirect().back().with('error', 'Produto não encontrado.');
    }

    let cart = session.get('cart', []);

    // Verifica se o produto já está no carrinho
    const existingItem = cart.find((item: any) => item.product_id === product_id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product_id, quantity });
    }

    session.put('cart', cart);
    return response.redirect().toRoute('cart.index');
  }

  // Atualiza a quantidade de um item no carrinho
  public async update({ params, request, session, response }: HttpContext) {
    const { quantity } = request.only(['quantity']);
    const product_id = parseInt(params.id);

    let cart = session.get('cart', []);

    // Atualiza a quantidade do produto no carrinho
    const item = cart.find((item: any) => item.product_id === product_id);
    if (item) {
      item.quantity = quantity;
    }

    session.put('cart', cart);
    return response.redirect().toRoute('cart.index');
  }

  // Remove um item do carrinho
  public async destroy({ params, session, response }: HttpContext) {
    const product_id = parseInt(params.id);
    let cart = session.get('cart', []);

    cart = cart.filter((item: any) => item.product_id !== product_id);

    session.put('cart', cart);
    return response.redirect().toRoute('cart.index');
  }
}
