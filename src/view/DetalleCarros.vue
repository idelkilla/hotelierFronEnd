<template>
  <div class="main-container">
    <Header />
    <DetalleCarro />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "../components/Header.vue";
import DetalleCarro from "../components/DetalleCarro.vue";
</script>

<style scoped>
.main-container {
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
}
</style>