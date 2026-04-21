<template>
  <aside class="sidebar">
    <div class="sidebar__brand">Hotelier Admin</div>
    
    <nav class="sidebar__nav">
      <div 
        v-for="item in menuItems" 
        :key="item.id"
        :class="['nav-item', { 'nav-item--active': activeId === item.id }]"
        @click="activeId = item.id"
      >
        <div class="nav-item__bg"></div>
        
        <span class="nav-item__icon">
          <i :class="item.icon"></i>
        </span>
        
        <span class="nav-item__label">{{ item.label }}</span>
        
        <span v-if="item.badge" class="nav-item__badge">{{ item.badge }}</span>
      </div>
    </nav>

    <footer class="sidebar__footer">
      <a href="#">Soporte</a>
      <a href="#">Privacidad</a>
    </footer>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const activeId = ref('dashboard');

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { id: 'rooms', label: 'Habitaciones', icon: 'fas fa-bed', badge: '12' },
  { id: 'bookings', label: 'Reservas', icon: 'fas fa-calendar-check' },
  { id: 'users', label: 'Usuarios', icon: 'fas fa-users' },
  { id: 'settings', label: 'Configuración', icon: 'fas fa-cog' },
];
</script>

<style>
@import '../assets/css/barSideAdmin.css';
</style>