export async function listCursos(
    supabase: any,
    c_aula: String
) {
    
    const {data, error} = await supabase
        .schema('core')
        .from('curso')
        .select('c_curso, l_curso, l_desc, l_color').eq('c_aula', c_aula)

    if(error) {
        throw new Error(error.message)
    }

    return data

}