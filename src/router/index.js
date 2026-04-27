import { createRouter, createWebHistory } from 'vue-router';
<<<<<<< HEAD
import Login                  from '../view/login.vue';
import Register               from '../view/register.vue';
import Home                   from '../view/Home.vue';
import authService            from '../services/authService';
import servicesMenu           from '../components/servicesMenu.vue';
import head                   from '../view/head.vue';
import servicioCliente        from '../view/servicioCliente.vue';
import DetalleHospedaje from '../view/DetalleHospedaje.vue'; 
import Vuelos from '../view/Vuelos.vue';// Asegúrate de que el nombre coincida
=======
import authService from '../services/authService';
>>>>>>> e60c33d22fe499b364d92a452216bd730975a260


import Login            from '../view/login.vue';
import Register         from '../view/register.vue';
import Home             from '../view/Home.vue';
import head             from '../view/head.vue';
import servicioCliente  from '../view/servicioCliente.vue';


import servicesMenu     from '../components/servicesMenu.vue';

import AdminLayout      from '../view/adminPanel.vue';
import AdminDashboard from '../view/adminDashboard.vue'; 
import AdminAgregarHotel from '../view/adminAgregarHotel.vue';

const ADMIN_EMAIL = 'admin@gmail.com';

const routes = [
  { path: '/',                 redirect: '/home' },
  { path: '/home',             name: 'Home',            component: Home },
  { path: '/login',            name: 'Login',           component: Login },
  { path: '/register',         name: 'Register',        component: Register },
  { path: '/services',         name: 'servicesMenu',    component: servicesMenu },
  { path: '/head',             name: 'Head',            component: head },
  { path: '/servicio-cliente', name: 'ServicioCliente', component: servicioCliente },
<<<<<<< HEAD
  { path: '/hospedaje/:id',
    component: () => import('../view/head.vue'), name: 'DetalleHospedaje', props: true},
  // Admin — protegida por JWT
  // { path: '/admin', name: 'Admin', component: AdminRegistrarPropiedad, meta: { soloAdmin: true } },
  { path: '/hospedaje/:id',   name: 'DetalleHospedaje', component: DetalleHospedaje},
  { path: '/vuelos', name: 'Vuelos', component: Vuelos },

=======
  

  { 
    path: '/admin',
    component: AdminLayout,
    meta: { soloAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'agregar-hotel', name: 'AdminAgregarHotel', component: AdminAgregarHotel },
    ]
  },
>>>>>>> e60c33d22fe499b364d92a452216bd730975a260
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