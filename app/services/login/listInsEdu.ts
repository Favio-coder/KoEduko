export const listInstitucionesEdu = async (supabase: any) => {

    const { data, error } = await supabase
        .schema('core')
        .from('instieducativo')
        .select('c_ie, l_col')

    if (error) {
        throw error
    }

    return data
}