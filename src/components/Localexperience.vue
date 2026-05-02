<template>
  <section class="local-experience">
    <h2 class="local-title">Vive la experiencia local en un hospedaje en {{ destination }}</h2>

    <div class="cards-wrapper">
      <div
        v-for="(category, index) in categories"
        :key="category.id"
        class="card"
        :class="{ 'card--tall': index === 1 }"
        @mouseenter="hovered = category.id"
        @mouseleave="hovered = null"
      >
        <img
          :src="category.image"
          :alt="category.label"
          class="card__img"
          :class="{ 'card__img--zoomed': hovered === category.id }"
        />
        <div class="card__overlay"></div>
        <span class="card__label">{{ category.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  destination: {
    type: String,
    default: 'Puerto Plata'
  },
  categories: {
    type: Array,
    default: () => [
      {
        id: 1,
        label: 'Casas de vacaciones',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'
      },
      {
        id: 2,
        label: 'Departamentos y condominios',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80'
      },
      {
        id: 3,
        label: 'Cabañas',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'
      },
      {
        id: 4,
        label: 'Casas de campo',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80'
      },
      {
        id: 5,
        label: 'Villas',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80'
      }
    ]
  }
})

const hovered = ref(null)
</script>

<style scoped>
.local-experience {
  padding: 40px 0;
  max-width: 1280px;
  margin: 0 auto;
  font-family: sans-serif;
}

.local-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 20px;
  line-height: 1.3;
}

/* ── Grid ────────────────────────────────────── */
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 240px;
  gap: 10px;
  align-items: stretch;
}

/* Segunda card más alta */
.card--tall {
  margin-top: -20px;
  margin-bottom: 0;
  grid-row: span 1;
  align-self: stretch;
  height: calc(100% + 20px);
}

/* ── Card ────────────────────────────────────── */
.card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  height: 240px;
}

.card--tall {
  height: 260px;
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}

.card__img--zoomed {
  transform: scale(1.06);
}

.card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
  border-radius: 14px;
}

.card__label {
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

/* ── Responsive ──────────────────────────────── */
@media (max-width: 1024px) {
  .cards-wrapper {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
  .card, .card--tall {
    height: 200px;
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .local-title { font-size: 18px; }
  .cards-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
  .card, .card--tall {
    height: 160px;
  }
}

@media (max-width: 400px) {
  .cards-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>