<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import HorseListItem from './components/HorseListItem.vue'

const store = useStore()

const horses = computed(() => store.getters['horses/allHorses'])

onMounted(() => {
  store.dispatch('horses/generateHorses')
})
</script>

<template>
  <div class="horse-list">
    <div class="horse-list-header">
      <h3>Horse List (1-20)</h3>
    </div>

    <div class="horse-list-content">
      <HorseListItem v-for="horse in horses" :key="horse.id" :horse="horse" />
    </div>
  </div>
</template>

<style scoped>
.horse-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.horse-list-header {
  background-color: #ffeb3b;
  padding: 16px;
}

.horse-list-header h3 {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.horse-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  min-height: 0;
}
</style>
