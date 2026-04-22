<template>
  <div class="admin-layout">
    <BarSideAdmin />
    <main class="admin-main-content">
      <header class="admin-topbar">
        <h2>Panel de Administración</h2>
        <div class="topbar-profile">
          <div class="topbar-info">
            <span class="topbar-name">{{ name }}</span>
            <span class="topbar-role">Administrador</span>
          </div>
          <div class="topbar-avatar">{{ initial }}</div>
        </div>
      </header>
      <section class="admin-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BarSideAdmin from '../components/barSideAdmin.vue';

const name = ref('Admin');
const initial = ref('A');

onMounted(() => {
  const storedName = localStorage.getItem('user_name');
  if (storedName) {
    name.value = storedName;
    initial.value = storedName.charAt(0).toUpperCase();
  }
});
</script>

<style>
@import '../assets/css/adminHotel.css';
</style>