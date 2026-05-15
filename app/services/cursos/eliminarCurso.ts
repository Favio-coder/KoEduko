export async function elimCurso(
    supabase: any,
    c_curso: string,
    c_aula: string,
) {

    const { data, error } = await supabase
        .schema('core')
        .from('curso')
        .delete()
        .eq('c_curso', c_curso)
        .eq('c_aula', c_aula)

    if (error) {
        throw new Error(error.message)
    }

    return data
}