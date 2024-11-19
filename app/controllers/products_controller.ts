import { HttpContext } from "@adonisjs/core/http"
import Product from "#models/product"
import Category from "#models/category"

export default class ProductsController {
  
  // Lista de produtos com paginação e filtro por nome
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const payload = request.only(['name'])

    const query = Product.query()

    if (payload.name && payload.name.length > 0) {
      query.where('name', 'like', `%${payload.name}%`)
    }

    const products = await query.paginate(page, limit)

    return view.render('pages/products/create', { products })
  }

  // Exibe o produto, esperando que o id do produto seja fornecido na URL
  async show({ view, params }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.load('category') // Carrega a categoria associada

      return view.render('pages/products/show', { product })
    } catch (error) {
      // Caso não encontre o produto, talvez redirecionar para a lista de produtos ou mostrar um erro amigável
      return view.render('pages/products/index', { error: 'Produto não encontrado' })
    }
  }

  // Criação de novo produto
  async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'price', 'description', 'category_id']) // Dados do formulário
    

    const product = await Product.create(payload)
    return response.redirect().toRoute('products.show', { id: product.id }) // Redireciona para a visualização do produto
  }

  // Exibe a página de criação do produto
  async create({ view }: HttpContext) {
    try {
      const categories = await Category.all(); // Obtém as categorias
      return view.render('pages/products/create', { categories: categories});
    } catch (error) {
      console.error('Erro ao carregar categorias para criação de produtos:', error);
      return view.render('errors/500', { message: 'Erro ao carregar categorias.' });
    }
  }

  // Atualiza as informações do produto
  async patch({ params, request }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const payload = request.only(['name', 'price', 'description', 'category_id'])
    product.merge(payload) // Atualiza os dados do produto

    await product.save() // Salva as mudanças

    return product // Retorna o produto atualizado
  }

  // Exclui o produto
  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    await product.delete() // Exclui o produto

    return { success: `${params.id} removido` } // Retorna mensagem de sucesso
  }
}
