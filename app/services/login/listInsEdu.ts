import supabase from "~/plugins/supabase"

export const listInstitucionesEdu = async (supabase: any) => {

    const { data, error } = await supabase
        .schema('core')
        .from('instieducativo')
        .select('c_ie, l_col')

    if (error) {
        console.error("Error obteniendo instituciones: ", error)
        throw error
    }

    return data
}