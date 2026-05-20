export default defineNuxtRouteMiddleware(async () => {

  if (process.server) return

  const { $supabase } = useNuxtApp()

  const authStore = useAuthStore()

  // pequeña espera para restaurar auth
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