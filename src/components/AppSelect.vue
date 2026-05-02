<template>
  <div class="as-wrapper" ref="wrapper">
    <button
      type="button"
      class="as-trigger"
      :class="{ open: open, placeholder: !modelValue }"
      @click="open = !open"
    >
      <span>{{ selectedLabel }}</span>
      <i class="fas fa-chevron-down as-arrow" :class="{ rotated: open }"></i>
    </button>

    <Transition name="as-fade">
      <div v-if="open" class="as-panel">
        <ul>
          <li
            v-if="placeholder"
            class="as-item as-placeholder"
            @click="select('')"
          >
            {{ placeholder }}
          </li>
          <li
            v-for="opt in options"
            :key="opt.value"
            class="as-item"
            :class="{ active: modelValue === opt.value }"
            @click="select(opt.value)"
          >
            <span>{{ opt.label }}</span>
            <i v-if="modelValue === opt.value" class="fas fa-check as-check"></i>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options:    { type: Array, default: () => [] }, // [{ value, label }]
  placeholder:{ type: String, default: 'Seleccionar...' },
  disabled:   { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'change'])

const open    = ref(false)
const wrapper = ref(null)

const selectedLabel = computed(() => {
  if (!props.modelValue) return props.placeholder
  return props.options.find(o => o.value === props.modelValue)?.label ?? props.placeholder
})

const select = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  open.value = false
}

const onClickOutside = (e) => {
  if (wrapper.value && !wrapper.value.contains(e.target)) open.value = false
}
onMounted(()    => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(()=> document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.as-wrapper {
  position: relative;
  width: 100%;
}

.as-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #0f172a;
  cursor: pointer;
  transition: border 0.2s;
  text-align: left;
  font-family: inherit;
}
.as-trigger.placeholder span { color: #94a3b8; }
.as-trigger.open,
.as-trigger:focus { border-color: #265073; outline: none; }
.as-trigger:disabled { opacity: 0.5; cursor: not-allowed; }

.as-arrow {
  color: #94a3b8;
  font-size: 12px;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.as-arrow.rotated { transform: rotate(180deg); }

.as-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: auto;
  min-width: 200px;
  width: max-content;
  max-width: 280px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  z-index: 200;
  overflow: hidden;
}
.as-panel ul {
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
}
.as-panel ul::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.as-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 7px;
  font-size: 14px;
  color: #0f172a;
  cursor: pointer;
  transition: background 0.15s;
}
.as-item:hover { background: #f1f5f9; }
.as-item.active {
  background: #eef5fb;
  color: #265073;
  font-weight: 600;
}
.as-item.as-placeholder { color: #94a3b8; font-size: 13px; }
.as-check { color: #265073; font-size: 12px; }

.as-fade-enter-active,
.as-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.as-fade-enter-from,
.as-fade-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>