export default defineNuxtRouteMiddleware(async () => {

  await new Promise(resolve => setTimeout(resolve, 100))

  const { $supabase } = useNuxtApp()

  const {
    data: { session }
  } = await $supabase.auth.getSession()

  if (session) {

    return navigateTo('/principal')

  }

})