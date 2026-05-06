<template>
  <div class="favoritos-view-container">
    <!-- Llamamos al Header -->
    <Header />

    <!-- Contenido principal: Aquí se muestra la lista de favoritos -->
    <main class="main-content">
      <ListaFav />
    </main>

    <!-- Llamamos al Footer -->
    <FooterComponent />
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import ListaFav from "../components/ListaFav.vue";
import FooterComponent from "../components/footer.vue";
</script>

<style scoped>
.favoritos-view-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Espacio para que el Header no tape el contenido */
}

@media (max-width: 768px) {
  .main-content { padding-top: 60px; }
}
</style>