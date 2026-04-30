import { defineStore } from 'pinia'
import  type { GradoConAulas } from '~/services/docente/obtenerGradoAulas'

interface AulaSeleccionada {
    c_aula: string, 
    l_aula: string, 
    l_desc: string | null
}

interface AulaState {
  gradosAulas: GradoConAulas[]
  gradoActual: GradoConAulas | null
  aulaActual: AulaSeleccionada | null
  loading: boolean
  error: string | null
}

export const useAulaStore = defineStore('aula', {
  state: (): AulaState => ({
    gradosAulas: [],
    gradoActual: null,
    aulaActual: null,
    loading: false,
    error: null,
  }),
 
  getters: {
    aulasDelGrado: (state): AulaSeleccionada[] =>
      state.gradoActual?.aulas ?? [],
 
    seleccionCompleta: (state): boolean =>
      !!state.gradoActual && !!state.aulaActual,
 
    contextoActual: (state): string => {
      if (!state.gradoActual || !state.aulaActual) return ''
      return `${state.gradoActual.l_grad} · ${state.aulaActual.l_aula}`
    },
  },
 
  actions: {
    setGradosAulas(lista: GradoConAulas[]) {
      this.gradosAulas = lista
    },
 
    seleccionarGrado(grado: GradoConAulas) {
      this.gradoActual = grado
      this.aulaActual = null          
    },
 
    seleccionarAula(aula: AulaSeleccionada) {
      this.aulaActual = aula
    },
 
    clear() {
      this.gradosAulas = []
      this.gradoActual = null
      this.aulaActual = null
      this.error = null
    },
  },
 
})
