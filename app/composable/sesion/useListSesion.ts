// app/composable/sesion/useListSesion.ts
import { listSesion as listSesionService } from "~/services/sesion/obtenerSesion";
import type { Sesion } from "~/types/sesion";
import { useSesionStore } from "#imports";

// composable/sesion/useListSesion.ts
export function useListSesion() {
  const { $supabase } = useNuxtApp()
  const sesionStore = useSesionStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function listSesion(c_curso: string) {
    loading.value = true
    error.value = null
    try {
      const sesiones: Sesion[] = await listSesionService($supabase, c_curso)
      
      // ← NO uses setSesiones (reemplaza todo el store)
      // Actualiza solo las sesiones de este curso:
      sesiones.forEach(s => {
        const existe = sesionStore.sesiones.find(x => x.c_sesion === s.c_sesion)
        if (!existe) sesionStore.addSesion(s)
      })

      return sesiones
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { listSesion, loading, error }
}