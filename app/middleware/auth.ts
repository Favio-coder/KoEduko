export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $supabase } = useNuxtApp()

  const { data } = await $supabase.auth.getSession()

  if (!data.session) {
    return navigateTo('/')
  }
})