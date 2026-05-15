// plugins/googleLogin.client.ts
import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(vue3GoogleLogin as any, {
    clientId: config.public.googleid,
    scope: 'https://www.googleapis.com/auth/calendar.events'
  })
})