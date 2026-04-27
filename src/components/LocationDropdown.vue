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
      <span class="material-symbols-outlined icon-gray">
        {{ loc.id_tipo === 1 ? 'apartment' : (loc.id_tipo === 2 ? 'local_airport' : 'location_on') }}
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
  transition: background 0.2s ease;
  border-radius: 10px;  
}

.location-item:hover {
  background: #f5f7fa;
}

.location-text {
  display: flex;
  flex-direction: column;
  margin-left: 14px;
  text-align: left;
}

.loc-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
}

.loc-details {
  font-size: 14px;
  color: #717171;
  margin-top: 2px;
}

.icon-gray {
  color: #265073; /* Usamos el color primario para los iconos */
  font-size: 30px;
}
</style>