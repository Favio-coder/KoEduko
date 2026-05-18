import type { CrearSesionDTO } from '~/types/sesionDTO'
import type { Sesion } from '~/types/sesion'

// Store
import { useCursoStore } from '#imports'
import { useSesionStore } from '#imports'

// Service
import { grabSesion as grabSesionService } from '~/services/sesion/crearSesion'

export function useGrabSesion() {

  const { $supabase } = useNuxtApp()

  const cursoStore = useCursoStore()

  const sesionStore = useSesionStore()

  const loading = ref(false)

  const error = ref<string | null>(null)

  async function grabarSesion(
    sesionData: CrearSesionDTO
  ): Promise<Sesion> {

    const cursoActual = cursoStore.getCursos?.[0]

    const c_curso = cursoActual?.c_curso

    if (!c_curso) {

      throw new Error(
        'No existe curso seleccionado'
      )

    }

    loading.value = true

    error.value = null

    try {

      /**
       * Guardar sesión + archivos
       */
      const sesion = await grabSesionService(
        $supabase,
        sesionData,
        c_curso
      )

      /**
       * Guardar en store
       */
      sesionStore.addSesion(sesion)

      return sesion

    } catch (e: any) {

      error.value = e.message

      throw e

    } finally {

      loading.value = false

    }

  }

  return {

    grabarSesion,

    loading,

    error

  }

}