import { HttpContext } from "@adonisjs/core/http"
import Category from "#models/category"

export default class CategoriesController {
  // Renderiza o formulário de criação
  public async create({ view }: HttpContext) {
    return view.render('pages/categories/create')
  }

  // Salva a nova categoria no banco de dados
  public async store({ request, response, session }: HttpContext) {
    const name = request.input('name') // Pega o nome do formulário

    try {
      // Cria uma nova categoria no banco
      const category = await Category.create({ name })
      
      // Usando a variável category para garantir que ela seja registrada corretamente
      console.log(category) // Opcional: Para fins de debug ou qualquer outra ação

      // Se sucesso, envia mensagem para a view
      session.flash('success', 'Categoria criada com sucesso!')
      return response.redirect().toRoute('categories.create')
    } catch (error) {
      // Se erro, envia mensagem para a view
      session.flash('error', 'Erro ao criar categoria.')
      return response.redirect().toRoute('categories.create')
    }
  }
}