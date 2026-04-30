// middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const { $supabase } = useNuxtApp()
  const { data: { session } } = await $supabase.auth.getSession()

  if (session) {
    return navigateTo('/principal')
  }
})