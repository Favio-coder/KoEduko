export const enviarCorreoRegistro = async (
  email: string,
  codInstitucion: string,
  instanceId?: string,
  rol?: string
) => {
  const { $supabase } = useNuxtApp()
  const config = useRuntimeConfig()

  //Utilización de función
  const { data: valido, error: errValid } = await $supabase
    .schema('core')
    .rpc('validar_usuario_institucion', {
      p_email: email,
      p_cod_ie: codInstitucion
    })

  if (errValid) throw new Error('Error validando usuario, no esta registrado esta dirección de correo electrónico')

  if (!valido) {
    throw new Error('El correo no pertenece a esta institución')
  }

  //Enviar correo
  const { data, error } = await $supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${config.public.baseUrl}/register/crear-cuenta?instance=${instanceId}&rol=${rol}&email=${email}`
  }
})

  if (error) throw error

  return data
}