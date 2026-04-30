export default defineNuxtRouteMiddleware(async () => {
  
  if (process.server) return
  
  const { $supabase } = useNuxtApp()
  const authStore = useAuthStore()

  const { data: { user } } = await $supabase.auth.getUser()

  if (!user) {
    console.log('❌ No hay sesión, redirigiendo...')
    authStore.clearSession()
    return navigateTo('/')
  }


  console.log('✅ Usuario válido')
  // Si hay sesión pero no perfil → recargarlo
  /* if (!authStore.perfil) {
    // aquí podrías volver a llamar a tu API
    alert("Se vencio la sesión")
  } */
})