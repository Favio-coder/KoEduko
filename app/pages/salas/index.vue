<template>
  <div class="space-y-8">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-800">Salas de reunión</h1>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ aulaStore.contextoActual || 'Selecciona un aula en Principal' }}
        </p>
      </div>
      <button
        v-if="esDocente"
        @click="modalAbierto = true"
        class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 active:scale-95"
      >
        <PlusIcon class="w-4 h-4" />
        Nueva sala
      </button>
    </div>

    <!-- EMPTY STATE (sin cursos) -->
    <div
      v-if="cargando"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <ArrowPathIcon class="w-6 h-6 text-emerald-400 animate-spin mb-3" />
      <p class="text-sm text-gray-400">Cargando cursos y sesiones…</p>
    </div>

    <div
      v-else-if="cursosConSesiones.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <VideoCameraIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Sin sesiones disponibles</p>
      <p class="text-gray-400 text-xs mt-1 text-center max-w-xs">
        Las salas se organizan por sesión. Crea primero un curso y sus sesiones en la sección de Sesiones.
      </p>
    </div>

    <!-- GRUPOS POR CURSO -->
    <div v-else class="space-y-8">
      <div
        v-for="curso in cursosConSesiones"
        :key="curso.c_curso"
      >
        <!-- Cabecera del grupo -->
        <div class="flex items-center gap-3 mb-4">
          <div :class="['w-2.5 h-2.5 rounded-full shrink-0', colorDot(curso.l_color)]" />
          <h2 class="text-sm font-bold text-gray-700">{{ curso.l_curso }}</h2>
          <div class="flex-1 h-px bg-gray-100" />
          <span :class="['text-[10px] font-semibold px-2.5 py-1 rounded-full', colorBadge(curso.l_color)]">
            {{ (curso.sesiones ?? []).length }} sesión{{ (curso.sesiones ?? []).length !== 1 ? 'es' : '' }}
          </span>
        </div>

        <!-- Grid de tarjetas de sesión -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="sesion in (curso.sesiones ?? [])"
            :key="sesion.c_sesion"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >
            <!-- Franja de color superior -->
            <div :class="['h-1.5 w-full', colorBar(curso.l_color)]" />

            <!-- Cuerpo -->
            <div class="flex flex-col flex-1 p-4 gap-3">

              <!-- Fecha pill + título -->
              <div class="flex items-start gap-3">
                <div :class="['flex flex-col items-center justify-center w-10 h-12 shrink-0 rounded-xl', colorFondo(curso.l_color)]">
                  <span :class="['text-[9px] font-semibold uppercase tracking-wide', colorText(curso.l_color)]">
                    {{ mesCorto(sesion.f_sesion) }}
                  </span>
                  <span :class="['text-base font-bold leading-tight', colorText(curso.l_color)]">
                    {{ dia(sesion.f_sesion) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 leading-snug">{{ sesion.l_sesion }}</p>
                  <p v-if="sesion.l_desc" class="text-[11px] text-gray-400 mt-0.5 truncate">{{ sesion.l_desc }}</p>
                </div>
              </div>

              <!-- Hora -->
              <div v-if="sesion.f_hora" class="flex items-center gap-1.5 text-[11px] text-gray-500">
                <ClockIcon class="w-3.5 h-3.5 shrink-0" />
                {{ sesion.f_hora }}
              </div>

              <!-- Estado de la sala -->
              <div class="flex-1">
                <!-- Con enlace de reunión -->
                <div v-if="sesion.linkReunion" class="space-y-2.5">
                  <!-- Badge plataforma -->
                  <div class="flex items-center gap-2">
                    <!-- Ícono plataforma -->
                    <div :class="['w-6 h-6 rounded-lg flex items-center justify-center shrink-0', plataformaBg(sesion.linkReunion)]">
                      <component :is="plataformaIcono(sesion.linkReunion)" class="w-3.5 h-3.5 text-white" />
                    </div>
                    <span class="text-[11px] font-semibold text-gray-600">
                      {{ plataformaNombre(sesion.linkReunion) }}
                    </span>
                    <span class="ml-auto flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Activa
                    </span>
                  </div>

                  <!-- URL truncada -->
                  <div class="bg-gray-50 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <LinkIcon class="w-3 h-3 text-gray-300 shrink-0" />
                    <span class="text-[10px] text-gray-400 truncate font-mono">{{ sesion.linkReunion }}</span>
                  </div>
                </div>

                <!-- Sin enlace -->
                <div
                  v-else
                  class="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-xl border border-dashed border-gray-200"
                >
                  <VideoCameraSlashIcon class="w-4 h-4 text-gray-300 shrink-0" />
                  <p class="text-[11px] text-gray-400">Sin sala asignada</p>
                </div>
              </div>

            </div>

            <!-- Footer acciones -->
            <div class="px-4 py-3 border-t border-gray-50 flex items-center gap-2">
              <!-- Botón copiar invitación -->
              <button
                v-if="sesion.linkReunion"
                @click="copiarInvitacion(sesion)"
                class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition"
              >
                <CheckIcon v-if="copiadoId === sesion.c_sesion" class="w-3 h-3 text-emerald-500" />
                <ClipboardIcon v-else class="w-3 h-3" />
                {{ copiadoId === sesion.c_sesion ? 'Copiado' : 'Copiar' }}
              </button>

              <!-- Botón entrar -->
              <a
                v-if="sesion.linkReunion"
                :href="sesion.linkReunion"
                target="_blank"
                rel="noopener noreferrer"
                :class="['ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg transition', colorBoton(curso.l_color)]"
              >
                Entrar
                <ArrowTopRightOnSquareIcon class="w-3 h-3" />
              </a>

              <!-- Sin link: botón crear sala -->
              <button
                v-else-if="esDocente"
                @click="abrirModalConSesion(curso, sesion)"
                :class="['ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition border', colorBotonOutline(curso.l_color)]"
              >
                <PlusIcon class="w-3 h-3" />
                Crear sala
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- MODAL -->
    <SesionLlamadaModalCrearRoom
      v-model="modalAbierto"
      :curso-preseleccionado="cursoPreseleccionado"
      :sesion-preseleccionada="sesionPreseleccionada"
      @crear="onSalaCreada"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '#imports'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useListCursos } from '~/composable/curso/useListCursos'
import { useListSesion } from '~/composable/sesion/useListSesion'
import { withLoading } from '~/utils/withLoading'
import type { Curso } from '~/types/curso'
import type { Sesion } from '~/types/sesion'

import {
  PlusIcon, ArrowPathIcon, VideoCameraIcon, ClockIcon,
  LinkIcon, CheckIcon, ArrowTopRightOnSquareIcon,
  ClipboardIcon,
} from '@heroicons/vue/24/outline'

import {
  VideoCameraSlashIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const authStore  = useAuthStore()
const aulaStore  = useAulaStore()
const cursoStore = useCursoStore()

const esDocente = computed(() => authStore.user?.rol === 'Docente')

const { listCursos } = useListCursos()
const { listSesion }  = useListSesion()

const cargando               = ref(false)
const modalAbierto           = ref(false)
const copiadoId              = ref<string | null>(null)
const cursoPreseleccionado   = ref<Curso | null>(null)
const sesionPreseleccionada  = ref<Sesion | null>(null)

// Solo cursos que tienen al menos 1 sesión
const cursosConSesiones = computed(() =>
  cursoStore.cursos.filter(c => (c.sesiones ?? []).length > 0)
)

// ── Helpers fecha ─────────────────────────────────────────────────────────────
function mesCorto(f: string) {
  return new Date(f + 'T00:00:00').toLocaleDateString('es', { month: 'short' })
}
function dia(f: string) {
  return new Date(f + 'T00:00:00').getDate().toString()
}

// ── Plataforma ────────────────────────────────────────────────────────────────
import {
  GlobeAltIcon, // fallback
} from '@heroicons/vue/24/outline'

function plataformaNombre(url: string) {
  const u = url.toLowerCase()
  if (u.includes('meet.google'))   return 'Google Meet'
  if (u.includes('zoom.us'))       return 'Zoom'
  if (u.includes('teams.'))        return 'Microsoft Teams'
  if (u.includes('meet.jit.si'))   return 'KoEduko Meet'
  return 'Reunión'
}

function plataformaIcono(_url: string) {
  return VideoCameraIcon
}

function plataformaBg(url: string) {
  const u = url.toLowerCase()
  if (u.includes('meet.google')) return 'bg-green-500'
  if (u.includes('zoom.us'))     return 'bg-blue-500'
  if (u.includes('teams.'))      return 'bg-indigo-500'
  if (u.includes('jit.si'))      return 'bg-emerald-500'
  return 'bg-gray-400'
}

// ── Acciones ──────────────────────────────────────────────────────────────────
async function copiarInvitacion(sesion: Sesion) {
  const texto = `🎓 Invitación a sesión — KoEduko\n\nHola 👋\nTe comparto el enlace de acceso a la sesión "${sesion.l_sesion}".\n\n🔗 ${sesion.linkReunion}\n\nNos vemos en la sesión 🚀`
  await navigator.clipboard.writeText(texto)
  copiadoId.value = sesion.c_sesion ?? null
  setTimeout(() => { copiadoId.value = null }, 2000)
}

function abrirModalConSesion(curso: Curso, sesion: Sesion) {
  cursoPreseleccionado.value  = curso
  sesionPreseleccionada.value = sesion
  modalAbierto.value = true
}

function onSalaCreada(sala: any) {

  const sesionEncontrada = cursoStore.cursos
    .flatMap(curso => curso.sesiones ?? [])
    .find(s => s.c_sesion === sala.c_sesion)

  if (sesionEncontrada) {
    sesionEncontrada.linkReunion = sala.link
  }

  modalAbierto.value = false
}

// ── Carga inicial ─────────────────────────────────────────────────────────────
onMounted(async () => {
  cargando.value = true
  try {
    await withLoading(() => listCursos())

    await Promise.all(
      cursoStore.cursos.map(async (curso) => {
        try {
          const sesiones = await listSesion(curso.c_curso)
          curso.sesiones = sesiones ?? []
        } catch {
          curso.sesiones = []
        }
      })
    )
  } finally {
    cargando.value = false
  }
})

// ── Colores por curso ─────────────────────────────────────────────────────────
const dots: Record<string, string> = {
  emerald: 'bg-emerald-500', blue: 'bg-blue-500', violet: 'bg-violet-500',
  rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500', slate: 'bg-slate-500',
}
const bars: Record<string, string> = {
  emerald: 'bg-emerald-400', blue: 'bg-blue-400', violet: 'bg-violet-400',
  rose: 'bg-rose-400', amber: 'bg-amber-400', cyan: 'bg-cyan-400', slate: 'bg-slate-300',
}
const fondos: Record<string, string> = {
  emerald: 'bg-emerald-50', blue: 'bg-blue-50', violet: 'bg-violet-50',
  rose: 'bg-rose-50', amber: 'bg-amber-50', cyan: 'bg-cyan-50', slate: 'bg-slate-50',
}
const texts: Record<string, string> = {
  emerald: 'text-emerald-600', blue: 'text-blue-600', violet: 'text-violet-600',
  rose: 'text-rose-600', amber: 'text-amber-600', cyan: 'text-cyan-600', slate: 'text-slate-600',
}
const badges: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700', blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700', rose: 'bg-rose-100 text-rose-700',
  amber: 'bg-amber-100 text-amber-700', cyan: 'bg-cyan-100 text-cyan-700',
  slate: 'bg-slate-100 text-slate-700',
}
const botones: Record<string, string> = {
  emerald: 'bg-emerald-500 hover:bg-emerald-600',
  blue:    'bg-blue-500 hover:bg-blue-600',
  violet:  'bg-violet-500 hover:bg-violet-600',
  rose:    'bg-rose-500 hover:bg-rose-600',
  amber:   'bg-amber-500 hover:bg-amber-600',
  cyan:    'bg-cyan-500 hover:bg-cyan-600',
  slate:   'bg-slate-500 hover:bg-slate-600',
}
const botonesOutline: Record<string, string> = {
  emerald: 'border-emerald-300 text-emerald-600 hover:bg-emerald-50',
  blue:    'border-blue-300 text-blue-600 hover:bg-blue-50',
  violet:  'border-violet-300 text-violet-600 hover:bg-violet-50',
  rose:    'border-rose-300 text-rose-600 hover:bg-rose-50',
  amber:   'border-amber-300 text-amber-600 hover:bg-amber-50',
  cyan:    'border-cyan-300 text-cyan-600 hover:bg-cyan-50',
  slate:   'border-slate-300 text-slate-600 hover:bg-slate-50',
}

const colorDot         = (c: string) => dots[c]          ?? dots.emerald
const colorBar         = (c: string) => bars[c]          ?? bars.emerald
const colorFondo       = (c: string) => fondos[c]        ?? fondos.emerald
const colorText        = (c: string) => texts[c]         ?? texts.emerald
const colorBadge       = (c: string) => badges[c]        ?? badges.emerald
const colorBoton       = (c: string) => botones[c]       ?? botones.emerald
const colorBotonOutline = (c: string) => botonesOutline[c] ?? botonesOutline.emerald
</script>