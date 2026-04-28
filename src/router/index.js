import { createRouter, createWebHistory } from 'vue-router';
import Login            from '../view/login.vue';
import Register         from '../view/register.vue';
import Home             from '../view/Home.vue';
import head             from '../view/head.vue';
import servicioCliente  from '../view/servicioCliente.vue';
import DetalleHospedaje from '../view/DetalleHospedaje.vue'; 
import Vuelos           from '../view/Vuelos.vue';
import servicesMenu     from '../components/servicesMenu.vue';
import authService      from '../services/authService';
import AdminLayout      from '../view/adminPanel.vue';
import AdminDashboard from '../view/adminDashboard.vue'; 
import AdminAgregarHotel from '../view/adminAgregarHotel.vue';
import Perfil from '../view/Perfil.vue';

const ADMIN_EMAIL = 'admin@gmail.com';

const routes = [
  { path: '/',                 redirect: '/home' },
  { path: '/home',             name: 'Home',            component: Home },
  { path: '/login',            name: 'Login',           component: Login },
  { path: '/register',         name: 'Register',        component: Register },
  { path: '/services',         name: 'servicesMenu',    component: servicesMenu },
  { path: '/head',             name: 'Head',            component: head },
  { path: '/servicio-cliente', name: 'ServicioCliente', component: servicioCliente },
  { path: '/hospedaje/:id',    name: 'DetalleHospedaje', component: DetalleHospedaje, props: true },
  { path: '/vuelos', name: 'Vuelos', component: Vuelos },
  { path: '/perfil',           name: 'Perfil',           component: Perfil, meta: { requiresAuth: true } },

  { 
    path: '/admin',
    component: AdminLayout,
    meta: { soloAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'agregar-hotel', name: 'AdminAgregarHotel', component: AdminAgregarHotel },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'instant' };
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const emailGuardado   = localStorage.getItem('user_email');
  const isAdmin         = emailGuardado === ADMIN_EMAIL;

  if (to.meta.soloAdmin) {
    if (!isAuthenticated || !isAdmin) {
      console.warn("Acceso denegado: Se requiere rol de administrador.");
      return next({ name: 'Home' });
    }
  }

  // Proteccion de ruta perfil (solo usuarios logueados)
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' });
  }

  // Si está autenticado y es admin, siempre redirigir a /admin
  if (isAuthenticated && isAdmin && (to.name === 'Home' || to.path === '/')) {
    return next({ name: 'AdminDashboard' });
  }

  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    if (isAdmin) return next({ name: 'AdminDashboard' });
    return next({ name: 'Home' });
  }

  next();
});

export default router;