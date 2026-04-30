import { devGradosAulasporDocente } from '~/services/docente/obtenerGradoAulas'
import type { GradoConAulas } from '~/services/docente/obtenerGradoAulas'
import { useAulaStore } from '~/stores/aula'
import { useAuthStore } from '~/stores/auth'

export function useGradosAulas() {
  const { $supabase } = useNuxtApp()
  const authStore = useAuthStore()
  const aulaStore = useAulaStore()
 
  // Estado local de carga / error 
  const loading = ref(false)
  const error = ref<string | null>(null)
 
  // Cargar desde Supabase 
  async function cargarGradosAulas() {
    const c_instanceId = authStore.perfil?.c_instanceId
    if (!c_instanceId) return
 
    // Si ya están en el store no volvemos a pedir
    if (aulaStore.gradosAulas.length > 0) return
 
    loading.value = true
    error.value = null
 
    try {
      const lista = await devGradosAulasporDocente($supabase, c_instanceId)
      aulaStore.setGradosAulas(lista)
 
      // Auto-seleccionar si solo hay un grado / una aula
      if (lista.length === 1) {
        const grado = lista[0]!
        aulaStore.seleccionarGrado(grado)
        if (grado.aulas.length === 1) {
          aulaStore.seleccionarAula(grado.aulas[0]!)
        }
      }
    } catch (e: any) {
      error.value = e.message ?? 'Error al cargar grados y aulas'
    } finally {
      loading.value = false
    }
  }
 
  // Selectores (delegamos al store) 
  function seleccionarGrado(grado: GradoConAulas) {
    aulaStore.seleccionarGrado(grado)
  }
 
  function seleccionarAula(aula: { c_aula: string; l_aula: string; l_desc: string | null }) {
    aulaStore.seleccionarAula(aula)
  }
 
  // Exponer 
  return {
    // datos del store (reactivos)
    gradosAulas:       computed(() => aulaStore.gradosAulas),
    gradoActual:       computed(() => aulaStore.gradoActual),
    aulaActual:        computed(() => aulaStore.aulaActual),
    aulasDelGrado:     computed(() => aulaStore.aulasDelGrado),
    seleccionCompleta: computed(() => aulaStore.seleccionCompleta),
    contextoActual:    computed(() => aulaStore.contextoActual),
    // estado
    loading,
    error,
    // acciones
    cargarGradosAulas,
    seleccionarGrado,
    seleccionarAula,
  }
}

