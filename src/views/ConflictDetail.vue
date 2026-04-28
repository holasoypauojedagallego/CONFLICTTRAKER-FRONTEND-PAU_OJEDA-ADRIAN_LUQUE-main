<template>
  <BaseContainer>
    <button @click="router.back()" class="back-btn">{{ t('back') }}</button>
    
    <div v-if="store.loading" class="loading">{{ t('loading') }} ⏳</div>
    <div v-else-if="store.error" class="error">{{ t('errorConn') }}</div>
    
    <div v-else-if="conflict" class="detail-view">
      <h1>{{ conflict.nombre }}</h1>
      <span class="badge" v-bind:class="conflict.estado.toLowerCase()">{{ t('status') }}: 
        <span v-if="conflict.estado === 'ACTIVO'">{{ t('state') }}</span>
        <span v-else>{{ t('statefalse') }}</span>
      </span>
      
      <div class="info-section">
        <h3>{{ t('generalInfo') }}</h3>
        <p><strong>{{ t('start') }}:</strong> {{ formatDate(conflict.fechaInicio) }}</p>
        <p class="desc">{{ conflict.descripcion }}</p>
      </div>

      <div class="info-section">
        <h3>{{ t('countriesInvolved') }}</h3>
        <ul v-if="conflict.paises && conflict.paises.length" class="country-list">
          <li v-for="(pais, index) in conflict.paises" :key="index" class="country-item">
            <img :src="getFlagUrl(pais)" :alt="'Bandera de ' + pais" class="flag-icon" />
            <span>{{ pais }}</span>
          </li>
        </ul>
        <p v-else>{{ t('noCountries') }}</p>
      </div>

      <div class="info-section" v-if="hasValidCoordinates">
        <h3>{{ t('locationMap') }}</h3>
        <div id="conflict-map" class="map-container"></div>
      </div>
      <div class="info-section" v-else>
        <h3>{{ t('locationMap') }}</h3>
        <p>{{ t('noLocationAvailable') }}</p>
      </div>

    </div>
  </BaseContainer>
</template>

<script setup>
import { onMounted, computed, watch, onUnmounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConflictStore } from '../store/conflictStore'
import { t } from '../composables/useI18n'
import { getFlagUrl } from '../composables/useFlags'
import BaseContainer from '../components/BaseContainer.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const countryCoordinates = {
  'España': [40.416775, -3.703790],
  'Francia': [46.603354, 1.888334],
  'Alemania': [51.165691, 10.451526],
  'Italia': [41.87194, 12.56738],
  'Reino Unido': [55.378051, -3.435973],
  'Ucrania': [48.379433, 31.16558],
  'Rusia': [61.52401, 105.318756],
  'Siria': [34.802075, 38.996815],
  'Afganistán': [33.93911, 67.709953],
  'Irak': [33.223191, 43.679291],
  'Estados Unidos': [37.09024, -95.712891],
  'Niger': [17.5968801, 8.0828506]
}

const route = useRoute()
const router = useRouter()
const store = useConflictStore()
const conflictId = route.params.id

let map = null
const hasValidCoordinates = ref(false)

onMounted(() => {
  store.fetchConflictById(conflictId)
})

const conflict = computed(() => store.currentConflict)

const getConflictCoordinates = (conflictData) => {
  if (conflictData.lat && conflictData.lng) {
    return { lat: conflictData.lat, lng: conflictData.lng }
  }
  
  if (conflictData.paises && conflictData.paises.length > 0) {
    const firstCountry = conflictData.paises[0]
    const coords = countryCoordinates[firstCountry]
    if (coords) {
      return { lat: coords[0], lng: coords[1] }
    }
  }
  
  return null
}

watch(conflict, async (newConflict) => {
  if (newConflict) {
    const coords = getConflictCoordinates(newConflict)
    if (coords) {
      hasValidCoordinates.value = true
      await nextTick() 
      initMap(coords.lat, coords.lng, newConflict.nombre)
    } else {
      hasValidCoordinates.value = false
      console.warn('No se pudieron obtener coordenadas para este conflicto')
    }
  }
}, { immediate: true, deep: true })

const initMap = (lat, lng, nombre) => {
  if (map) {
    map.remove()
  }

  const container = document.getElementById('conflict-map')
  if (!container) {
    console.error('No se encontró el contenedor del mapa')
    return
  }

  map = L.map('conflict-map').setView([lat, lng], 6)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 3
  }).addTo(map)

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${nombre}</b><br>${t('location')}: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    .openPopup()
}

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

const formatDate = (dateString) => {
  if (!dateString) return t('unknown')
  return new Date(dateString).toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.back-btn { margin-bottom: 20px; padding: 10px 15px; background: #ecf0f1; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.back-btn:hover { background: #bdc3c7; }
.badge { display: inline-block; padding: 6px 12px; border-radius: 12px; color: white; font-weight: bold; margin-bottom: 20px;}
.activo { background-color: #e74c3c; }
.finalizado { background-color: #2ecc71; }
.congelado { background-color: #3498db; }
.info-section { margin-top: 20px; padding: 20px; background: #fdfdfd; border: 1px solid #eee; border-radius: 8px; }
.desc { line-height: 1.6; color: #444; }

.country-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.country-item { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; }
.flag-icon { width: 30px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

.map-container {
  height: 400px;
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
  z-index: 1;
}
</style>