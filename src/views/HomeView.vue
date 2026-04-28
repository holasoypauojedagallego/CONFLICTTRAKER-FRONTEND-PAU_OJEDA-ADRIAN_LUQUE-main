<template>
  <BaseContainer>
    <template #header>
      <h1>{{ t('title') }}</h1>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('searchPlaceholder')"
        class="search-bar"
      />
    </template>

    <div v-if="store.loading" class="loading">{{ t('loading') }} ⏳</div>
    <div v-else-if="store.error" class="error">{{ t('errorConn') }}</div>
    
    <div v-else>
      <div class="grid">
        <p v-if="filteredConflicts.length === 0">{{ t('noResults') }}</p>
        <ConflictCard
          v-for="conflict in filteredConflicts"
          :key="conflict.id"
          :conflict="conflict"
          @veure-detall="goToDetail"
        />
      </div>

      <div class="chart-section">
        <h2>{{ t('conflictsByRegion') }}</h2>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <p v-if="!hasRegions" class="no-data">{{ t('noRegionData') }}</p>
      </div>
    </div>
  </BaseContainer>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useConflictStore } from '../store/conflictStore'
import { t } from '../composables/useI18n'
import BaseContainer from '../components/BaseContainer.vue'
import ConflictCard from '../components/ConflictCard.vue'
import Chart from 'chart.js/auto'

const store = useConflictStore()
const router = useRouter()
const searchQuery = ref('')

const chartCanvas = ref(null)
let chartInstance = null
const hasRegions = ref(false)

onMounted(() => {
  store.fetchConflicts()
})

watch(
  () => store.conflicts,
  (newConflicts) => {
    if (newConflicts && newConflicts.length > 0) {
      nextTick(() => {
        renderChart(newConflicts)
      })
    }
  },
  { immediate: true }
)

function calculateRegionPercentages(conflicts) {
  const regionCount = {}
  let total = 0

  conflicts.forEach(conflict => {
    for (let i = 0; i < conflict.paises.length ; i++) {
      const region = conflict.paises?.[i] || 'Desconocida';
      regionCount[region] = (regionCount[region] || 0) + 1;
      total++;
    }
  })

  const labels = []
  const data = []
  const percentages = []

  Object.entries(regionCount).forEach(([region, count]) => {
    const percentage = (count / total) * 100
    labels.push(region)
    data.push(count)
    percentages.push(percentage.toFixed(1))
  })

  return { labels, data, percentages }
}

function renderChart(conflicts) {
  if (!chartCanvas.value) return

  const { labels, data, percentages } = calculateRegionPercentages(conflicts)
  
  hasRegions.value = labels.length > 0
  if (!hasRegions.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: t('conflictsPercentage'),
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC249', '#EA526F', '#5D9B9B', '#F4A261'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.raw
              const percentage = percentages[context.dataIndex]
              return `${label}: ${value} (${percentage}%)`
            }
          }
        },
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 15 }
        }
      }
    }
  })
}

const filteredConflicts = computed(() => {
  if (!searchQuery.value) return store.conflicts
  const lowerQuery = searchQuery.value.toLowerCase()
  return store.conflicts.filter(c => 
    c.nombre.toLowerCase().includes(lowerQuery) ||
    (c.paises && c.paises.some(p => p.toLowerCase().includes(lowerQuery)))
  )
})

const goToDetail = (id) => {
  router.push(`/conflicts/${id}`)
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}
.loading {
  font-size: 1.2rem;
  color: #555;
}
.error {
  background: #ffeaa7;
  padding: 15px;
  border-radius: 8px;
  color: #d63031;
}

.chart-section {
  margin-top: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.chart-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5rem;
}
.chart-container {
  position: relative;
  height: 350px;
  width: 100%;
}
.no-data {
  text-align: center;
  color: #888;
  font-style: italic;
}
</style>