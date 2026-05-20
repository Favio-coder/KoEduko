import type { CrearSesionDTO } from '~/types/sesionDTO'
import type { Sesion } from '~/types/sesion'

// Store
import { useSesionStore } from '#imports'

// Service
import { editSesion as editSesionServices } from '~/services/sesion/editarSesion'

export function useEditSesion() {

  const { $supabase } = useNuxtApp()

  const sesionStore = useSesionStore()

  const loading = ref(false)

  const error = ref<string | null>(null)

  async function editSesion(
    sesionData: CrearSesionDTO,
    c_sesion: string
  ): Promise<Sesion> {

    loading.value = true

    error.value = null

    try {

      /**
       * Editar sesión + subir nuevos archivos
       */
      const sesionActualizada = await editSesionServices(

        $supabase,

        sesionData,

        c_sesion

      )

      /**
       * Actualizar store
       */
      sesionStore.updateSesion(

        c_sesion,

        sesionActualizada

      )

      return sesionActualizada

    } catch (e: any) {

      error.value = e.message

      throw e

    } finally {

      loading.value = false

    }

  }

  return {

    editSesion,

    loading,

    error

  }

}