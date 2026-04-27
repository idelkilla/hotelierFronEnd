<template>
  <div class="hotelier-main-container">
    <Header />

    <main class="vuelos-layout">
      <aside class="sidebar-filters">
        <div class="filter-group">
          <h3>Escalas</h3>
          <div class="filter-option">
            <input type="checkbox" id="directo">
            <label for="directo">Directo</label>
          </div>
          <div class="filter-option">
            <input type="checkbox" id="1escala">
            <label for="1escala">1 Escala</label>
          </div>
        </div>

        <div class="filter-group">
          <h3>Rango de Precio</h3>
          <div class="price-range">
             <div class="input-dollar"><span>$</span><input type="number" placeholder="Mínimo"></div>
             <div class="input-dollar"><span>$</span><input type="number" placeholder="Máximo"></div>
          </div>
        </div>
      </aside>

      <section class="main-content">
        <FlightsSearchEngine />

        <h2 class="results-title">Resultados de búsqueda</h2>

        <PopularAirlines />

        <div class="flight-results">
          <p>Los resultados aparecerán aquí...</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import FlightsSearchEngine from '../components/FlightsSearchEngine.vue';
import PopularAirlines from '../components/PopularAirlines.vue';

export default {
  name: 'VuelosView',
  components: {
    Header,
    FlightsSearchEngine,
    PopularAirlines
  }
}
</script>

<style scoped>
<style scoped>
/* ESTO ES LO QUE ARREGLA EL DESBORDAMIENTO */
* {
  box-sizing: border-box; /* Fundamental: el padding no suma ancho extra */
}

.hotelier-main-container {
  background-color: #f4f6f8;
  min-height: 100vh;
  padding-top: 80px;
  width: 100%;       /* Asegura que no sobrepase el ancho de pantalla */
  overflow-x: hidden; /* Oculta cualquier cosa que intente desbordar */
}

.vuelos-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  max-width: 1200px; /* Reduje un poco el max-width para que sea más cómodo */
  margin: 0 auto;
  padding: 20px;
  width: 95%;        /* Asegura fluidez */
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-width: 0;      /* Esto evita que elementos hijos grandes expandan el grid */
}

/* Ajuste específico para el buscador para que no se salga */
.search-inputs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Hace que las columnas sean proporcionales */
  gap: 10px;
  width: 100%;
}

/* Tus estilos previos se mantienen igual debajo de esto */
.results-title {
  color: #191e3b;
  font-size: 24px;
  font-weight: 700;
  margin: 10px 0;
}

.sidebar-filters {
  background: white;
  padding: 20px;
  border-radius: 12px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.results-title {
  color: #191e3b;
  font-size: 24px;
  font-weight: 700;
  margin: 10px 0;
}

.price-range { display: flex; gap: 10px; }
.input-dollar { position: relative; flex: 1; }
.input-dollar span { position: absolute; left: 10px; top: 10px; color: #555; }
.input-dollar input { padding-left: 25px; width: 100%; height: 40px; border-radius: 8px; border: 1px solid #ddd; }

.filter-group h3 { font-size: 16px; margin-bottom: 15px; color: #191e3b; }
.filter-option { margin-bottom: 10px; display: flex; align-items: center; gap: 8px;}
</style>