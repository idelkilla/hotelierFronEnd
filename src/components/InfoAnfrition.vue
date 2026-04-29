<template>
  <section class="host-section">
    <h2 class="host-title">Sobre el anfitrión</h2>

    <div class="host-card">
      <div class="host-avatar-wrapper">
        <img :src="host.photo" :alt="`Foto de ${host.name}`" class="host-avatar" />
        <span class="host-badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Superanfitrión
        </span>
      </div>

      <div class="host-info">
        <div class="host-top">
          <p class="host-name">{{ host.name }}</p>
          <div class="host-meta">
            <span>{{ host.propertyName }}</span>
            <span class="dot">·</span>
            <span>{{ host.years }} años anfitrión</span>
            <span class="dot">·</span>
            <span>⭐ {{ host.rating }}</span>
          </div>
        </div>
        <p class="host-description">{{ host.description }}</p>
    </div>
    </div>
  </section>
</template>

<script setup>
const host = {
  name: "Carlos Méndez",
  propertyName: "Puerto Plata, Rep. Dom.",
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  rating: "4.98",
  years: 6,
  description:
    "Hola, soy Carlos, anfitrión desde 2018. Me apasiona brindar experiencias únicas en el Caribe. Respondo mensajes en menos de una hora.",
};
</script>

<style scoped>
.host-section {
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;

}
.host-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.host-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.host-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
}

.host-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid #1e3a5f;
}

.host-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.62rem;
  font-weight: 600;
  color: #1e3a5f;
  background: #e8f0fe;
  border-radius: 999px;
  padding: 2px 7px;
  white-space: nowrap;
}

.host-info {
  flex: 1;
}

.host-top {
  margin-bottom: 0.3rem;
}

.host-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.host-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: #6b7280;
  flex-wrap: wrap;
}

.dot {
  color: #d1d5db;
}

.host-description {
  font-size: 0.82rem;
  color: #374151;
  line-height: 1.5;
  margin: 0;
  max-width: 600px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.host-contact-btn {
  flex-shrink: 0;
  padding: 0.45rem 1rem;
  border: 1.5px solid #1e3a5f;
  border-radius: 8px;
  background: transparent;
  color: #1e3a5f;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}

.host-contact-btn:hover {
  background: #1e3a5f;
  color: #fff;
}

@media (max-width: 600px) {
  .host-card {
    flex-wrap: wrap;
  }
  .host-contact-btn {
    width: 100%;
    text-align: center;
  }
}
</style>