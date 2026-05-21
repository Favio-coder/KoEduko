<template>
  <div class="space-y-6">

    <!-- Tarjeta de bienvenida -->
    <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      
      <!-- Avatar con inicial -->
      <div class="w-16 h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-2xl font-bold">
        {{ inicialNombre }}
      </div>

      <!-- Info -->
      <div>
        <h1 class="text-2xl font-bold text-[#264e49]">
          Bienvenido, {{ authStore.user?.nombre }} 👋
        </h1>
        <p class="text-sm text-gray-500">{{ authStore.perfil?.instieducativo?.l_col }}</p>
      </div>

    </div>

    

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()

// Toma la primera letra del nombre para el avatar
const inicialNombre = computed(() => {
  return authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
})
</script>