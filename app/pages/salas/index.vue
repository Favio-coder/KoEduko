<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Salas</h1>
        <p class="text-sm text-gray-500 mt-0.5">Gestiona tus sesiones de clase</p>
      </div>
      <button
        @click="modalAbierto = true"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Crear sesión
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="sesiones.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
        </svg>
      </div>
      <p class="text-gray-600 font-medium">No hay sesiones creadas</p>
      <p class="text-gray-400 text-sm mt-1">Crea tu primera sesión para empezar</p>
    </div>

    <!-- Lista de sesiones -->
    <div v-else class="grid gap-4">
      <div
        v-for="s in sesiones"
        :key="s.id"
        class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-4">

          <!-- Info -->
          <div class="flex items-center gap-4">
            <!-- Icono de plataforma -->
            <div
              :class="[
                'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                s.plataforma === 'meet' ? 'bg-green-600' :
                s.plataforma === 'teams' ? 'bg-indigo-600' :
                'bg-linear-to-br from-purple-500 to-pink-500'
              ]"
            >
              <!-- Meet -->
              <svg v-if="s.plataforma === 'meet'" viewBox="0 0 24 24" class="w-6 h-6" fill="none">
                <path d="M4 8.5C4 7.67 4.67 7 5.5 7h7C13.33 7 14 7.67 14 8.5v7c0 .83-.67 1.5-1.5 1.5h-7C4.67 17 4 16.33 4 15.5v-7z" fill="white"/>
                <path d="M14 10.25l5-3v9.5l-5-3v-3.5z" fill="white" fill-opacity="0.8"/>
              </svg>
              <!-- Teams -->
              <svg v-else-if="s.plataforma === 'teams'" viewBox="0 0 24 24" class="w-6 h-6" fill="none">
                <circle cx="15.5" cy="7.5" r="2" fill="white"/>
                <path d="M12.5 11h6a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-6V11z" fill="white" fill-opacity="0.5"/>
                <circle cx="9" cy="8.5" r="2.5" fill="white"/>
                <path d="M4 14a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 14 14v3.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V14z" fill="white"/>
              </svg>
              <!-- Misti -->
              <span v-else class="text-white font-bold text-base">M</span>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-800">{{ s.nombre }}</p>
                <span
                  v-if="s.plataforma === 'jitsi'"
                  class="text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                >
                  Beta
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5 capitalize">
                {{ nombrePlataforma(s.plataforma) }} · {{ s.creadoEn }}
              </p>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Copiar link -->
            <button
              @click="copiarLink(s)"
              :title="'Copiar enlace'"
              class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <svg v-if="copiado !== s.id" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <svg v-else class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </button>

            <!-- Entrar a la sala -->
            <a
              :href="s.link"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition',
                s.plataforma === 'jitsi'
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              Entrar
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>

            <!-- Eliminar -->
            <button
              @click="eliminarSesion(s.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Eliminar sesión"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>

        </div>

        <!-- Link visible -->
        <div class="mt-3 bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          <span class="text-xs text-gray-500 truncate font-mono">{{ s.link }}</span>
        </div>

      </div>
    </div>

    <!-- Modal -->
    <SesionLlamadaModalCrearRoom
      v-model="modalAbierto"
    @crear="agregarSesion"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Room } from '~/types/room'



const sesiones = ref<Room[]>([])
const modalAbierto = ref(false)
const copiado = ref<number | null>(null)

function agregarSesion(sesion: Room) {
  sesiones.value.unshift(sesion)
}

function eliminarSesion(id: number) {
  sesiones.value = sesiones.value.filter(s => s.id !== id)
}

function nombrePlataforma(p: string): string {
  return { meet: 'Google Meet', teams: 'Microsoft Teams', misti: 'Misti' }[p] ?? p
}

async function copiarLink(s: Room) {
  await navigator.clipboard.writeText(
  `🎓 Invitación a sesión — KoEduko
    Hola 👋
    Te comparto el enlace de acceso a la sesión en línea.
    Haz clic en el siguiente enlace para unirte:
    🔗 ${s.link}
    Nos vemos en la sesión 🚀`
    )
  copiado.value = s.id
  setTimeout(() => { copiado.value = null }, 2000)
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>