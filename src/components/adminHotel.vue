<template>
  <div class="admin-layout">
    <BarSideAdmin />
    <main class="admin-main">
      <header class="admin-topbar">
        <h2>Panel de Administración</h2>
      </header>
      <section class="admin-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import BarSideAdmin from '../components/BarSideAdmin.vue';
</script>

<style>
@import '../assets/css/adminHotel.css';
</style>