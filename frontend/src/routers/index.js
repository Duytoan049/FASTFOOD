import { createWebHistory, createRouter } from 'vue-router';
import CustomerBook from '@/views/CustomerBook.vue';
import HomePage from '@/views/HomePage.vue';
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import Menu from '@/views/Menu.vue';
import Profile from '@/views/Profile.vue';
import Admin from '@/views/Admin.vue';
import ProductCatalog from '@/views/ProductCatalog.vue';
import AddProduct from '@/views/AddProduct.vue';
const routes = [
  {
    path: '/',
    name: 'homepage',
    component: HomePage
  },
  {
    path: '/menu',
    name: 'menu',
    component: Menu
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: 'product',
        name: 'productadmin',
        component: ProductCatalog
      },
      {
        path: 'customer',
        name: 'customeradmin',
        component: CustomerBook
      }
    ]
  },
  {
    path: '/addproduct',
    name: 'addproduct',
    component: AddProduct
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
