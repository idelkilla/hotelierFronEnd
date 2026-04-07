<template>
  <div class="user-menu" ref="menuRef" role="menu" aria-label="User menu">

    <!-- HEADER -->
    <div class="header">
      <div class="header-info">
        <p class="greeting">Hola, <strong>{{ user?.nombre ?? 'Usuario' }}</strong></p>
        <p class="email">{{ user?.email ?? '' }}</p>
      </div>
      <span class="badge" :class="`badge-${(user?.nivel ?? 'blue').toLowerCase()}`">
        {{ user?.nivel ?? 'Blue' }}
      </span>
    </div>

    <div class="divider" />

    <!-- PUNTOS -->
    <div class="points-section">
      <div class="points-label-row">
        <span class="points-label">Puntos acumulados</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
      </div>
      <p class="points-amount">${{ formatPoints(user?.puntos) }}</p>
    </div>

    <!-- PROGRESO -->
    <button class="rewards-row" type="button">
      <div class="rewards-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="1.5">
          <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
        </svg>
      </div>
      <div class="rewards-text">
        <span class="rewards-link-text">Ver actividad de recompensas</span>
        <span class="rewards-sub">
          {{ user?.componentes_actuales ?? 0 }} de {{ user?.componentes_requeridos ?? 5 }}
          componentes de viaje para acceder al nivel <strong>{{ nextLevel }}</strong>
        </span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><path d="M9 6l6 6l-6 6"/></svg>
    </button>

    <div class="divider" />

    <!-- BANNER PROMO -->
    <button class="promo-card" type="button">
      <div class="promo-img">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1a1aff" opacity="0.85">
          <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" stroke="#fff" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="promo-body">
        <p class="promo-title">Acumula hasta $350 en crédito<br/>de puntos</p>
        <p class="promo-sub">Se aplican términos y condiciones.</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><path d="M9 6l6 6l-6 6"/></svg>
    </button>

    <div class="divider" />

    <!-- MENÚ ITEMS -->
    <button class="menu-item" type="button">Mi cuenta</button>
    <button class="menu-item" type="button">Lista de favoritos</button>
    <button class="menu-item" type="button">Descubrir One Key</button>
    <button class="menu-item" type="button">Sugerencias</button>

    <div class="divider" />

    <button class="menu-item logout" type="button" @click="logout">Cerrar sesión</button>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  user: {
    type: Object,
    default: null,
    // {
    //   nombre: String,
    //   email: String,
    //   nivel: 'Blue' | 'Silver' | 'Gold',
    //   puntos: Number,
    //   componentes_actuales: Number,
    //   componentes_requeridos: Number
    // }
  },
});

const emit = defineEmits(["close"]);
const menuRef = ref(null);

const levelOrder = ["Blue", "Silver", "Gold"];

const nextLevel = computed(() => {
  const idx = levelOrder.indexOf(props.user?.nivel ?? "Blue");
  return idx < levelOrder.length - 1 ? levelOrder[idx + 1] : "Gold";
});

const formatPoints = (val) => {
  if (!val && val !== 0) return "0.00";
  return Number(val).toLocaleString("es-DO", { minimumFractionDigits: 2 });
};

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) emit("close");
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));

const logout = () => {
  localStorage.clear();
  emit("close");
  location.reload();
};
</script>

<style scoped src="../assets/css/UserMenu.css"></style>