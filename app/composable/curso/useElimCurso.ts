import { useCursoStore } from "#imports";
import { useAulaStore } from "#imports";
import { elimCurso as elimCursoService } from "~/services/cursos/eliminarCurso";


export function useElimCurso(){
    const { $supabase } = useNuxtApp()

    const aulaStore = useAulaStore()
    const cursoStore = useCursoStore()

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function elimCurso(c_curso: string){
        const c_aula = aulaStore.aulaActual?.c_aula

        if (!c_aula) {
            throw new Error("No existe aula seleccionada")
        }

        loading.value = true
        error.value = null

        try{

            await elimCursoService(
                $supabase,
                c_curso,
                c_aula
            )


            cursoStore.removeCurso(c_curso)

            return
        }catch(e:any){
            error.value = e.message

            throw e
        }finally {

            loading.value = false
        }
    }

    return {
        elimCurso,
        loading,
        error
    }

}