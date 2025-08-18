<script setup lang="ts">
defineOptions({ name: 'ResultsTable' })

export interface TableItem {
  key: string | number
  position: number
  name: string
}

defineProps<{
  title: string
  items: TableItem[]
}>()
</script>

<template>
  <div class="results-table" data-testid="results-table">
    <div class="table-title" data-testid="table-title">{{ title }}</div>
    <div class="table-content" data-testid="table-content">
      <div v-for="item in items" :key="item.key" class="table-row" data-testid="table-row">
        <span class="position" data-testid="row-position">{{ item.position }}</span>
        <span class="name" data-testid="row-name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-table {
  border-bottom: 2px solid #eee;
}
.table-title {
  background-color: var(--color-light);
  padding: 6px 8px;
  font-weight: bold;
  font-size: 11px;
  color: var(--color-dark);
  border-bottom: 1px solid #ddd;
}
.table-content {
  padding: 4px 8px;
}
.table-row {
  display: flex;
  padding: 2px 0;
  border-bottom: 1px solid #f0f0f0;
}
.position {
  width: 20px;
  font-weight: bold;
  font-size: 10px;
  color: var(--color-gray);
}
.name {
  flex: 1;
  font-size: 10px;
  color: var(--color-dark);
}
</style>
