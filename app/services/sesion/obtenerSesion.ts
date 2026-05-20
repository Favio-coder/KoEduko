// services/sesion/obtenerSesion.ts
export async function listSesion(
    supabase: any,
    c_curso: String
) {
    
    const { data, error } = await supabase
        .schema('core')
        .from('sesion')
        .select(`
            c_sesion, 
            c_curso, 
            l_sesion, 
            l_desc, 
            f_sesion, 
            f_hora,
            l_reu,
            archivos:archivo (
                c_archivo,
                l_nombre,
                l_url,
                l_tip
            )
        `)
        .eq('c_curso', c_curso)

    if (error) {
        throw new Error(error.message)
    }

    const sesionesFormateadas = data.map((sesion: any) => ({
        c_sesion: sesion.c_sesion,
        c_curso: sesion.c_curso,
        l_sesion: sesion.l_sesion,
        l_desc: sesion.l_desc,
        f_sesion: sesion.f_sesion,  
        f_hora: sesion.f_hora,
        linkReunion: sesion.l_reu,
        archivos: sesion.archivos?.map((archivo: any) => ({
            c_archivo: archivo.c_archivo,
            l_nombre: archivo.l_nombre,
            l_url: archivo.l_url,
            l_tip: archivo.l_tip
        })) || []
    }))

    return sesionesFormateadas
}