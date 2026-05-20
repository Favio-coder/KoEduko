import type { Curso } from "~/types/curso"

export async function editCurso(
    supabase: any,
    curso: Curso
): Promise<Curso> {

    const { error } = await supabase
        .schema('core')
        .from('curso')
        .update({
            l_curso: curso.l_curso,
            l_desc: curso.l_desc,
            l_color: curso.l_color,
        })
        .eq('c_curso', curso.c_curso)

    if (error) {
        console.error(error)
        throw new Error(error.message)
    }

    // devolvemos el mismo objeto actualizado
    return curso
}