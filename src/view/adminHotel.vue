<template>
  <div class="admin-layout">
    <BarSideAdmin @navigate="handleNavigation" />

    <main class="admin-main-content">
      <header class="form-header">
        <nav class="breadcrumbs">
          <span>Propiedades</span> 
          <i class="material-symbols-outlined">chevron_right</i> 
          <span class="active">Nueva</span>
        </nav>
        <h1>Registrar Propiedad</h1>
      </header>

      <div class="form-container">
        </div>
    </main>
  </div>
</template>

<script>
import BarSideAdmin from '../components/barSideAdmin.vue'

export default {
  name: 'AdminPanel',
  components: {
    BarSideAdmin
  },
  methods: {
    handleNavigation(item) {
      console.log('Navegando a:', item.label)
     
    }
  }
}
</script>

<style scoped src="../assets/css/adminHotel.css"></style>