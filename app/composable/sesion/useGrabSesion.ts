import type { CrearSesionDTO } from '~/types/sesionDTO'
import type { Sesion } from '~/types/sesion'
import { useSesionStore } from '#imports'
import { grabSesion as grabSesionService } from '~/services/sesion/crearSesion'

export function useGrabSesion() {
  const { $supabase } = useNuxtApp()
  const sesionStore = useSesionStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function grabarSesion(
    sesionData: CrearSesionDTO,
    c_curso: string            // ← recibe el curso como parámetro
  ): Promise<Sesion> {

    if (!c_curso) {
      throw new Error('No existe curso seleccionado')
    }

    loading.value = true
    error.value = null

    try {
      const sesion = await grabSesionService($supabase, sesionData, c_curso)
      // ← eliminado sesionStore.addSesion(sesion) — la página lo maneja
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