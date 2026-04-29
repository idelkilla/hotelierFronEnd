<template>
  <div class="location-dropdown">
    <div v-if="loading" class="location-item">
      <span class="loc-details">Cargando ubicaciones...</span>
    </div>
    <div v-else-if="items.length === 0" class="location-item">
      <span class="loc-details">No se encontraron ubicaciones</span>
    </div>
    <div v-for="loc in items" :key="loc.id" class="location-item"
      @mousedown="$emit('select', loc)">
      <span class="material-symbols-outlined icon-location">
        {{ getIcon(loc.id_tipo, loc.icono) }}
      </span>
      <div class="location-text">
        <span class="loc-name">{{ loc.ubicacion }}</span>
        <span class="loc-details">{{ loc.ciudad }}, {{ loc.pais }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  items: {
    type: Array,
    default: () => []
  }
});
defineEmits(['select']);

// Función para determinar el icono según la BD
function getIcon(idTipo, iconoDb) {
  // Si viene el icono de la BD, usarlo directamente (prioridad 1)
  if (iconoDb && iconoDb.trim() !== '') {
    return iconoDb
  }

  // Fallback según ID_TIPO si no hay icono en BD
  switch(idTipo) {
    case 1:
      return 'local_airport'  // Aeropuerto
    case 2:
      return 'account_balance'  // Monumento
    case 3:
      return 'park'  // Parque
    case 4:
      return 'apartment'  // Hotel
    case 5:
      return 'restaurant'  // Restaurante
    case 6:
      return 'museum'  // Museo
    default:
      return 'location_on'  // Por defecto
  }
}
</script>

<style scoped>
.location-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 2000;
  max-height: 350px;  
  padding: 8px;     
  overflow-y: auto;      
}

.location-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 10px;
  gap: 12px;
}

.location-item:hover {
  background: #f5f7fa;
  transform: translateX(4px);
}

.location-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.loc-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.loc-details {
  font-size: 13px;
  color: #717171;
  margin-top: 3px;
}

.icon-location {
  color: #265073;
  font-size: 28px;
  flex-shrink: 0;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.location-item:hover .icon-location {
  color: #1976d2;
  transform: scale(1.1);
}

/* Scrollbar personalizado */
.location-dropdown::-webkit-scrollbar {
  width: 6px;
}

.location-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.location-dropdown::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.location-dropdown::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .location-item {
    padding: 10px 12px;
    gap: 10px;
  }

  .icon-location {
    font-size: 24px;
    min-width: 24px;
  }

  .loc-name {
    font-size: 14px;
  }

  .loc-details {
    font-size: 12px;
  }
}
</style>
