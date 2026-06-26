import { useSesionStore } from "#imports";
import { elimSesion as elimSesionService } from "~/services/sesion/eliminarSesion";
import { useNotificaciones } from "~/composable/notificaciones/useNotificaciones";

export function useElimSesion(){
    const { $supabase } = useNuxtApp()
    
    const sesionStore = useSesionStore()
    const { notificarSesionEliminada } = useNotificaciones()

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function elimSesion(c_sesion: string){

        if (!c_sesion) {
            throw new Error("No existe sesión")
        }

        loading.value = true
        error.value = null

        try{

            const sesion = sesionStore.sesiones.find(s => s.c_sesion === c_sesion)
            const nombreSesion = sesion?.l_sesion ?? 'Sesión'
        
            await elimSesionService(
                $supabase,
                c_sesion
            )

            sesionStore.removeSesion(c_sesion)

            notificarSesionEliminada(nombreSesion)
        
            return
        }catch(e:any){
            error.value = e.message
            
            throw e
        }finally {
            loading.value = false
        }
    }

    return {
        elimSesion,
        loading,
        error
    }
}
