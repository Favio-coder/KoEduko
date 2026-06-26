import { defineStore } from 'pinia'

export interface Notificacion {
  id: string
  titulo: string
  descripcion: string
  tipo: 'info' | 'success' | 'warning' | 'error'
  leida: boolean
  tiempo: string
  createdAt: number
}

export const useNotificacionesStore = defineStore('notificaciones', {
  state: () => ({
    items: [] as Notificacion[]
  }),

  persist: true,

  getters: {
    noLeidas: (state) => state.items.filter(n => !n.leida),
    unreadCount: (state) => state.items.filter(n => !n.leida).length,
    todas: (state) => [...state.items].sort((a, b) => b.createdAt - a.createdAt)
  },

  actions: {
    agregar(notif: Omit<Notificacion, 'id' | 'leida' | 'tiempo' | 'createdAt'>) {
      const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const ahora = Date.now()
      const tiempo = this.formatTiempo(ahora)

      this.items.unshift({
        ...notif,
        id,
        leida: false,
        tiempo,
        createdAt: ahora
      })

      if (this.items.length > 50) {
        this.items = this.items.slice(0, 50)
      }
    },

    marcarLeida(id: string) {
      const n = this.items.find(n => n.id === id)
      if (n) n.leida = true
    },

    marcarTodasLeidas() {
      this.items.forEach(n => { n.leida = true })
    },

    eliminar(id: string) {
      this.items = this.items.filter(n => n.id !== id)
    },

    limpiar() {
      this.items = []
    },

    formatTiempo(createdAt: number): string {
      const diff = Date.now() - createdAt
      const mins = Math.floor(diff / 60000)
      if (mins < 1) return 'Ahora'
      if (mins < 60) return `hace ${mins} min`
      const hrs = Math.floor(mins / 60)
      if (hrs < 24) return `hace ${hrs} hora${hrs > 1 ? 's' : ''}`
      const dias = Math.floor(hrs / 24)
      return `hace ${dias} día${dias > 1 ? 's' : ''}`
    },

    actualizarTiempos() {
      this.items.forEach(n => {
        n.tiempo = this.formatTiempo(n.createdAt)
      })
    }
  }
})
