<template>
  <div class="airlines-section">
    <h3 class="section-subtitle">Aerolíneas más populares</h3>
    
    <div class="airlines-carousel">
      <div class="airline-card" v-for="airline in airlines" :key="airline.name">
        <img :src="airline.logo" :alt="airline.name" class="airline-logo">
        <span class="airline-name">{{ airline.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopularAirlines',
  data() {
    return {
      // Lista de ejemplo basada en tu imagen 3
      airlines: [
        { name: 'American Airlines', logo: '/path/to/logos/aa.png' },
        { name: 'United', logo: '/path/to/logos/united.png' },
        { name: 'Southwest Airlines', logo: '/path/to/logos/southwest.png' },
        { name: 'Delta', logo: '/path/to/logos/delta.png' },
        { name: 'Frontier Airlines', logo: '/path/to/logos/frontier.png' },
        { name: 'JetBlue Airways', logo: '/path/to/logos/jetblue.png' },
        { name: 'Alaska Airlines', logo: '/path/to/logos/alaska.png' },
      ]
    }
  }
}
</script>

<style scoped>
.airlines-section { margin: 20px 0 30px 0; }

.section-subtitle { font-size: 18px; color: #191e3b; margin-bottom: 15px; font-weight: 600; }

.airlines-carousel {
  display: flex;
  gap: 15px;
  overflow-x: auto; /* Permite scroll horizontal si son muchas */
  padding-bottom: 10px;
}

/* Estilo de tarjeta limpia para que se vea "lindo" e integrado */
.airline-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.airline-card:hover { transform: translateY(-3px); box-shadow: 0 5px 10px rgba(0,0,0,0.08); }

.airline-logo { height: 30px; max-width: 60px; object-fit: contain; }

.airline-name { font-size: 14px; color: #333; font-weight: 500; }
</style>