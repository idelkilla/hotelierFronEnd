<template>
  
  <div class="user-menu" ref="menuRef" role="menu" aria-label="User menu">
    <div class="header">
      <div class="header-info">
        <p class="greeting">Hola, <strong>{{ userData.nombre }}</strong></p>
        <p class="email">{{ userData.email }}</p>
      </div>
      <span class="badge" :class="`badge-${userData.nivel.toLowerCase()}`">
        {{ userData.nivel }}
      </span>
    </div>

    <div class="divider" />

    <div class="points-section">
      <div class="points-label-row">
        <span class="points-label">Puntos acumulados</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
      </div>
      <p class="points-amount">${{ formatPoints(userData.puntos) }}</p>
    </div>

    <button class="rewards-row" type="button">
      <div class="rewards-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="1.5">
          <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
        </svg>
      </div>
      <div class="rewards-text">
        <div class="rewards-scroll-container">
          <span class="rewards-link-text">Ver actividad de recompensas</span>
          <span class="rewards-sub">
            {{ userData.componentes_actuales }} de {{ userData.componentes_requeridos }}
            componentes de viaje para acceder al nivel <strong>{{ nextLevel }}</strong>
          </span>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><path d="M9 6l6 6l-6 6"/></svg>
    </button>

    <div class="divider" />

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

    <button class="menu-item" type="button">Mi cuenta</button>
    <button class="menu-item" type="button">Lista de favoritos</button>
    <button class="menu-item" type="button">Descubrir One Key</button>
    <button class="menu-item" type="button">Sugerencias</button>

    <div class="divider" />

    <template v-if="isMobile">
      <div class="divider mobile-only-content" />
      <router-link to="/servicio-cliente" class="menu-item mobile-only-content">Servicio al cliente</router-link>
      <button class="menu-item mobile-only-content" type="button">Mis viajes</button>
      <button class="menu-item mobile-only-content" type="button" @click="$emit('open-services')">Planea tu viaje</button>
      <div class="divider mobile-only-content" />
    </template>

    <button class="menu-item logout" type="button" @click="logout">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from "vue";

const props = defineProps({
  user: { type: Object, default: null },
  isMobile: { type: Boolean, default: false } // Nueva prop
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const emit = defineEmits(["close"]);
const menuRef = ref(null);
const levelOrder = ["Blue", "Silver", "Gold"];

const defaultState = {
  nombre: 'Cargando...',
  email: '',
  nivel: 'Blue',
  puntos: 0,
  componentes_actuales: 0,
  componentes_requeridos: 5,
};

const isMobile = ref(window.innerWidth <= 768);

const userData = ref({ ...defaultState });

watchEffect(() => {
  if (props.user && props.user.nombre) {
    userData.value = { ...defaultState, ...props.user };
  }
});

const nextLevel = computed(() => {
  const idx = levelOrder.indexOf(userData.value.nivel);
  return idx < levelOrder.length - 1 ? levelOrder[idx + 1] : "Gold";
});

const formatPoints = (val) => {
  if (!val && val !== 0) return "0.00";
  return Number(val).toLocaleString("es-DO", { minimumFractionDigits: 2 });
};

const fetchProfile = async () => {
  if (props.user && props.user.nombre) return;

  // ✅ Fix: usar la misma key que guarda el Header
  const token = localStorage.getItem('user_token');
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error('Error al obtener perfil:', response.status);
      return;
    }

    const data = await response.json();
    userData.value = { ...defaultState, ...data };

  } catch (error) {
    console.error("Error cargando perfil del backend:", error);
  }
};

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) emit("close");
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
  fetchProfile();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});

const logout = () => {
  localStorage.clear();
  emit("close");
  location.reload();
};
</script>

<style scoped src="../assets/css/UserMenu.css"></style>