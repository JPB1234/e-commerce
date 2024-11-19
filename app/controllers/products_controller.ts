import { HttpContext } from "@adonisjs/core/http"
import Product from "#models/product"
import Category from "#models/category"

export default class ProductsController {
  
  // Lista de produtos com paginação e filtro por nome
  async index({ request, view }: HttpContext) {
    const search = request.input('search');
    const categoryId = request.input('category');

    const query = Product.query().preload('category');

    if (search) {
      query.where('name', 'like');
    }

    if (categoryId) {
      query.where('categoryId', categoryId);
    }

    const products = await query;
    const categories = await Category.all();

    return view.render('pages/products/index', {
      products,
      categories,
    });
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
    const payload = request.only(['name', 'price', 'description', 'categoryId']) // Dados do formulário
    

    const product = await Product.create(payload)
    return response.redirect().toRoute('products.show', { id: product.id }) // Redireciona para a visualização do produto
  }

  // Exibe a página de criação do produto
  public async create({ view }: HttpContext) {
    const categories = await Category.all()
    console.log("vtmnc")
    return view.render('pages/products/create', { categories }) // Exibe o formulário de criação
  }

  // Atualiza as informações do produto
  async patch({ params, request }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const payload = request.only(['name', 'price', 'description', 'categoryId'])
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
