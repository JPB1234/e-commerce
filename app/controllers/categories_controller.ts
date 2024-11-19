import { HttpContext } from "@adonisjs/core/http"
import Category from "#models/category"

export default class CategoriesController {
  public async index({ view }: HttpContext) {
    try {
      const categories = await Category.all();  // Obtém todas as categorias da base de dados
      
      // Garantindo que o retorno seja um array
      return view.render('pages/categories/index', { 
        categories: categories.toJSON() || []  // Passando um array vazio caso categories seja inválido
      });
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      return view.render('pages/categories/index', { categories: [] });  // Caso ocorra um erro, passa um array vazio
    }
  }

  // Renderiza o formulário de criação
  public async create({ view }: HttpContext) {
    // Renderiza a view de criação
    return view.render('pages/categories/create')  // A view 'create' deve estar dentro de 'pages/categories/'
  }

  // Função para armazenar a nova categoria
  public async store({ request, response, session }: HttpContext) {
    // Recebe o nome da categoria do formulário
    const name = request.input('name')

    // Verifica se o nome foi fornecido (se necessário, adicione validação aqui)
    if (!name) {
      session.flash('error', 'O nome da categoria é obrigatório!')
      return response.redirect().toRoute('categories.create') // Redireciona de volta para a página de criação
    }

    // Cria a nova categoria no banco de dados
    try {
      const category = await Category.create({ name })
      
      // Exibe uma mensagem de sucesso
      session.flash('success', 'Categoria criada com sucesso!')
      
      // Redireciona para a página de listagem das categorias
      return response.redirect().toRoute('categories.index')
    } catch (error) {
      // Em caso de erro ao criar a categoria, mostra um erro
      console.error('Erro ao criar categoria:', error)
      session.flash('error', 'Erro ao criar categoria. Tente novamente!')
      return response.redirect().toRoute('categories.create')
    }
  }
  // Exibe uma categoria específica
  public async show({ params, view }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return view.render('pages/categories/show', { category })  // Ajuste do caminho da view para 'pages/categories/show'
  }
}
