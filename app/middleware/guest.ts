export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return

  const authStore = useAuthStore()

  if (authStore.user || authStore.perfil) {
    return navigateTo('/principal')
  }

  const { $supabase } = useNuxtApp()
  await new Promise(resolve => setTimeout(resolve, 100))

  const {
    data: { session }
  } = await $supabase.auth.getSession()

  if (session) {
    return navigateTo('/principal')
  }
})
