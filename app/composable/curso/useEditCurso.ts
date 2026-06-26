import type { Curso } from "~/types/curso";
import { editCurso as editCursoService } from "~/services/cursos/editCurso";
import { useCursoStore } from "#imports";
import { useNotificaciones } from "~/composable/notificaciones/useNotificaciones";

export function useEditCurso() {

    const { $supabase } = useNuxtApp()

    const loading = ref(false)
    const error = ref<string | null>(null)

    const cursoStore = useCursoStore()
    const { notificarCursoEditado } = useNotificaciones()

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

            notificarCursoEditado(cursoEditado.l_curso)

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
