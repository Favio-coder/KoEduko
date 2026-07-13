export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return

  const authStore = useAuthStore()

  // Sincrónico: si el store ya está hidratado y no hay sesión, redirige al instante
  if (!authStore.user && !authStore.perfil) {
    return navigateTo('/')
  }

  // Asincrónico: verifica con Supabase por si el store está desactualizado
  const { $supabase } = useNuxtApp()
  await new Promise(resolve => setTimeout(resolve, 150))

  const {
    data: { session }
  } = await $supabase.auth.getSession()

  if (!session) {
    authStore.clearSession()
    return navigateTo('/')
  }

  if (!authStore.user) {
    authStore.setUser(session.user)
  }
})
