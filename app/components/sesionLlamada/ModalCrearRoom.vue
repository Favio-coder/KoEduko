<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        <!-- Header -->
        <div class="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 class="text-white text-xl font-bold">Nueva sesión</h2>
          <p class="text-blue-100 text-sm mt-0.5">Configura tu clase antes de comenzar</p>
        </div>

        <div class="p-6 space-y-5">

          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la sesión</label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Ej: Matemáticas — Unidad 3"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Curso - Sesión
            </label>

            <select
              v-model="form.sesion"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option disabled value="">
                Selecciona una sesión
              </option>

              <template
                v-for="curso in cursos"
                :key="curso.c_curso"
              >
                <option
                  v-for="sesion in (curso.sesiones ?? [])"
                  :key="sesion.c_sesion"
                  :value="sesion.c_sesion"
                >
                  {{ curso.l_curso }} — {{ sesion.l_sesion }}
                </option>
              </template>

            </select>
          </div>

          <!-- Plataformas -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Plataforma de videollamada</label>
            <div class="grid grid-cols-1 gap-3">

              <!-- KoEduko Meet (Jitsi) — funciona sin API -->
              <button type="button" @click="form.plataforma = 'jitsi'"
                :class="['flex items-center gap-4 border-2 rounded-xl p-4 transition-all w-full text-left',
                  form.plataforma === 'jitsi' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50']">
                <div class="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 shadow flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p class="font-semibold text-gray-800 text-sm">KoEduko Meet</p>
                    <span class="text-[10px] font-bold bg-green-100 text-green-700 border border-green-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Beta</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">Sala lista al instante, sin configuración extra</p>
                </div>
                <div v-if="form.plataforma === 'jitsi'" class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </button>

              <!-- Google Meet -->
              <button type="button" @click="form.plataforma = 'meet'"
                :class="['flex items-center gap-4 border-2 rounded-xl p-4 transition-all w-full text-left',
                  form.plataforma === 'meet' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50']">
                <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 shadow flex items-center justify-center shrink-0">
                  <!-- <svg viewBox="0 0 48 48" class="w-6 h-6">
                    <path fill="#4caf50" d="M24 43c10.49 0 19-8.51 19-19S34.49 5 24 5 5 13.51 5 24s8.51 19 19 19z"/>
                    <path fill="#fff" d="M14 20.5v7l5-1.5 1 4.5 4-3 4 3 1-4.5 5 1.5v-7L29 22l1-5-6 2-6-2 1 5z"/>
                  </svg> -->
                  <svg viewBox="0 0 48 48" class="w-6 h-6">
                    <path
                      fill="#34A853"
                      d="M10 14c0-2.2 1.8-4 4-4h12v28H14c-2.2 0-4-1.8-4-4V14z"
                    />
                    <path
                      fill="#4285F4"
                      d="M26 20.5l10-6.5c1.3-.8 3 .1 3 1.7v16.6c0 1.6-1.7 2.5-3 1.7l-10-6.5v-7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M26 27.5l5 4V16.5l-5 4v7z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p class="font-semibold text-gray-800 text-sm">Google Meet</p>
                    <span class="text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Recomendado</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">Abre Meet para crear la reunión</p>
                </div>
                <div v-if="form.plataforma === 'meet'" class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </button>

              <!-- Microsoft Teams -->
              <button type="button" @click="form.plataforma = 'teams'"
                :class="['flex items-center gap-4 border-2 rounded-xl p-4 transition-all w-full text-left',
                  form.plataforma === 'teams' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50']">
                <div class="w-10 h-10 rounded-lg bg-indigo-600 shadow flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none">
                    <circle cx="15.5" cy="7" r="2" fill="white"/>
                    <path d="M12.5 10.5h6.5a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-6.5v-5.5z" fill="white" fill-opacity="0.4"/>
                    <circle cx="9" cy="8" r="2.5" fill="white"/>
                    <path d="M3.5 13.5A2.5 2.5 0 0 1 6 11h6a2.5 2.5 0 0 1 2.5 2.5V17a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5v-3.5z" fill="white"/>
                  </svg>
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p class="font-semibold text-gray-800 text-sm">Microsoft Teams</p>
                    <span class="text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300 px-1.5 py-0.5 rounded-full uppercase tracking-wide">PROXIMÁMENTE</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">Abre Teams para crear la reunión</p>
                </div>

                <div v-if="form.plataforma === 'teams'" class="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </button>

            </div>
          </div>

          <!-- Aviso OAuth -->
          <div v-if="form.plataforma === 'meet'"
            class="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <p class="text-xs text-amber-700">
              La integración automática requiere autenticación de cuenta de Google.
              <span class="font-medium">Por ahora se abrirá la plataforma</span> para que pegues el enlace de tu reunión.
            </p>
          </div>

          <div v-if="form.plataforma === 'teams'"
            class="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <p class="text-xs text-red-700">
              La integración automática con Microsoft Teams esta en implementación
              <span class="font-medium">Por ahora recomendamos usar otras opciones</span>
            </p>
          </div>

          <!-- Input de link manual (solo para Meet y Teams) -->
          <div v-if="form.plataforma === 'meet' " class="space-y-2">
            <div class="flex gap-2">
              <a
                :href="form.plataforma === 'meet' ? 'https://meet.google.com/new' : 'https://teams.microsoft.com/l/meeting/new'"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 flex items-center justify-center gap-1.5 border border-blue-500 text-blue-600 rounded-lg py-2 text-xs font-medium hover:bg-blue-50 transition"
              >
                Crear reunión en {{ form.plataforma === 'meet' ? 'Meet' : 'Teams' }}
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
            <input
              v-model="form.linkManual"
              type="url"
              :placeholder="form.plataforma === 'meet'
                ? 'Pega el link: https://meet.google.com/xxx-yyyy-zzz'
                : 'Pega el link de Teams aquí'"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Acciones -->
          <div class="flex gap-3 pt-1">
            <button
              type="button"
              @click="$emit('update:modelValue', false)"
              class="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="confirmar"
              :disabled="!puedeConfirmar"
              class="flex-1 rounded-xl py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition"
            >
              Crear sesión
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useGoogleCalendarToken } from '~/composable/room/Usegooglecalendartoken';

import { googleTokenLogin } from 'vue3-google-login';


import { crearReunionMeet } from '~/services/rooms/generarSala';
import { crearReunionTeams } from '~/services/rooms/generarSala';

import { useListCursos } from '~/composable/curso/useListCursos';
import { useListSesion } from '~/composable/sesion/useListSesion';
import { useGrabLink } from '~/composable/room/useGrabLink';

import type { Room } from '~/types/room';

//Store
import { useCursoStore } from '#imports';


const {listCursos} = useListCursos()
const {listSesion} = useListSesion()
const {grabLink} = useGrabLink()

const sesionesCargadas = ref<Set<string>>(new Set())



const cursoStore = useCursoStore()

const cursos = computed(() => cursoStore.cursos)
const { prepararToken } = useGoogleCalendarToken()
const { $swal } = useNuxtApp()
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'crear': [sesion: Room]
}>()



const form = reactive({
  nombre: '',
  curso: '',
  sesion: '',
  plataforma: '' as '' | Room['plataforma'],
  linkManual: ''
})

watch(() => props.modelValue, (val) => {
  if (!val) {
    form.nombre = ''
    form.curso = ''
    form.sesion = ''
    form.plataforma = ''
    form.linkManual = ''
  }
})

// Jitsi: cualquier nombre de sala genera una reunión real
function generarLinkJitsi(nombre: string): string {
  const sala = nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
  const sufijo = Math.random().toString(36).substring(2, 7)
  return `https://meet.jit.si/KoEduko-${sala}-${sufijo}`
}

const puedeConfirmar = computed(() => {
  if (!form.nombre.trim() || !form.plataforma) return false
  if (form.plataforma === 'jitsi') return true
  // Meet y Teams requieren que el usuario pegue el link
  return form.linkManual.startsWith('https://')
})

async function confirmar() {
  if (!puedeConfirmar.value || !form.plataforma) return

  let link = ''

  if (form.plataforma === 'jitsi') {
    link = generarLinkJitsi(form.nombre)
  }


  // Meet
  if (form.plataforma === 'meet') {
    const { abrirPopup, token } = prepararToken()
    abrirPopup()  

    try {
      const accessToken = await token  
      link = await crearReunionMeet(accessToken, form.nombre)
    } catch (e: any) {
      $swal.fire('Error', e.message, 'error')
      return
    }
  }


  const sesion: Room = {
    id: Date.now(),
    nombre: form.nombre.trim(),
    plataforma: form.plataforma,
    link,
    c_sesion: form.sesion,
    creadoEn: new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
  }

  console.log("Esto se va enviar a Room: ")
  console.log(sesion)

  console.log("Esto tmb se va enviar: ")
  console.log(form.sesion)

  await grabLink(sesion.link, form.sesion)

  emit('crear', sesion)
  emit('update:modelValue', false)
}

onMounted(async () => {

  try {


    await withLoading(async () => {

      await listCursos()

    })


    await Promise.all(

      cursos.value.map(async (curso) => {

        try {

          // asegurar estructura reactiva
          curso.sesiones = []

          const sesiones = await withLoading(async () => {

            return await listSesion(curso.c_curso)

          })

          // guardar sesiones dentro del curso
          curso.sesiones = sesiones ?? []



        } catch (error) {

          console.error(
            `Error cargando sesiones del curso ${curso.l_curso}`,
            error
          )

          curso.sesiones = []
        }


      })

    )
    
    console.log("Cursos: ", cursos.value)
  } catch (error) {

    console.error("Error general:", error)
  }

})


async function loginGoogle() {
  try {
    const response = await googleTokenLogin()

  } catch (error) {
    console.error('Google login error:', error)
  }
}
</script>