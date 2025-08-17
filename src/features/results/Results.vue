<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const rounds = computed(() => store.getters['race/rounds'])
const isGenerated = computed(() => store.getters['race/isGenerated'])
const completedRounds = computed(() => store.getters['race/getCompletedRounds'])
const isRaceRunning = computed(() => store.getters['race/isRaceRunning'])
</script>

<template>
  <div class="results">
    <div class="program-panel">
      <div class="panel-header">Program</div>
      <div class="panel-content">
        <div v-if="!isGenerated" class="empty-state">
          Click "Generate Program" to create race schedule
        </div>
        <div v-else>
          <div v-for="round in rounds" :key="round.id" class="round-section">
            <div class="round-title">{{ round.id }}ST Lap - {{ round.distance }}</div>
            <div class="horses-table">
              <div v-for="(horse, index) in round.selectedHorses" :key="horse.id" class="horse-row">
                <span class="position">{{ index + 1 }}</span>
                <span class="name">{{ horse.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="results-panel">
      <div class="panel-header">Results</div>
      <div class="panel-content">
        <div v-if="!isGenerated" class="empty-state">
          Race results will appear when race is finished
        </div>
        <div v-else-if="!isRaceRunning && completedRounds.length === 0" class="empty-state">
          Click "Start" to begin racing
        </div>
        <div v-else>
          <div v-for="round in completedRounds" :key="round.id" class="round-section">
            <div class="round-title">{{ round.id }}ST Lap - {{ round.distance }}</div>
            <div class="horses-table">
              <div v-for="result in round.results" :key="result.horseId" class="horse-row">
                <span class="position">{{ result.position }}</span>
                <span class="name">{{ result.horseName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results {
  height: 100%;
  display: flex;
  gap: 1px;
}

.program-panel,
.results-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.panel-header {
  background-color: #2196f3;
  color: white;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
  font-size: 12px;
}

.round-section {
  border-bottom: 2px solid #eee;
}

.round-title {
  background-color: #f8f9fa;
  padding: 6px 8px;
  font-weight: bold;
  font-size: 11px;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.horses-table {
  padding: 4px 8px;
}

.horse-row {
  display: flex;
  padding: 2px 0;
  border-bottom: 1px solid #f0f0f0;
}

.position {
  width: 20px;
  font-weight: bold;
  font-size: 10px;
  color: #666;
}

.name {
  flex: 1;
  font-size: 10px;
  color: #333;
}
</style>
