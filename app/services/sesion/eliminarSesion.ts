export async function elimSesion(
    supabase: any,
    c_sesion: string,
) {

    const { data, error } = await supabase
        .schema('core')
        .from('sesion')
        .delete()
        .eq('c_sesion', c_sesion)

    if (error) {
        throw new Error(error.message)
    }

    return data
}