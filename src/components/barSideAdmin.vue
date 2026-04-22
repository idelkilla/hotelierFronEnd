<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': collapsed }]">
    <div class="sidebar__brand">
      <span class="sidebar__brand-text">Hotelier Admin</span>
    </div>

    <nav class="sidebar__nav">
      <div 
        v-for="item in menuItems" 
        :key="item.id"
        :class="['nav-item', { 'nav-item--active': activeId === item.id }]"
        @click="activeId = item.id; if(item.id === 'rooms') router.push('/admin/agregar-hotel')"
        :title="collapsed ? item.label : ''"
      >
        <div class="nav-item__bg" :key="activeId + item.id"></div>
        
        <span class="nav-item__icon"><i :class="item.icon"></i></span>
        
        <span class="nav-item__label">{{ item.label }}</span>
        
        <span v-if="item.badge && !collapsed" class="nav-item__badge">{{ item.badge }}</span>
      </div>
    </nav>

    <footer class="sidebar__footer">
      <div class="nav-item logout-item" @click="logout" :title="collapsed ? 'Cerrar sesión' : ''">
        <span class="nav-item__icon"><i class="fas fa-sign-out-alt"></i></span>
        <span class="nav-item__label">Cerrar sesión</span>
      </div>
    </footer>

    <!-- Toggle fuera del overflow -->
    <button class="sidebar__toggle" @click="collapsed = !collapsed">
      <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeId = ref('dashboard');
const collapsed = ref(false);
const name = ref('Admin');
const initial = ref('A');

onMounted(() => {
  const storedName = localStorage.getItem('user_name');
  if (storedName) {
    name.value = storedName;
    initial.value = storedName.charAt(0).toUpperCase();
  }
});

const logout = () => {
  localStorage.clear();
  router.push('/register');
};

const menuItems = [
  { id: 'dashboard',  label: 'Dashboard',     icon: 'fas fa-home' },
  { id: 'rooms',      label: 'Habitaciones',  icon: 'fas fa-bed',    badge: '12' },
  { id: 'bookings',   label: 'Reservas',      icon: 'fas fa-calendar-check' },
  { id: 'users',      label: 'Usuarios',      icon: 'fas fa-users' },
  { id: 'settings',   label: 'Configuración', icon: 'fas fa-cog' },
];
</script>

<style>
@import '../assets/css/barSideAdmin.css';
</style>