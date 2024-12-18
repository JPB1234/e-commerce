import { HttpContext } from '@adonisjs/core/http';
import Product from '#models/product';
import Category from '#models/category';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers'

export default class ProductsController {
  // Lista de produtos com paginação e filtro por nome
  async index({ request, view }: HttpContext) {
    const category_id = request.input('category');

    const query = Product.query().preload('category');

    if (category_id) {
      query.where('category_id', category_id);
    }

    const products = await query;
    const categories = await Category.all();

    return view.render('pages/products/index', {
      products,
      categories,
    });
  }

  async show({ view, params }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id);
      await product.load('category');
      const categories = await Category.all();

      return view.render('pages/products/show', { product, categories });
    } catch (error) {
      return view.render('pages/products/index', { error: 'Produto não encontrado' });
    }
  }

  // Criação de novo produto
  async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'price', 'description', 'category_id', 'stock']); // Dados do formulário
    let imageUrl = null;

    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    });

    if (image) {
      const fileName = `${cuid()}.${image.extname}`; 
      await image.move(app.makePath('public', 'images'), {
        name: fileName,
        overwrite: true,
      });
      imageUrl = `/images/${fileName}`; 
    }

    const product = await Product.create({ ...payload, imageUrl });
    return response.redirect().toRoute('products.show', { id: product.id });
  }

  // Exibe a página de criação do produto
  async create({ view }: HttpContext) {
    const categories = await Category.all();
    return view.render('pages/products/create', { categories });
  }

  // Atualiza as informações do produto
  async patch({ params, request }: HttpContext) {
    const product = await Product.findOrFail(params.id);
    const payload = request.only(['name', 'price', 'description', 'category_id', 'stock']);
    let imageUrl = product.imageUrl; 

    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    });

    if (image) {
      const fileName = `${cuid()}.${image.extname}`;
      await image.move(app.makePath('public', 'images'), {
        name: fileName,
        overwrite: true,
      });
      imageUrl = `/images/${fileName}`;
    }

    product.merge({ ...payload, imageUrl });
    await product.save();

    return product; 
  }

  // Exclui o produto
  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id);

    await product.delete(); 

    return { success: `${params.id} removido` }; 
  }
}
