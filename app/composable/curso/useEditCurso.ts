import type { Curso } from "~/types/curso";
import { editCurso as editCursoService } from "~/services/cursos/editCurso";
import { useCursoStore } from "#imports";

export function useEditCurso() {

    const { $supabase } = useNuxtApp()

    const loading = ref(false)
    const error = ref<string | null>(null)

    const cursoStore = useCursoStore()

    async function editCurso(cursoData: Curso) {

        loading.value = true
        error.value = null

        try {


            const cursoEditado = await editCursoService(
                $supabase,
                cursoData
            )

            cursoStore.updateCurso(
                cursoEditado.c_curso,
                cursoEditado
            )

            return cursoEditado

        } catch (e:any) {

            error.value = e.message

            throw e

        } finally {

            loading.value = false
        }
    }

    return {
        editCurso,
        loading,
        error
    }
}