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
        @click="navigate(item)"
        :title="collapsed ? item.label : ''"
      >
        <div class="nav-item__bg" :key="activeId + item.id"></div>
        <span class="nav-item__icon"><i :class="item.icon"></i></span>
        <span class="nav-item__label">{{ item.label }}</span>
        <span v-if="item.badge && !collapsed" class="nav-item__badge">{{ item.badge }}</span>
      </div>
    </nav>

    <footer class="sidebar__footer">
      <div
        class="nav-item logout-item"
        @click="logout"
        :title="collapsed ? 'Cerrar sesión' : ''"
      >
        <span class="nav-item__icon"><i class="fas fa-sign-out-alt"></i></span>
        <span class="nav-item__label">Cerrar sesión</span>
      </div>
    </footer>

    <button class="sidebar__toggle" @click="collapsed = !collapsed">
      <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router   = useRouter()
const route    = useRoute()
const activeId = ref('dashboard')
const collapsed = ref(false)

const menuItems = [
  { id: 'dashboard', label: 'Dashboard',     icon: 'fas fa-home',           route: '/admin/dashboard' },
  { id: 'rooms',     label: 'Hospedajes',    icon: 'fas fa-bed',            route: '/admin/hospedajes', badge: '12' },
  { id: 'bookings',  label: 'Reservas',      icon: 'fas fa-calendar-check', route: '/admin/reservas' },
  { id: 'users',     label: 'Usuarios',      icon: 'fas fa-users',          route: '/admin/usuarios' },
  { id: 'settings',  label: 'Configuración', icon: 'fas fa-cog',            route: '/admin/configuracion' },
]

const syncActive = () => {
  const matched = menuItems.find(item => {
    // ✅ Dashboard solo activo en /admin exacto
    if (item.id === 'dashboard') return route.path === '/admin/dashboard' || route.path === '/admin'
    return route.path.startsWith(item.route)
  })
  if (matched) activeId.value = matched.id
}

onMounted(syncActive)

watch(() => route.path, syncActive)

const navigate = (item) => {
  activeId.value = item.id
  router.push(item.route)
}

// ✅ Redirige a /login, no a /register
const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style>
@import '../assets/css/barSideAdmin.css';
</style>