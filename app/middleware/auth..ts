export default defineNuxtRouteMiddleware(async () => {

  const { $supabase } = useNuxtApp()

  const authStore = useAuthStore()

  const { data, error } = await $supabase.auth.getSession()

  const session = data.session

  if (!session) {

    console.log('❌ No hay sesión')

    authStore.clearSession()

    return navigateTo('/')

  }

  console.log('✅ Sesión válida')

  // Restaurar user si Pinia se vació
  if (!authStore.user) {

    authStore.setUser(session.user)

  }

})