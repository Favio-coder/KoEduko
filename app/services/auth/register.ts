export const registrarUsuario = async (payload: any) => {
  const { $supabase } = useNuxtApp()

  try {
    // 1. CREAR USUARIO EN AUTH
    const { data, error: signUpError } = await $supabase.auth.signUp({
      email: payload.email,
      password: payload.password
    })

    if (signUpError) throw signUpError
    if (!data?.user) throw new Error('No se pudo crear usuario')

    let userId = data.user.id
    console.log("📝 ID inicial:", userId)

    // 2. ESPERAR PROPAGACIÓN
    await new Promise(resolve => setTimeout(resolve, 5000))

    // 3. VERIFICAR ID REAL
    const { data: { user }, error: getUserError } = await $supabase.auth.getUser()
    if (!getUserError && user) {
      userId = user.id
      console.log("✅ ID confirmado:", userId)
    }

    // 4. ACTUALIZAR core.usuarios
    console.log("🔄 Actualizando core.usuarios...")
    const { error: updateError } = await $supabase
      .schema('core')
      .from('usuarios')
      .update({
        c_usua: userId,
        q_validado: true,
        l_nom: payload.nombre,
        l_apellp: payload.apellp,
        l_apellm: payload.apellm,
        f_nac: payload.fecha_nac
      })
      .or(`l_email.eq.${payload.email},c_instanceId.eq.${payload.instanceid}`)

    if (updateError) throw updateError
    console.log("✅ core.usuarios actualizado")

    // 5. OBTENER datos del usuario (c_instanceId, c_ie)
    console.log("🔍 Obteniendo datos del usuario...")
    const { data: usuarioData, error: selectError } = await $supabase
      .schema('core')
      .from('usuarios')
      .select('c_instanceId, c_ie')
      .or(`l_email.eq.${payload.email},c_instanceId.eq.${payload.instanceid}`)
      .single()

    if (selectError || !usuarioData) {
      throw new Error('No se pudo obtener los datos del usuario')
    }

    const c_instanceId = usuarioData.c_instanceId
    const c_ie = usuarioData.c_ie
    console.log("✅ c_instanceId:", c_instanceId)
    console.log("✅ c_ie (institución):", c_ie)

    // 6. BUSCAR UN AULA (usando dos consultas: institución → grado → aula)
    console.log("🔍 Buscando grados para la institución:", c_ie)

    // Primero: obtener los grados de la institución
    const { data: gradosData, error: gradosError } = await $supabase
      .schema('core')
      .from('grados')
      .select('c_grad')
      .eq('c_ie', c_ie)

    if (gradosError) {
      console.log("⚠️ Error buscando grados:", gradosError)
    }

    let c_aula = null

    // Segundo: buscar aula en esos grados
    if (gradosData && gradosData.length > 0) {
      const gradosIds = gradosData.map(g => g.c_grad)
      console.log("📚 Grados encontrados:", gradosIds)
      
      const { data: aulaData, error: aulaError } = await $supabase
        .schema('core')
        .from('aula')
        .select('c_aula')
        .in('c_grad', gradosIds)
        .limit(1)
      
      if (aulaError) {
        console.log("⚠️ Error buscando aula:", aulaError)
      }
      
      if (aulaData && aulaData.length > 0 && aulaData[0]) {
        c_aula = aulaData[0].c_aula
      }
      
    } else {
      console.log("⚠️ No se encontraron grados para la institución:", c_ie)
    }

    console.log("✅ Aula encontrada:", c_aula)

    // 7. INSERTAR EN TABLA DE ROL
    if (payload.rol === 'Alumno') {
      console.log("👨‍🎓 Insertando en alumno...")
      
      const alumnoData: any = {
        c_usua: c_instanceId,
        f_matri: new Date(),
        f_crea: new Date()
      }
      
      if (c_aula) {
        alumnoData.c_aula = c_aula
        console.log("✅ Asignando aula:", c_aula)
      }
      
      const { error: alumnoError } = await $supabase
        .schema('core')
        .from('alumno')
        .insert(alumnoData)
      
      if (alumnoError) throw alumnoError
      console.log("✅ Alumno registrado con aula:", c_aula || "sin aula")
      
    } else if (payload.rol === 'Docente') {
      console.log("👨‍🏫 Insertando en docente...")
      
      const docenteData: any = {
        c_usua: c_instanceId,
        f_matri: new Date(),
        f_crea: new Date()
      }
      
      
      
      const { error: docenteError } = await $supabase
        .schema('core')
        .from('docente')
        .insert(docenteData)
      
      if (docenteError) throw docenteError
    }

    return {
      success: true,
      user_id: userId,
      c_instance_id: c_instanceId,
      c_aula_asignada: c_aula,
      email: payload.email,
      rol: payload.rol
    }

  } catch (error: any) {
    console.error("❌ Error en registro:", error)
    throw error
  }
}