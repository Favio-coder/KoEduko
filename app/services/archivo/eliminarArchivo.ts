export async function elimArchivo(
    supabase: any,
    c_archivo: string,
) {

    const { data, error } = await supabase
        .schema('core')
        .from('archivo')
        .delete()
        .eq('c_archivo', c_archivo)

    if (error) {
        throw new Error(error.message)
    }

    return data


}