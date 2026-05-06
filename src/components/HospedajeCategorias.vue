<template>
  <section class="hospedaje-section">
    <h2 class="section-title">Hospedajes que convierten un viaje en una experiencia</h2>
<p class="Texto">Encuentra el alojamiento perfecto para cada tipo de viaje</p>
    <div class="cards-container">
      <div
        v-for="categoria in categorias"
        :key="categoria.id"
        class="card"
        @click="irAHead(categoria)"
      >
        <div class="card-img-wrapper">
          <img
            :src="categoria.imagen"
            :alt="categoria.nombre"
            class="card-img"
          />
          <div class="card-overlay"></div>
          <span class="card-label">{{ categoria.nombre }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HospedajeCategorias',
  data() {
    return {
      categorias: [
        {
          id: 1,
          nombre: 'Casas de vacaciones',
          imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
          tipo: 'casas-de-vacaciones'
        },
        {
          id: 2,
          nombre: 'Departamentos y condominios',
          imagen: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
          tipo: 'departamentos-condominios'
        },
        {
          id: 3,
          nombre: 'Cabañas',
          imagen: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
          tipo: 'cabanas'
        },
        {
          id: 4,
          nombre: 'Casas de campo',
          imagen: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&q=80',
          tipo: 'casas-de-campo'
        },
        {
          id: 5,
          nombre: 'Villas',
          imagen: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
          tipo: 'villas'
        }
      ]
    }
  },
  methods: {
    irAHead(categoria) {
      this.$router.push({
        name: 'head',
        query: { tipo: categoria.tipo }
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');

.hospedaje-section {
  padding: 48px 32px;
  background: #ffffff;
  font-family: 'Inter', sans-serif;
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #191e3b;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.cards-container {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}
.Texto{
    color:#191e3b;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 24px;

}
.cards-container::-webkit-scrollbar {
  display: none;
}

.card {
  flex: 0 0 220px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.card-img-wrapper {
  position: relative;
  height: 280px;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.card:hover .card-img {
  transform: scale(1.07);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(10, 20, 50, 0.72) 100%
  );
}

.card-label {
  position: absolute;
  bottom: 16px;
  left: 14px;
  right: 14px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.3;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .hospedaje-section {
    padding: 32px 16px;
  }

  .section-title {
    font-size: 22px;
  }

  .card {
    flex: 0 0 175px;
  }

  .card-img-wrapper {
    height: 230px;
  }
}
</style>