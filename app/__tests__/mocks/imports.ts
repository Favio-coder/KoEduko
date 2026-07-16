export const useAulaStore = () => ({
  gradosAulas: [],
  gradoActual: null,
  aulaActual: null,
  aulasDelGrado: [],
  seleccionCompleta: false,
  contextoActual: '',
  loading: false,
  error: null,
  setGradosAulas: () => {},
  seleccionarGrado: () => {},
  seleccionarAula: () => {},
  clear: () => {},
})

export const useCursoStore = () => ({
  cursos: [],
  cursoActual: null,
  loading: false,
  error: null,
  $reset: () => {},
})

export const useSesionStore = () => ({
  sesiones: [],
  sesionActual: null,
  loading: false,
  $reset: () => {},
})
