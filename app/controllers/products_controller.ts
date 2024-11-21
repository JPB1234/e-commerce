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

  // Exibe o produto
  async show({ view, params }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id);
      await product.load('category'); // Carrega a categoria associada
      const categories = await Category.all();

      return view.render('pages/products/show', { product, categories });
    } catch (error) {
      return view.render('pages/products/index', { error: 'Produto não encontrado' });
    }
  }

  // Criação de novo produto
  async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'price', 'description', 'category_id']); // Dados do formulário
    let imageUrl = null;

    // Lida com o upload da imagem
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    });

    if (image) {
      const fileName = `${cuid()}.${image.extname}`; // Nome único para o arquivo
      await image.move(app.makePath('public', 'images'), {
        name: fileName,
        overwrite: true,
      });
      imageUrl = `/images/${fileName}`; // Caminho público da imagem
    }

    // Cria o produto
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
    const payload = request.only(['name', 'price', 'description', 'category_id']);
    let imageUrl = product.imageUrl; // Manter a imagem existente por padrão

    // Lida com o upload de uma nova imagem, se houver
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

    // Atualiza os dados do produto
    product.merge({ ...payload, imageUrl });
    await product.save();

    return product; // Retorna o produto atualizado
  }

  // Exclui o produto
  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id);

    await product.delete(); // Exclui o produto

    return { success: `${params.id} removido` }; // Retorna mensagem de sucesso
  }
}
