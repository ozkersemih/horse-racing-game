<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import ResultsPanel from './components/ResultsPanel.vue'
import type { Round, RoundResult } from '@/stores/modules/race'
import type { Horse } from '@/stores/modules/horses'

defineOptions({
  name: 'ResultsView',
})

const store = useStore()

const rounds = computed(() => store.getters['race/rounds'])
const isGenerated = computed(() => store.getters['race/isGenerated'])
const completedRounds = computed(() => store.getters['race/getCompletedRounds'])
const raceStatus = computed(() => store.getters['race/raceStatus'])

const programTables = computed(() => {
  if (!rounds.value.length) return []

  return rounds.value.map((round: Round) => ({
    id: round.id,
    title: `${round.id}ST Lap - ${round.distance}`,
    items: round.selectedHorses.map((horse: Horse, index: number) => ({
      key: horse.id,
      position: index + 1,
      name: horse.name,
    })),
  }))
})

const resultsTables = computed(() => {
  if (!completedRounds.value.length) return []

  return completedRounds.value.map((round: Round) => ({
    id: round.id,
    title: `${round.id}ST Lap - ${round.distance}`,
    items:
      round.results?.map((result: RoundResult) => ({
        key: result.horseId,
        position: result.position,
        name: result.horseName,
      })) || [],
  }))
})

const programEmptyState = computed(() => !isGenerated.value)
const programEmptyMessage = computed(() => 'Click "Generate Program" to create race schedule')

const resultsEmptyState = computed(() => {
  if (!isGenerated.value) return true
  if (raceStatus.value === 'idle' && completedRounds.value.length === 0) return true
  return false
})

const resultsEmptyMessage = computed(() => {
  if (!isGenerated.value) return 'Race results will appear when race is finished'
  if (raceStatus.value === 'paused') return 'Click "Resume" to continue racing'
  return 'Click "Start" to begin racing'
})
</script>

<template>
  <div class="results">
    <ResultsPanel
      title="Program"
      :show-empty-state="programEmptyState"
      :empty-state-message="programEmptyMessage"
      :tables="programTables"
    />
    <ResultsPanel
      title="Results"
      :show-empty-state="resultsEmptyState"
      :empty-state-message="resultsEmptyMessage"
      :tables="resultsTables"
    />
  </div>
</template>

<style scoped>
.results {
  height: 100%;
  display: flex;
  gap: 1px;
}
</style>
