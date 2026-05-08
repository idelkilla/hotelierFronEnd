<script setup>

const plans = [
  {
    title: 'Paquetes baratos',
    description: 'Obtén más por menos con las ofertas de paquete',
    icon: 'luggage',
    badge: 'attach_money',
    buttonText: 'Más información',
    path: '/servicio-cliente'
  },
  {
    title: 'Hospedajes perfectos',
    description: 'Explora una amplia variedad de hoteles y casas vacacionales',
    icon: 'bed',
    badge: 'star',
    buttonText: 'Ver hospedajes',
    path: '/head'
  },
  {
    title: 'Precios claros',
    description: 'Sin sorpresas: incluimos impuestos y cargos extra',
    icon: 'verified',
    badge: 'check',
    buttonText: 'Ver detalles',
    path: '/servicio-cliente'
  }
];
</script>

<template>
  <main class="page-wrapper">
    <div class="container">
      <header class="section-header">
        <h1 class="main-title">Hospedajes para cada estilo de viaje</h1>
        <p class="subtitle">Precios promedio basados en el mes calendario actual</p>
      </header>

      <div class="grid">
        <div v-for="(plan, index) in plans" :key="index" class="pricing-card">
          <div class="card-content">
            
            <div class="icon-wrapper">
              <span class="material-symbols-outlined main-icon">{{ plan.icon }}</span>
              <div class="badge-coin" v-if="plan.badge">
                <span class="material-symbols-outlined">{{ plan.badge }}</span>
              </div>
            </div>

            <div class="header-section">
              <h2 class="plan-title">{{ plan.title }}</h2>
              <p class="plan-description">{{ plan.description }}</p>
            </div>
          </div>

          <div class="footer-section">
            <router-link :to="plan.path" class="action-button">{{ plan.buttonText }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style src="../assets/css/TravelPropositions.css"></style>