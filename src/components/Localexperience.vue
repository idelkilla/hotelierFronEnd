<template>
  <section class="le-wrapper">
    <div class="le-container">

      <div class="le-header">
        <h2 class="le-title">{{ title }}</h2>
        <p class="le-subtitle">{{ subtitle }}</p>
      </div>

      <div class="le-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="le-card"
        >
          <img :src="category.image" :alt="category.label" class="le-card__img" />
          <div class="le-card__overlay"></div>
          <span class="le-card__label">{{ category.label }}</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Hospedajes que convierten un viaje en una experiencia'
  },
  subtitle: {
    type: String,
    default: 'Encuentra el alojamiento perfecto para cada tipo de viaje'
  },
  categories: {
    type: Array,
    default: () => [
      {
        id: 1,
        label: 'Casas de vacaciones',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
      },
      {
        id: 2,
        label: 'Departamentos y condominios',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80'
      },
      {
        id: 3,
        label: 'Cabañas',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'
      },
      {
        id: 4,
        label: 'Casas de campo',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'
      },
      {
        id: 5,
        label: 'Villas',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'
      }
    ]
  }
})
</script>

<style scoped>
/* ── Wrapper: misma estructura que .page-wrapper ── */
.le-wrapper {
  background-color: #ffffff;
  padding: 2rem;                /* idéntico al padding de .page-wrapper */
  display: flex;
  justify-content: center;
}

/* ── Container: mismo max-width que .container ── */
.le-container {
  max-width: 1152px;            /* idéntico al max-width de .container  */
  width: 100%;
}

/* ── Header: mismos estilos que .section-header + .main-title + .subtitle ── */
.le-header {
  text-align: left;
  margin-bottom: 1.5rem;
}

.le-title {
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #191e3b;
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
  line-height: 1.3;
}

.le-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #444444;
  font-weight: 400;
}

/* ── Grid de tarjetas ── */
.le-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

/* ── Tarjeta ── */
.le-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  height: 240px;
}

.le-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}

.le-card:hover .le-card__img {
  transform: scale(1.07);
}

.le-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.08) 55%,
    transparent 100%
  );
  transition: background 0.45s ease;
}

.le-card:hover .le-card__overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.15) 55%,
    transparent 100%
  );
}

.le-card__label {
  position: absolute;
  bottom: 13px;
  left: 13px;
  right: 13px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .le-grid { grid-template-columns: repeat(3, 1fr); }
  .le-card { height: 200px; }
}

@media (max-width: 640px) {
  .le-title { font-size: 20px; }
  .le-grid  { grid-template-columns: repeat(2, 1fr); }
  .le-card  { height: 160px; }
}

@media (max-width: 400px) {
  .le-grid { grid-template-columns: 1fr; }
}
</style>