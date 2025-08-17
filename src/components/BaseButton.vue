<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  if (!props.disabled) emit('click')
}
</script>
<template>
  <button
    class="base-button"
    :class="[variant, { disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
<style scoped>
.base-button {
  background-color: var(--btn-bg, var(--color-primary));
  color: var(--btn-text, var(--color-white));
  border: none;
  padding: var(--btn-padding, 10px 20px);
  border-radius: var(--btn-radius, 8px);
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.base-button:hover {
  background-color: var(--btn-bg-hover, #187bcd);
}

.base-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary {
  --btn-bg: var(--color-primary);
  --btn-bg-hover: #187bcd;
  --btn-text: var(--color-white);
}

.secondary {
  --btn-bg: var(--color-gray);
  --btn-bg-hover: #555;
  --btn-text: var(--color-white);
}

.danger {
  --btn-bg: var(--color-danger);
  --btn-bg-hover: #d9363e;
  --btn-text: var(--color-white);
}
</style>
