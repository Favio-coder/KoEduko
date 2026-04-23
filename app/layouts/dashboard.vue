<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const { $supabase } = useNuxtApp()
const router = useRouter()
const authStore = useAuthStore()

// ✅ Computed para saber si es Docente
const esDocente = computed(() => authStore.user?.rol === 'Docente')

async function logout() {
  await $supabase.auth.signOut()
  authStore.clearSession()
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-[#2f4f4f] text-white flex flex-col justify-between p-4">
      <div>
        <h1 class="text-xl font-bold mb-6">Ko Eduko</h1>
        <nav class="space-y-3">
          <NuxtLink to="/dashboard" class="block hover:text-green-400">
            Principal
          </NuxtLink>

          <!-- ✅ Solo visible para Docentes -->
          <NuxtLink
            v-if="esDocente"
            to="/estudiantes"
            class="block hover:text-green-400"
          >
            Estudiantes
          </NuxtLink>
        </nav>
      </div>
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 py-2 rounded text-sm"
      >
        Cerrar sesión
      </button>
    </aside>
    <main class="flex-1 bg-gray-100 p-6">
      <slot />
    </main>
  </div>
</template>