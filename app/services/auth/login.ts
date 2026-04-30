export const loginUsuario = async (
  email: string, 
  password: string, 
  codInstitucion: string
) => {

  const { $supabase } = useNuxtApp()

  // 1. Login 
  const { data, error } = await $supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw new Error('Credenciales incorrectas')
  
  
  const userId = data.user.id //Se guardar el id del user si es correcto


  // 2. Validar institución (Core)
  const {data: validacion, error: errInst} = await $supabase
    .schema('core')
    .from('usuarios')
    .select('c_ie')
    .eq('c_usua', userId)
    .eq('c_ie', codInstitucion)
    .single() 

  
  if(!validacion) {
    throw new Error('!No perteneces a esta institución!')
  }

  // 3. Obtener perfil 
  const { data: perfil, error: errPerfil } = await $supabase
    .schema('core')
    .from('usuarios')
    .select(`
      c_usua,
      c_instanceId,
      l_nom,
      l_apellp,
      l_apellm,
      c_ie,
      rol (
        l_rol
      ),
      instieducativo (
        l_col
      )
    `)
    .eq('c_usua', userId)
    .single()

  if (!perfil) throw new Error('Error obteniendo perfil', errPerfil)


  //Cambia el Id usuario a instancia 
  const userIdNuevo = perfil.c_instanceId

  console.log(userIdNuevo)

  const rol = (perfil as any).rol?.l_rol

  if (!rol) throw new Error('Rol no encontrado')

  // 4. Validar tipo (Docente/Alumno)
  if(rol == "Docente") {

    const { data:docente, error } = await $supabase
      .schema('core')
      .from('docente')
      .select('*')
      .eq('c_usua', userIdNuevo)

    if (!docente) throw new Error('No registrado como docente')
  }

  if(rol == "Alumno") {
    const {data: alumno} = await $supabase
      .schema('core')
      .from('alumno')
      .select('*')
      .eq('c_usua', userIdNuevo)

    if (!alumno) throw new Error('No registrado como alumno')
  }

  return perfil //Retornamos perfil 

}