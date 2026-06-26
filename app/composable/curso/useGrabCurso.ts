import type { Curso } from "~/types/curso"

import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from "#imports"
import { useNotificaciones } from "~/composable/notificaciones/useNotificaciones"

import { grabCurso as grabCursoService } from "~/services/cursos/crearCurso"

export function useGrabCurso() {

    const { $supabase } = useNuxtApp()

    const aulaStore = useAulaStore()
    const cursoStore = useCursoStore()
    const { notificarCursoCreado } = useNotificaciones()

    const loading = ref(false)
    const error = ref<string | null>(null)

    async function grabarCurso(cursoData: Curso) {

        const c_aula = aulaStore.aulaActual?.c_aula
        
        if (!c_aula) {
            throw new Error("No existe aula seleccionada")
        }

        loading.value = true
        error.value = null

        try {

            const curso = await grabCursoService(
                $supabase,
                cursoData,
                c_aula
            )
            
            const cursoSub: any = curso?.[0]

            cursoStore.addCurso(cursoSub)

            notificarCursoCreado(cursoSub.l_curso)

            return curso

        } catch (e: any) {

            error.value = e.message

            throw e

        } finally {

            loading.value = false
        }
    }

    return {
        grabarCurso,
        loading,
        error
    }
}
