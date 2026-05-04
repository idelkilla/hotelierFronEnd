import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/authService'

// Views
import Login             from '../view/login.vue';
import Register          from '../view/register.vue';
import Home              from '../view/Home.vue';
import Perfil            from '../view/Perfil.vue';
import head              from '../view/head.vue';
import servicioCliente   from '../view/servicioCliente.vue';
import ForgotPassword    from '../view/ForgotPassword.vue';
import ResetPassword     from '../view/ResetPassword.vue';

// Services & Details
import DetalleHospedaje  from '../view/DetalleHospedaje.vue';
import Cruceros          from '../view/Cruceros.vue'; 
import Vuelos            from '../view/Vuelos.vue'; 
import Carros            from '../view/Carros.vue';
import DetalleCarros     from '../view/DetalleCarros.vue';
import DetalleCrucero from '../view/DetalleCrucero.vue';
import Actividades from '../view/Actividades.vue';
import DetalleActividad from '../view/DetalleActividad.vue';
import servicesMenu      from '../components/servicesMenu.vue';

// Admin
import AdminLayout       from '../view/adminPanel.vue';
import AdminDashboard    from '../view/adminDashboard.vue'; 
import AdminHospedajes   from '../view/adminHospedajes.vue';
import AdminUsuarios     from '../components/AdminUsuarios.vue';
import AdminReservas     from '../components/Adminreservas.vue';
import AdminConfiguracion from '../components/Adminconfiguracion.vue';

const ADMIN_EMAIL = 'admin@gmail.com';

const routes = [
  { path: '/',                 redirect: '/home' },
  { path: '/home',             name: 'Home',             component: Home },
  { path: '/login',            name: 'Login',            component: Login },
  { path: '/register',         name: 'Register',         component: Register },
  { path: '/services',         name: 'servicesMenu',     component: servicesMenu },
  { path: '/head',             name: 'Head',             component: head },
  { path: '/Vuelos',           name: 'Vuelos',           component: Vuelos },
  { path: '/servicio-cliente', name: 'ServicioCliente',  component: servicioCliente },
  { path: '/hospedaje/:id',    name: 'DetalleHospedaje', component: DetalleHospedaje },
  { path: '/auto/:id',         name: 'DetalleCarros',    component: DetalleCarros },
  { path: '/Carros',           name: 'Carros',           component: Carros },
  { path: '/Cruceros',         name: 'Cruceros',         component: Cruceros },
  { path: '/perfil',           name: 'Perfil',           component: Perfil, meta: { requiresAuth: true } },
  { path: '/Actividades',      name: 'Actividades',      component: Actividades },
  
// dentro de routes:
{ path: '/actividades/:id', name: 'DetalleActividad', component: DetalleActividad },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAdmin: true } },
      { path: 'hospedajes/:vista?', name: 'AdminHospedajes', component: AdminHospedajes, meta: { requiresAdmin: true } },
      { path: 'usuarios/:pathMatch(.*)*', name: 'AdminUsuarios', component: AdminUsuarios, meta: { requiresAdmin: true } },
      { path: 'reservas', name: 'AdminReservas', component: AdminReservas, meta: { requiresAdmin: true } },
      { path: 'configuracion', name: 'AdminConfiguracion', component: AdminConfiguracion, meta: { requiresAdmin: true } },
    ]
  },
  { path: '/cruceros/:id', name: 'DetalleCrucero', component: DetalleCrucero },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'instant' }
  }
})

router.beforeEach(async (to, from, next) => {
  try {
    const isAuthenticated = authService.isAuthenticated()
    const userRole = localStorage.getItem('user_role')

    if (to.meta.requiresAdmin) {
      if (!isAuthenticated || userRole !== 'admin') {
        console.warn('Acceso denegado: Se requiere rol de administrador.')
        return next({ name: 'Home' })
      }
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next({ name: 'Login' })
    }

    if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
      if (userRole === 'admin') return next({ name: 'AdminDashboard' })
      return next({ name: 'Home' })
    }

    // Bloqueo de seguridad: El administrador solo puede acceder a áreas de gestión
    if (isAuthenticated && userRole === 'admin') {
      const isTargetAdmin = to.path.startsWith('/admin') || to.meta.requiresAdmin || to.name === 'Perfil'

      if (!isTargetAdmin) {
        console.warn('Bloqueo: El administrador solo puede acceder a áreas de gestión o a su Perfil.')
        return next({ name: 'AdminDashboard' })
      }
    }
    next()
  } catch (error) {
    console.error('Router guard error:', error)
    next({ name: 'Login' })
  }
})

export default router