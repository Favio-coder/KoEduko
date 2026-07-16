import { defineConfig } from "cypress";
import { createClient } from "@supabase/supabase-js";

export default defineConfig({
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'reports/cypress',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
  },

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      on('task', {
        async loginSupabase({ email, password }) {
          const supabaseUrl = 'https://uwkqhqosdqdlomvmszxb.supabase.co'
          const supabaseKey = 'sb_publishable_yGf3lf1tMTlu7onK8CzYRg_k4GHntB8'
          const supabase = createClient(supabaseUrl, supabaseKey)

          const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({ email, password })
          if (authError) throw new Error(authError.message)

          const { data: perfil, error: perfilError } = await supabase
            .schema('core')
            .from('usuarios')
            .select(`
              c_usua,
              c_instanceId,
              l_nom,
              l_apellp,
              l_apellm,
              c_ie,
              rol ( l_rol ),
              instieducativo ( l_col )
            `)
            .eq('c_usua', session.user.id)
            .single()

          if (perfilError) throw new Error(perfilError.message)

          return { session, perfil }
        },
      })
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
  },
});
