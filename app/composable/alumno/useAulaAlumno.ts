import { devAulaDeAlumno } from '~/services/alumno/obtenerAulaAlumno'
import { useAulaStore } from '~/stores/aula'
import { useAuthStore } from '~/stores/auth'
 
export function useAulaAlumno() {
  const { $supabase } = useNuxtApp()
  const authStore = useAuthStore()
  const aulaStore = useAulaStore()
 
  const loading = ref(false)
  const error = ref<string | null>(null)
 
  async function cargarAulaAlumno() {
    const c_usua = authStore.user?.id
    if (!c_usua) return
 
    // Si ya está cargado no volvemos a pedir
    if (aulaStore.seleccionCompleta) return
 
    loading.value = true
    error.value = null
 
    try {
      const aula = await devAulaDeAlumno($supabase, c_usua)
 
      if (!aula) {
        error.value = 'No tienes un aula asignada aún.'
        return
      }
 

      aulaStore.setGradosAulas([
        {
          c_grad:  aula.c_grad,
          l_grad:  aula.l_grad,
          n_anio:  aula.n_anio,
          l_desc:  aula.grado_desc,
          aulas: [
            {
              c_aula: aula.c_aula,
              l_aula: aula.l_aula,
              l_desc: aula.l_desc,
            },
          ],
        },
      ])
 
      // Auto-seleccionar (alumno siempre tiene 1 aula, no elige)
      const gradoSeleccionado = aulaStore.gradosAulas[0]
      if (gradoSeleccionado && gradoSeleccionado.aulas.length > 0) {
        const aulaSeleccionada = gradoSeleccionado.aulas[0]
        aulaStore.seleccionarGrado(gradoSeleccionado)
        if (aulaSeleccionada) {
          aulaStore.seleccionarAula(aulaSeleccionada)
        }
      }
 
    } catch (e: any) {
      error.value = e.message ?? 'Error al cargar tu aula'
    } finally {
      loading.value = false
    }
  }
 
  return {
    loading,
    error,
    cargarAulaAlumno,
    // datos del store (reactivos, mismos que usa el docente)
    gradoActual:       computed(() => aulaStore.gradoActual),
    aulaActual:        computed(() => aulaStore.aulaActual),
    seleccionCompleta: computed(() => aulaStore.seleccionCompleta),
    contextoActual:    computed(() => aulaStore.contextoActual),
  }
}
