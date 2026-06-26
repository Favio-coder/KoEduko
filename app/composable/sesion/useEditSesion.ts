import type { CrearSesionDTO } from '~/types/sesionDTO'
import type { Sesion } from '~/types/sesion'

import { useSesionStore } from '#imports'

import { editSesion as editSesionServices } from '~/services/sesion/editarSesion'
import { useNotificaciones } from '~/composable/notificaciones/useNotificaciones'

export function useEditSesion() {

  const { $supabase } = useNuxtApp()

  const sesionStore = useSesionStore()
  const { notificarSesionEditada } = useNotificaciones()

  const loading = ref(false)

  const error = ref<string | null>(null)

  async function editSesion(
    sesionData: CrearSesionDTO,
    c_sesion: string
  ): Promise<Sesion> {

    loading.value = true

    error.value = null

    try {

      const sesionActualizada = await editSesionServices(

        $supabase,

        sesionData,

        c_sesion

      )

      sesionStore.updateSesion(

        c_sesion,

        sesionActualizada

      )

      notificarSesionEditada(sesionActualizada.l_sesion)

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
