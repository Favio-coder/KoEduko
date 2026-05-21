export async function listCursos(
    supabase: any,
    c_aula: String
) {
    
    const { data, error } = await supabase
        .schema('core')
        .from('curso')
        .select('c_curso, l_curso, l_desc, l_color, f_crea')
        .eq('c_aula', c_aula)
        .order('f_crea', { ascending: true })

    if(error) {
        throw new Error(error.message)
    }

    return data

}