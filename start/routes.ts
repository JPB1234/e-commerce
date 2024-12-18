import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Importação de controladores de forma dinâmica
const CategoryController = () => import('#controllers/categories_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const CartController = () => import('#controllers/cart_controller')
const AvatarsController = () => import('#controllers/avatars_controller')
const SocialAuthsController = () => import('#controllers/social_auths_controller')

router.get('/login/:provider',  [SocialAuthsController, 'redirect'])
router.get('/login/:provider/callback', [SocialAuthsController, 'callback'])



// Rota inicial
router.on('/').render('pages/home/show').as('home.show')

// Rota de Avatar
router.get('/avatars/:filename', [AvatarsController, 'show']).as('avatars.show')

// Rotas de autenticação
router
  .group(() => {
    router.get('/login', [AuthController, 'create']).as('auth.create')
    router.post('/login', [AuthController, 'store']).as('auth.store')
  })
  .use(middleware.guest())

// Rotas de cadastro de usuários
router
  .group(() => {
    router.get('/user', [UsersController, 'create']).as('users.create')
    router.post('/user', [UsersController, 'store']).as('users.store')
  })

// Rotas protegidas (usuário autenticado)
router
  .group(() => {
    router.get('/products/create', [ProductsController, 'create']).as('products.create') // Criar produto

    router.get('/cart', [CartController, 'show']).as('cart.show'); // Mostrar o carrinho
    router.post('/cart', [CartController, 'store']).as('cart.store'); // Adicionar item ao carrinho
    router.put('/cart/:id', [CartController, 'update']).as('cart.update'); // Atualizar item no carrinho
    router.delete('/cart/:id', [CartController, 'destroy']).as('cart.destroy'); // Remover item do carrinho
  
    router.get('/profile/edit', [UsersController, 'edit']).as('users.edit') // Editar perfil
    router.post('/profile/edit', [UsersController, 'update']).as('users.update') // Atualizar perfil
    router.get('/products/index', [ProductsController, 'index']).as('products.index') // Listar produtos
    router.get('/products/:id', [ProductsController, 'show']).as('products.show') // Mostrar produto
    router.get('/logout', [AuthController, 'destroy']).as('auth.destroy') //Logout
  })
  .use(middleware.auth())

// Rotas de admin para gerenciamento de produtos
router
  .group(() => {
    router.post('/products', [ProductsController, 'store']).as('products.store') // Salvar novo produto
    router.delete('/products/:id', [ProductsController, 'destroy']).as('products.destroy') // Excluir produto
    router.patch('/products/:id', [ProductsController, 'patch']).as('products.patch') // Atualizar produto
  })
  .use(middleware.admin()) 

// Rotas de categorias
router
  .group(() => {
    router.get('/categories', [CategoryController, 'index']).as('categories.index')//Lista de categorias
    router.get('/categories/create', [CategoryController, 'create']).as('categories.create') //Criar categoria
    router.post('/categories', [CategoryController, 'store']).as('categories.store') //Guardar categoria
    router.get('/categories/:id', [CategoryController, 'show']).as('categories.show') // Exibir categoria
  })
  .use(middleware.admin()) 
  
// Rotas de ajuda
router
  .group(() => {
    router.get('/help', async () => {
      return { message: 'Aqui está a seção de Ajuda e Suporte' }
    }).as('help.show')
  })
  .use(middleware.auth())
