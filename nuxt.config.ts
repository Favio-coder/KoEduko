import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  //ssr: false,
  modules: [
    '@pinia/nuxt',  
    'pinia-plugin-persistedstate/nuxt'
  ],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  css: ['./app/assets/css/main.css'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap'
        }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      googleid: process.env.GOOGLE_CLIENT_ID,
      googlesecret: process.env.GOOGLE_CLIENT_SECRET,
      googleredurl: process.env.GOOGLE_REDIRECT_URI
    }
  }
});