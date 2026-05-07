<template>
  <div>
    <div v-if="loading" class="loading-wrap">
      <div class="spinner"></div>
    </div>

    <div v-else-if="!items.length" class="empty-text">
      Sin registros.
    </div>

    <div v-else class="catalog-grid">
      <div v-for="item in items" :key="item[idField]" class="catalog-card">
        <span class="card-id">#{{ item[idField] }}</span>
        <p class="card-name">{{ item[labelField] }}</p>
        <div class="card-actions">
          <button class="btn-icon edit" @click="$emit('edit', item)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon del" @click="$emit('delete', item[idField])">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items:      { type: Array,   default: () => [] },
  loading:    { type: Boolean, default: false },
  labelField: { type: String,  default: 'NOMBRE' },
  idField:    { type: String,  default: 'ID' },
})
defineEmits(['edit', 'delete'])
</script>

<style scoped>
.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #265073;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg) } }

.empty-text {
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 1rem 0;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.catalog-card {
  background: #fff;
  border: 1.5px solid #f0f0f4;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: box-shadow 0.15s;
}

.catalog-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}

.card-id {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
}

.card-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1d2e;
  margin: 2px 0 10px;
  letter-spacing: -0.01em;
}

.card-actions {
  display: flex;
  gap: 6px;
  margin-top: auto;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.15s;
}

.btn-icon.edit { background: #fef3c7; color: #d97706; }
.btn-icon.del  { background: #fee2e2; color: #dc2626; }
.btn-icon:hover { filter: brightness(0.9); transform: scale(1.05); }

@media (max-width: 900px) {
  .catalog-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 580px) {
  .catalog-grid { grid-template-columns: 1fr; }
}
</style>