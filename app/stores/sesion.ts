import { defineStore } from 'pinia'

import type { Sesion } from '~/types/sesion'

interface SesionState {

  sesiones: Sesion[]

  loading: boolean

  error: string | null
}

export const useSesionStore = defineStore('sesion', {

  state: (): SesionState => ({

    sesiones: [],

    loading: false,

    error: null

  }),

  persist: true,

  getters: {

    /**
     * Obtener todas las sesiones
     */
    getSesiones: (state): Sesion[] => state.sesiones,

    /**
     * Obtener sesión por ID
     */
    getSesionById: (state) => {

      return (id: string): Sesion | undefined => {

        return state.sesiones.find(
          sesion => sesion.c_sesion === id
        )

      }

    },

    /**
     * Obtener sesiones por curso
     */
    getSesionesByCurso: (state) => {

      return (cursoId: string): Sesion[] => {

        return state.sesiones.filter(
          sesion => sesion.c_curso === cursoId
        )

      }

    }

  },

  actions: {

    /**
     * Limpiar store
     */
    clear() {

      this.sesiones = []

      this.loading = false

      this.error = null

    },

    /**
     * Set loading
     */
    setLoading(value: boolean) {

      this.loading = value

    },

    /**
     * Set error
     */
    setError(error: string | null) {

      this.error = error

    },

    /**
     * Agregar sesión
     */
    addSesion(sesion: Sesion) {
      // Guardia: si el persist devolvió null en vez de []
      if (!Array.isArray(this.sesiones)) {
        this.sesiones = []
      }
      this.sesiones.unshift(sesion)
    },

    /**
     * Reemplazar sesiones
     */
    setSesiones(sesiones: Sesion[]) {
      this.sesiones = Array.isArray(sesiones) ? sesiones : []
    },

    /**
     * Actualizar sesión
     */
    updateSesion(
      id: string,
      data: Partial<Sesion>
    ) {

      const index = this.sesiones.findIndex(
        sesion => sesion.c_sesion === id
      )

      if (index !== -1) {

        this.sesiones[index] = {

          ...this.sesiones[index],

          ...data,

          actualizadoEn: new Date().toISOString()

        } as Sesion

      }

    },

    /**
     * Eliminar sesión
     */
    removeSesion(id: string) {
      if (!Array.isArray(this.sesiones)) return
      this.sesiones = this.sesiones.filter(s => s.c_sesion !== id)
    },

    /**
     * Agregar archivo a sesión
     */
    addArchivoToSesion(
      sesionId: string,
      archivo: any
    ) {

      const sesion = this.sesiones.find(
        s => s.c_sesion === sesionId
      )

      if (!sesion) return

      if (!sesion.archivos) {

        sesion.archivos = []

      }

      sesion.archivos.push(archivo)

    },

    /**
     * Eliminar archivo de sesión
     */
    removeArchivoFromSesion(
      sesionId: string,
      archivoId: string
    ) {

      const sesion = this.sesiones.find(
        s => s.c_sesion === sesionId
      )

      if (!sesion || !sesion.archivos) return

      sesion.archivos = sesion.archivos.filter(
        archivo => archivo.c_archivo !== archivoId
      )

    }

  }

})