import { useSesionStore } from "#imports";
import { elimSesion as elimSesionService } from "~/services/sesion/eliminarSesion";

export function useElimSesion(){
    const { $supabase } = useNuxtApp()
    
    const sesionStore = useSesionStore()

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function elimSesion(c_sesion: string){

        if (!c_sesion) {
            throw new Error("No existe sesión")
        }

        loading.value = true
        error.value = null

        try{
        
            await elimSesionService(
                $supabase,
                c_sesion
            )

            sesionStore.removeSesion(c_sesion)
        
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