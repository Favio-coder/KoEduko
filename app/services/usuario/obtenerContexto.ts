export const obtenerContextoUsuario = async (email: string, codInstitucion: string) => {
  const { $supabase } = useNuxtApp()

  const { data, error } = await $supabase
    .schema('core')
    .rpc('get_usuario_contexto', {
      p_email: email,
      p_cod_ie: codInstitucion
    })

  if (error) throw error

  return data?.[0]
}