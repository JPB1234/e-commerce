import { HttpContext } from "@adonisjs/core/http"
import Category from "#models/category"

export default class CategoriesController {
  public async index({ view }: HttpContext) {
      const categories = await Category.all();  
      return view.render('pages/categories/index', {categories: categories});
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/categories/create')  
  }

  public async store({ request, response, session }: HttpContext) {
    const name = request.input('name')

    if (!name) {
      session.flash('error', 'O nome da categoria é obrigatório!')
      return response.redirect().toRoute('categories.create') 
    }

    try {
      const category = await Category.create({ name })
      
      session.flash('success', 'Categoria criada com sucesso!')
      
      return response.redirect().toRoute('categories.index')
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      session.flash('error', 'Erro ao criar categoria. Tente novamente!')
      return response.redirect().toRoute('categories.create')
    }
  }
  public async show({ params, view }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return view.render('pages/categories/show', { category }) 
  }
}
