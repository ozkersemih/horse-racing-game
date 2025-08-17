<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '@/stores/modules/horses'
import HorseDisplay from './Horse.vue'

interface Props {
  laneNumber: number
  horse: Horse | null
}

const props = defineProps<Props>()
const store = useStore()

const horseProgress = computed(() => {
  if (!props.horse) return 0
  return store.getters['race/getProgressForHorse'](props.horse.id.toString())
})
</script>

<template>
  <div class="horse-lane">
    <div class="lane-number">{{ laneNumber }}</div>
    <div class="lane-track">
      <HorseDisplay v-if="horse" :horse="horse" :progress="horseProgress" :show-progress="false" />
      <div v-else class="empty-lane">Empty Lane</div>
    </div>
  </div>
</template>

<style scoped>
.horse-lane {
  display: flex;
  align-items: center;
  height: 32px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.lane-number {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #90c695;
  color: white;
  font-weight: bold;
  font-size: 12px;
  height: 100%;
}

.lane-track {
  flex: 1;
  position: relative;
  height: 100%;
  background-color: #f9f9f9;
  border-left: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.empty-lane {
  color: #999;
  font-style: italic;
  font-size: 10px;
  margin-left: 8px;
}
</style>
