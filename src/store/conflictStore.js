import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const useConflictStore = defineStore('conflict', {
  state: () => ({
    conflicts: [],
    currentConflict: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchConflicts() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/api/v1/conflicts`)
        this.conflicts = response.data
      } catch (err) {
        this.error = 'Error de connexió amb la API. Revisa que el backend estigui encès.'
      } finally {
        this.loading = false
      }
    },
    async fetchConflictById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/api/v1/conflicts/${id}`)
        this.currentConflict = response.data
      } catch (err) {
        this.error = 'Error al carregar els detalls del conflicte.'
      } finally {
        this.loading = false
      }
    }
  }
})