import { useSesionStore } from "#imports";
import { elimArchivo as elimArchivoService } from "~/services/archivo/eliminarArchivo";

export function useElimArchivo(){
    const {$supabase} = useNuxtApp()

    const sesionStore = useSesionStore()

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function elimArchivo(c_archivo: any, c_sesion: string){

        if(!c_archivo){
            throw new Error("No existe archivo")
        }

        try{

            await elimArchivoService(
                $supabase,
                c_archivo
            )

            sesionStore.removeArchivoFromSesion(c_sesion, c_archivo)

        }catch(e:any){
            error.value = e.message

            throw e
        }finally{
            loading.value = false
        }
    }

    return {
        elimArchivo, loading, error
    }
}