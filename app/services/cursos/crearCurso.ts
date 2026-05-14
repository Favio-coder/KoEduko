import type { Curso } from "~/types/curso"

export async function grabCurso(
    supabase: any,
    curso: Curso,
    c_aula: String
) : Promise<Curso[]> {


    const {data, error} = await supabase
        .schema('core')
        .from('curso')
        .insert([
            {
                l_curso: curso.l_curso,
                l_desc: curso.l_desc,
                l_color: curso.l_color,
                c_aula: c_aula
            }
        ])
        .select()

    if (error) {
        console.error(error)
        throw new Error(error.message)
    }

    return data
}