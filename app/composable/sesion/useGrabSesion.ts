import type { CrearSesionDTO } from '~/types/sesionDTO'
import type { Sesion } from '~/types/sesion'
import { useSesionStore } from '#imports'
import { useCursoStore } from '#imports'
import { grabSesion as grabSesionService } from '~/services/sesion/crearSesion'
import { useNotificaciones } from '~/composable/notificaciones/useNotificaciones'

export function useGrabSesion() {
  const { $supabase } = useNuxtApp()
  const sesionStore = useSesionStore()
  const cursoStore = useCursoStore()
  const { notificarSesionCreada } = useNotificaciones()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function grabarSesion(
    sesionData: CrearSesionDTO,
    c_curso: string
  ): Promise<Sesion> {

    if (!c_curso) {
      throw new Error('No existe curso seleccionado')
    }

    loading.value = true
    error.value = null

    try {
      const sesion = await grabSesionService($supabase, sesionData, c_curso)
      
      const curso = cursoStore.cursos.find(c => c.c_curso === c_curso)
      const nombreCurso = curso?.l_curso ?? 'Curso'
      notificarSesionCreada(sesion.l_sesion, nombreCurso)
      
      return sesion
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { grabarSesion, loading, error }
}
