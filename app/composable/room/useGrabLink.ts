import { useSesionStore } from "#imports"
import { useCursoStore } from "#imports"
import { grabLink as grabLinkService } from "~/services/rooms/grabLink"

export function useGrabLink() {

    const { $supabase } = useNuxtApp()

    const loading = ref(false)
    const error = ref<string | null>(null)

    const sesionStore = useSesionStore()
    const cursoStore = useCursoStore()

    async function grabLink(
        l_reu: string,
        c_sesion: string
    ) {

        loading.value = true
        error.value = null

        try {

            // guardar en backend
            await grabLinkService(
                $supabase,
                l_reu,
                c_sesion
            )

            // =========================
            // STORE SESION
            // =========================
            sesionStore.updateSesion(
                c_sesion,
                {
                    linkReunion: l_reu
                }
            )

            // =========================
            // STORE CURSO
            // =========================
            for (const curso of cursoStore.cursos) {

                const sesion = (curso.sesiones ?? []).find(
                    s => s.c_sesion === c_sesion
                )

                if (sesion) {

                    sesion.linkReunion= l_reu

                    break
                }
            }

        } catch (e: any) {

            error.value = e.message

            throw e

        } finally {

            loading.value = false

        }

    }

    return {
        grabLink,
        loading,
        error
    }
}