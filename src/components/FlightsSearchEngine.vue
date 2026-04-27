<template>
  <div class="search-engine-card">
    <div class="trip-type-tabs">
      <button class="active">Viaje redondo</button>
      <button>Viaje sencillo</button>
      <button>Multidestino</button>
    </div>

    <div class="search-inputs-grid">
      
      <div class="location-group">
        <div class="input-with-icon origin">
          <svg>...</svg> <input type="text" placeholder="Origen" value="Santiago (STI)">
        </div>
        
        <button class="swap-places-btn">
          <svg>...</svg> </button>

        <div class="input-with-icon destination">
          <svg>...</svg> <input type="text" placeholder="Destino">
        </div>
      </div>

      <div class="input-with-icon dates">
        <svg>...</svg> <input type="text" placeholder="Fechas: mié 29 - sáb 2">
      </div>

      <div class="input-with-icon passengers">
        <svg>...</svg> <input type="text" placeholder="1 pasajero, Económica">
      </div>

      <button class="hotelier-search-btn">Buscar</button>
    </div>

    <div class="add-stay-option">
      <input type="checkbox" id="addStay">
      <label for="addStay">Agregar una estancia para armar un viaje y ahorrar*</label>
    </div>
  </div>
</template>

<style scoped>
/* Integrando el buscador como una tarjeta en blanco igual que en Imagen 2 */
.search-engine-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08); /* Sombra suave */
}

/* Tabs (Estilo Imagen 3) */
.trip-type-tabs { display: flex; gap: 20px; border-bottom: 1px solid #eee; margin-bottom: 25px; }
.trip-type-tabs button { background: none; border: none; padding: 10px 0; color: #555; cursor: pointer; }
.trip-type-tabs button.active { color: #0066cc; border-bottom: 2px solid #0066cc; font-weight: bold; }

/* Grid de Inputs */
.search-inputs-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto; /* Origen/Dest, Fechas, Pasajeros, Botón */
  gap: 15px;
  align-items: center;
}

/* Grupo Origen/Destino */
.location-group { position: relative; display: flex; gap: 10px; }
.swap-places-btn { position: absolute; left: calc(50% - 15px); top: 10px; background: white; border: 1px solid #ccc; border-radius: 50%; width: 30px; height: 30px; z-index: 2; cursor: pointer; display: flex; align-items: center; justify-content: center;}

/* Inputs genéricos */
.input-with-icon { position: relative; }
.input-with-icon input { width: 100%; height: 50px; border-radius: 8px; border: 1px solid #ddd; padding-left: 40px; font-size: 15px; }
.input-with-icon svg { position: absolute; left: 12px; top: 15px; width: 20px; height: 20px; fill: #777; }

/* Botón Buscar (Copiando estilo de Imagen 2) */
.hotelier-search-btn {
  background-color: #1a5c8c; /* Azul oscuro Hotelier */
  color: white;
  border: none;
  padding: 0 30px;
  height: 50px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.hotelier-search-btn:hover { background-color: #144970; }

.add-stay-option { margin-top: 20px; color: #555; font-size: 14px; display: flex; align-items: center; gap: 8px;}
</style>