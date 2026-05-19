import { listCursos as listCursosService } from "~/services/cursos/obtenerCurso";
import type { Curso } from "~/types/curso";

// Store
import { useAulaStore } from "#imports";
import { useCursoStore } from "#imports";

export function useListCursos(){

    const { $supabase } = useNuxtApp()

    const aulaStore = useAulaStore()
    const cursoStore = useCursoStore()

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function listCursos(){

        const c_aula = aulaStore.aulaActual?.c_aula

        if (!c_aula) {
            throw new Error("No existe aula seleccionada")
        }

        loading.value = true
        error.value = null

        try {

            const cursos: Curso[] = await listCursosService(
                $supabase,
                c_aula
            )
            
            //Rellenar el store 
            cursoStore.setCursos(cursos)

            return cursos

        } catch(e: any) {

            error.value = e.message

            throw e

        } finally {

            loading.value = false
        }
    }

    return {
        listCursos,
        loading,
        error
    }
}