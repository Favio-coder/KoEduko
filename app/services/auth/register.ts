export const registrarUsuario = async (payload: {
  email: string
  password: string
  nombre: string
  apellp: string
  apellm: string
  fecha_nac: string
  instanceid: string
  rol: string
}) => {

  const { $supabase } = useNuxtApp()

  // 1. CREAR USUARIO EN AUTH
  const { data, error } = await $supabase.auth.signUp({
    email: payload.email,
    password: payload.password
  })

  if (error) throw error

  if (!data?.user?.id) {
    throw new Error('No se pudo crear usuario en auth')
  }

  console.log("Data de auth: ", data)
  console.log("Data de user: ", data)
  const userId = data.user.id

  // 2. RPC (UPDATE CORE + ROLES)
  // const { error: rpcError } = await $supabase.schema('core').rpc('register_user_full', {
  //   p_user_id: userId,
  //   p_email: payload.email,
  //   p_nombre: payload.nombre,
  //   p_apellp: payload.apellp,
  //   p_apellm: payload.apellm,
  //   p_fecha_nac: payload.fecha_nac,
  //   p_instanceid: payload.instanceid,
  //   p_rol: payload.rol
  // })

  // if (rpcError) throw rpcError

  return {
    user_id: userId,
    email: payload.email
  }
}