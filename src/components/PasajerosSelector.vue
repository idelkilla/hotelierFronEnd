<!-- src/components/PasajerosSelector.vue -->
<template>
  <div class="dropdown-panel pasajeros-panel">
    
    <div class="pasajero-row">
      <span>Pasajeros</span>
      <div class="counter">
        <button @click="cambiar(-1)" :disabled="pasajeros <= 1">−</button>
        <span>{{ pasajeros }}</span>
        <button @click="cambiar(1)" :disabled="pasajeros >= 9">+</button>
      </div>
    </div>

    <div class="clase-selector">
      <label>Clase de cabina</label>
      <div class="clase-options">
        <button
          v-for="c in clases" :key="c"
          :class="['clase-btn', { active: clase === c }]"
          @click="$emit('update:clase', c)"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <button class="apply-btn" @click="$emit('close')">Aplicar</button>
  </div>
</template>

<script setup>
const props = defineProps({
  pasajeros: { type: Number, default: 1 },
  clase:     { type: String, default: 'Económica' },
  clases:    { type: Array,  default: () => ['Económica', 'Business', 'Primera clase'] },
})
const emit = defineEmits(['update:pasajeros', 'update:clase', 'close'])

function cambiar(delta) {
  const nuevo = props.pasajeros + delta
  if (nuevo >= 1 && nuevo <= 9) emit('update:pasajeros', nuevo)
}
</script>

<style scoped>
.pasajeros-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 16px;
  min-width: 260px;
}

.pasajero-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 15px;
}

.counter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.counter button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.clase-selector label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.clase-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.clase-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: all 0.2s;
}

.clase-btn.active {
  border-color: #1a73e8;
  background: #e8f0fe;
  color: #1a73e8;
  font-weight: 500;
}

.apply-btn {
  margin-top: 14px;
  width: 100%;
  padding: 10px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
</style>