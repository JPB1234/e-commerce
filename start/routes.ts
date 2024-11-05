/*
|------------------------------------------------------------------
| Routes file
|------------------------------------------------------------------
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const CategoryController = () => import('#controllers/categories_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const CartController = () => import('#controllers/cart_controller') // Adicionando o CartController

router.on('/').render('pages/home/show').as('home.show')

router.get('/login', [AuthController, 'create']).as('auth.create')
router.post('/login', [AuthController, 'store']).as('auth.store')
router.get('/logout', [AuthController, 'destroy']).use(middleware.auth()).as('auth.destroy')

router.get('/user', [UsersController, 'create']).as('users.create')
router.post('/user', [UsersController, 'store']).as('users.store')

// Rota para o carrinho
router.get('/cart', [CartController, 'show']).as('cart.show') // Adicionando a rota para visualizar o carrinho

// Grupo de rotas para produtos com autenticação
router
  .group(() => {
    router.get('/products', [ProductsController, 'index']).as('products.index')
    router.get('/products/new', [ProductsController, 'create']).as('products.create')
    router.get('/products/:id', [ProductsController, 'show']).as('products.show')
    router.get('/profile/edit', [UsersController, 'edit']).use(middleware.auth()).as('users.edit')
    router.get('/profile/settings', [UsersController, 'settings']).use(middleware.auth()).as('users.settings')
    router.post('/products', [ProductsController, 'store']).as('products.store')
    router.delete('/products/:id', [ProductsController, 'destroy']).as('products.destroy')
    router.patch('/products/:id', [ProductsController, 'patch']).as('products.patch')
  })
  .use(middleware.auth())

router.get('/categories/:id', [CategoryController, 'show']).as('categories.show')
