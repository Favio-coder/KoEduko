import { defineStore } from "pinia"
import type { Curso } from "~/types/curso"

interface CursoState {
    cursos: Curso[]
    loading: boolean
    error: string | null
}

export const useCursoStore = defineStore('curso', {

    state: (): CursoState => ({
        cursos: [],
        loading: false,
        error: null
    }),
    persist: true,
    getters: {

        // Obtener todos los cursos
        getCursos: (state): Curso[] => state.cursos,

        // Obtener curso por id
        getCursoById: (state) => {
            return (id: string): Curso | undefined => {
                return state.cursos.find(
                    curso => curso.c_curso === id
                )
            }
        }

    },

    actions: {
        //Limpiar Store
        clear() {
            this.cursos = []
            this.loading = false
            this.error = null
        },


        // Agregar curso
        addCurso(curso: Curso) {
            this.cursos.push(curso)
        },

        // Reemplazar todos los cursos
        setCursos(cursos: Curso[]) {
            this.cursos = cursos
        },

        // Modificar un curso
        updateCurso(
            id: string,
            data: Partial<Curso>
        ) {

            const index = this.cursos.findIndex(
                curso => curso.c_curso === id
            )

            if (index !== -1) {

                this.cursos[index] = {
                    ...this.cursos[index],
                    ...data
                } as Curso

            }
        },

        // Eliminar curso
        removeCurso(id: string) {

            this.cursos = this.cursos.filter(
                curso => curso.c_curso !== id
            )

        }

    }
})