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
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15);
  padding: 20px;
  min-width: 280px;
}

.pasajero-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #3c4043;
}

.counter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.counter button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #dadce0;
  background: transparent;
  color: #265073;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.counter button:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #d2e3fc;
}

.counter button:disabled {
  color: #bdc1c6;
  border-color: #f1f3f4;
  cursor: not-allowed;
}

.clase-selector label {
  font-size: 12px;
  font-weight: 500;
  color: #70757a;
  margin-bottom: 8px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clase-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.clase-btn {
  padding: 10px 14px;
  border: 1px solid #dadce0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: #3c4043;
  transition: all 0.2s;
}

.clase-btn:hover:not(.active) {
  background-color: #f8f9fa;
}

.clase-btn.active {
  border-color: transparent;
  background: #e8f0fe;
  color: #265073;
  font-weight: 600;
}

.apply-btn {
  margin-top: 20px;
  float: right;
  padding: 8px 24px;
  background: transparent;
  color: #265073;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.apply-btn:hover {
  background-color: #f8f9fa;
  color: #174ea6;
}
</style>