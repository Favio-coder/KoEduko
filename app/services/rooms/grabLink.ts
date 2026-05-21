export async function grabLink(
    supabase: any, 
    link: string, 
    c_sesion: string
) : Promise<any> {

    const {data, error} = await supabase
        .schema('core')
        .from('sesion')
        .update({
            l_reu: link
        })
        .eq('c_sesion', c_sesion)

    if(error){
        console.error(error)
        throw new Error(error.message)
    }

    return link
}