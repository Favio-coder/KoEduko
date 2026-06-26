import { useCursoStore } from "#imports";
import { useAulaStore } from "#imports";
import { elimCurso as elimCursoService } from "~/services/cursos/eliminarCurso";
import { useNotificaciones } from "~/composable/notificaciones/useNotificaciones";


export function useElimCurso(){
    const { $supabase } = useNuxtApp()

    const aulaStore = useAulaStore()
    const cursoStore = useCursoStore()
    const { notificarCursoEliminado } = useNotificaciones()

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

            const curso = cursoStore.cursos.find(c => c.c_curso === c_curso)
            const nombreCurso = curso?.l_curso ?? 'Curso'

            await elimCursoService(
                $supabase,
                c_curso,
                c_aula
            )

            cursoStore.removeCurso(c_curso)

            notificarCursoEliminado(nombreCurso)

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
