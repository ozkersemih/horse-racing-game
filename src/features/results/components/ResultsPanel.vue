<script setup lang="ts">
import ResultsTable, { type TableItem } from './ResultsTable.vue'

defineOptions({ name: 'ResultsPanel' })

interface TableData {
  id: string | number
  title: string
  items: TableItem[]
}

defineProps<{
  title: string
  showEmptyState: boolean
  emptyStateMessage: string
  tables: TableData[]
}>()
</script>

<template>
  <div class="results-panel" data-testid="results-panel">
    <div class="panel-header" data-testid="panel-header">{{ title }}</div>
    <div class="panel-content" data-testid="panel-content">
      <div v-if="showEmptyState" class="empty-state" data-testid="empty-state">
        {{ emptyStateMessage }}
      </div>
      <div v-else>
        <ResultsTable
          v-for="table in tables"
          :key="table.id"
          :title="table.title"
          :items="table.items"
          data-testid="results-table"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
}
.panel-header {
  background-color: var(--color-primary);
  color: var(--color-white);
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
  color: var(--color-gray);
  font-style: italic;
  font-size: 12px;
}
</style>
