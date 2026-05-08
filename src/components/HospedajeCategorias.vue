<template>
  <section class="le-wrapper">
    <div class="le-container">
      <div class="le-header" v-if="title || subtitle">
        <h2 class="le-title">{{ title }}</h2>
        <p v-if="subtitle" class="le-subtitle">{{ subtitle }}</p>
      </div>

      <div class="le-grid">
        <article
          v-for="category in categories"
          :key="category.id"
          class="le-card"
          @click="$emit('select', category)"
        >
          <img 
            :src="category.image" 
            :alt="category.label" 
            class="le-card__img" 
            loading="lazy" 
            decoding="async"
          />
          <div class="le-card__overlay"></div>
          <span class="le-card__label">{{ category.label }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['select'])

defineProps({
  title: {
    type: String,
    default: "Vive la experiencia local en un hospedaje en Puerto Plata"
  },
  subtitle: {
    type: String,
    default: "Descubre hospedajes auténticos con encanto creado para ti"
  },
  categories: {
    type: Array,
    default: () => [
      { id: 1, label: 'Casas de vacaciones',       image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format' },
      { id: 2, label: 'Departamentos y condominios',image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80&auto=format' },
      { id: 3, label: 'Cabañas',                   image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80&auto=format' },
      { id: 4, label: 'Casas de campo',            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80&auto=format' },
      { id: 5, label: 'Villas',                    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format' },
    ]
  }
})
</script>

<style scoped>
.le-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
}

.le-container {
  max-width: 1152px;
  width: 100%;
}

.le-header {
  margin-bottom: 1.5rem;
}

.le-title {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #191e3b;
  margin: 0 0 0.25rem;
  line-height: 1.3;
}

.le-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #444444;
  margin: 0;
}

.le-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.le-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer; /* Se mantiene el cursor para indicar interactividad */
  min-height: 300px; /* Aumentado para hacer las imágenes más altas */
  background-color: #f0f0f0;
  transition: transform 0.3s ease;
}

.le-card:hover {
  transform: translateY(-6px);
}

.le-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.le-card:hover .le-card__img {
  transform: scale(1.06);
}

.le-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
}

.le-card__label {
  position: absolute;
  left: 12px;
  bottom: 12px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  max-width: 80%;
}

@media (max-width: 1024px) {
  .le-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 680px) {
  .le-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .le-card { min-height: 240px; } /* Ajustado para pantallas medianas */
}

@media (max-width: 420px) {
  .le-grid { grid-template-columns: 1fr; gap: 10px; }
  .le-card { min-height: 200px; } /* Ajustado para pantallas pequeñas */
}
</style>