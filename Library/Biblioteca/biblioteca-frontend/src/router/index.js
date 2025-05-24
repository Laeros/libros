import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import AuthorBooksManager from '../views/AuthorBooksManager.vue'
import BookForm from '../views/BookForm.vue';
import AuthorForm from '../views/AuthorForm.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/books/new', name: 'AddBook', component: BookForm },
  { path: '/books/edit/:id', name: 'EditBook', component: BookForm, props: true }, 
  { path: '/authors/edit/:id', name: 'EditAuthor', component: AuthorForm, props: true }, 
  { path: '/authors/new', name: 'AddAuthor', component: AuthorForm },
  { path: '/admin', name: 'AdminPanel', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/author-books', name: 'AuthorBooksManager', component: AuthorBooksManager },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
