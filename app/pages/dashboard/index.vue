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

    <!-- Tarjetas de datos -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <div class="bg-white rounded-xl shadow p-5">
        <p class="text-xs text-gray-400 uppercase mb-1">Nombre completo</p>
        <p class="text-gray-700 font-semibold">
          {{ authStore.perfil?.l_nom }} {{ authStore.perfil?.l_apellp }} {{ authStore.perfil?.l_apellm }}
        </p>
      </div>

      <div class="bg-white rounded-xl shadow p-5">
        <p class="text-xs text-gray-400 uppercase mb-1">Rol</p>
        <span class="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
          {{ authStore.user?.rol }}
        </span>
      </div>

      <div class="bg-white rounded-xl shadow p-5">
        <p class="text-xs text-gray-400 uppercase mb-1">Institución</p>
        <p class="text-gray-700 font-semibold">
          {{ authStore.perfil?.instieducativo?.l_col }}
        </p>
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