<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-800">Salas de reunión</h1>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ aulaStore.contextoActual || 'Selecciona un aula en Principal' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Vista toggle -->
        <div class="bg-gray-100 rounded-lg p-0.5 flex items-center">
          <button
            @click="vista = 'lista'"
            :class="['flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all', vista === 'lista' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600']"
          >
            <ListBulletIcon class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Lista</span>
          </button>
          <button
            @click="vista = 'calendario'"
            :class="['flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all', vista === 'calendario' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600']"
          >
            <CalendarDaysIcon class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Calendario</span>
          </button>
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
    </div>

    <!-- ────────────────────────────────────────────────
         VISTA LISTA (original mejorada)
    ──────────────────────────────────────────────── -->
    <template v-if="vista === 'lista'">
      <!-- Loading -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <ArrowPathIcon class="w-6 h-6 text-emerald-400 animate-spin mb-3" />
        <p class="text-sm text-gray-400">Cargando cursos y sesiones…</p>
      </div>

      <div v-else-if="cursosConSesiones.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <VideoCameraIcon class="w-7 h-7 text-emerald-300" />
        </div>
        <p class="text-gray-600 font-semibold text-sm">Sin sesiones disponibles</p>
        <p class="text-gray-400 text-xs mt-1 text-center max-w-xs">
          Las salas se organizan por sesión. Crea primero un curso y sus sesiones en la sección de Sesiones.
        </p>
      </div>

      <div v-else class="space-y-8">
        <div v-for="curso in cursosConSesiones" :key="curso.c_curso">
          <div class="flex items-center gap-3 mb-4">
            <div :class="['w-2.5 h-2.5 rounded-full shrink-0', colorDot(curso.l_color)]" />
            <h2 class="text-sm font-bold text-gray-700">{{ curso.l_curso }}</h2>
            <div class="flex-1 h-px bg-gray-100" />
            <span :class="['text-[10px] font-semibold px-2.5 py-1 rounded-full', colorBadge(curso.l_color)]">
              {{ (curso.sesiones ?? []).length }} sesión{{ (curso.sesiones ?? []).length !== 1 ? 'es' : '' }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="sesion in (curso.sesiones ?? [])" :key="sesion.c_sesion" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div :class="['h-1.5 w-full', colorBar(curso.l_color)]" />
              <div class="flex flex-col flex-1 p-4 gap-3">
                <div class="flex items-start gap-3">
                  <div :class="['flex flex-col items-center justify-center w-10 h-12 shrink-0 rounded-xl', colorFondo(curso.l_color)]">
                    <span :class="['text-[9px] font-semibold uppercase tracking-wide', colorText(curso.l_color)]">{{ mesCorto(sesion.f_sesion) }}</span>
                    <span :class="['text-base font-bold leading-tight', colorText(curso.l_color)]">{{ dia(sesion.f_sesion) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 leading-snug">{{ sesion.l_sesion }}</p>
                    <p v-if="sesion.l_desc" class="text-[11px] text-gray-400 mt-0.5 truncate">{{ sesion.l_desc }}</p>
                  </div>
                </div>

                <div v-if="sesion.f_hora" class="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <ClockIcon class="w-3.5 h-3.5 shrink-0" />
                  {{ sesion.f_hora }}
                </div>

                <div class="flex-1">
                  <div v-if="sesion.linkReunion" class="space-y-2.5">
                    <div class="flex items-center gap-2">
                      <div :class="['w-6 h-6 rounded-lg flex items-center justify-center shrink-0', plataformaBg(sesion.linkReunion)]">
                        <VideoCameraIcon class="w-3.5 h-3.5 text-white" />
                      </div>
                      <span class="text-[11px] font-semibold text-gray-600">{{ plataformaNombre(sesion.linkReunion) }}</span>
                      <span class="ml-auto flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Activa
                      </span>
                    </div>
                    <div class="bg-gray-50 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                      <LinkIcon class="w-3 h-3 text-gray-300 shrink-0" />
                      <span class="text-[10px] text-gray-400 truncate font-mono">{{ sesion.linkReunion }}</span>
                    </div>
                  </div>
                  <div v-else class="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <VideoCameraSlashIcon class="w-4 h-4 text-gray-300 shrink-0" />
                    <p class="text-[11px] text-gray-400">Sin sala asignada</p>
                  </div>
                </div>
              </div>

              <div class="px-4 py-3 border-t border-gray-50 flex items-center gap-2">
                <button v-if="sesion.linkReunion" @click="copiarInvitacion(sesion)" class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition">
                  <CheckIcon v-if="copiadoId === sesion.c_sesion" class="w-3 h-3 text-emerald-500" />
                  <ClipboardIcon v-else class="w-3 h-3" />
                  {{ copiadoId === sesion.c_sesion ? 'Copiado' : 'Copiar' }}
                </button>
                <a v-if="sesion.linkReunion" :href="sesion.linkReunion" target="_blank" rel="noopener noreferrer" :class="['ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg transition', colorBoton(curso.l_color)]">
                  Entrar
                  <ArrowTopRightOnSquareIcon class="w-3 h-3" />
                </a>
                <button v-else-if="esDocente" @click="abrirModalConSesion(curso, sesion)" :class="['ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition border', colorBotonOutline(curso.l_color)]">
                  <PlusIcon class="w-3 h-3" />
                  Crear sala
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ────────────────────────────────────────────────
         VISTA CALENDARIO
    ──────────────────────────────────────────────── -->
    <template v-if="vista === 'calendario'">
      <!-- Loading -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <ArrowPathIcon class="w-6 h-6 text-emerald-400 animate-spin mb-3" />
        <p class="text-sm text-gray-400">Cargando…</p>
      </div>

      <div v-else-if="cursosConSesiones.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <CalendarDaysIcon class="w-7 h-7 text-emerald-300" />
        </div>
        <p class="text-gray-600 font-semibold text-sm">Sin sesiones en el calendario</p>
        <p class="text-gray-400 text-xs mt-1">Crea sesiones en la sección Curso para verlas aquí</p>
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Navegación del calendario -->
        <div class="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <button @click="mesAnterior" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <ChevronLeftIcon class="w-4 h-4" />
            </button>
            <h2 class="text-base font-bold text-gray-800 min-w-[180px] text-center">
              {{ meses[mesActual] }} {{ añoActual }}
            </h2>
            <button @click="mesSiguiente" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>
          <button @click="irAHoy" class="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition">
            Hoy
          </button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 border-b border-gray-100">
          <div v-for="dia in diasSemana" :key="dia" class="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">
            {{ dia }}
          </div>
        </div>

        <!-- Grid de días -->
        <div class="grid grid-cols-7">
          <div
            v-for="(dia, idx) in diasCalendario"
            :key="idx"
            @click="dia.fecha && seleccionarDia(dia)"
            :class="[
              'min-h-[90px] lg:min-h-[110px] border-b border-r border-gray-50 p-1.5 lg:p-2 transition-colors relative group cursor-pointer',
              !dia.esMesActual ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50/50',
              dia.esHoy ? 'bg-emerald-50/50' : '',
              dia.seleccionado ? 'ring-2 ring-emerald-400 ring-inset' : '',
            ]"
          >
            <span
              :class="[
                'text-[11px] font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                dia.esHoy ? 'bg-emerald-500 text-white' : dia.esMesActual ? 'text-gray-700' : 'text-gray-300'
              ]"
            >
              {{ dia.numero }}
            </span>

            <!-- Eventos del día -->
            <div class="mt-1 space-y-0.5">
              <div
                v-for="evento in (dia.eventos ?? [])"
                :key="evento.id"
                @click.stop="verEvento(evento)"
                :class="['text-[9px] lg:text-[10px] font-semibold px-1.5 py-0.5 rounded truncate cursor-pointer transition hover:opacity-80', evento.colorClase]"
                :title="evento.titulo"
              >
                {{ evento.hora ? evento.hora + ' ' : '' }}{{ evento.titulo }}
              </div>
              <div v-if="dia.eventos && dia.eventos.length > 2" class="text-[9px] text-gray-400 font-medium px-1">
                +{{ dia.eventos.length - 2 }} más
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL -->
    <SesionLlamadaModalCrearRoom
      v-model="modalAbierto"
      :curso-preseleccionado="cursoPreseleccionado"
      :sesion-preseleccionada="sesionPreseleccionada"
      @crear="onSalaCreada"
    />

    <!-- Modal detalle evento -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="eventoSeleccionado" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="eventoSeleccionado = null">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg" :class="eventoSeleccionado.colorFondo">
                  <VideoCameraIcon class="w-4 h-4 m-2" :class="eventoSeleccionado.colorTexto" />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800">{{ eventoSeleccionado.titulo }}</p>
                  <p class="text-[10px] text-gray-400">{{ eventoSeleccionado.curso }}</p>
                </div>
              </div>
              <button @click="eventoSeleccionado = null" class="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition shrink-0">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div class="flex items-center gap-3 text-sm">
                <CalendarDaysIcon class="w-5 h-5 text-gray-400 shrink-0" />
                <span class="text-gray-700 font-medium">{{ eventoSeleccionado.fecha }}</span>
              </div>
              <div v-if="eventoSeleccionado.hora" class="flex items-center gap-3 text-sm">
                <ClockIcon class="w-5 h-5 text-gray-400 shrink-0" />
                <span class="text-gray-700 font-medium">{{ eventoSeleccionado.hora }}</span>
              </div>
              <div v-if="eventoSeleccionado.desc" class="flex items-start gap-3 text-sm">
                <InformationCircleIcon class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span class="text-gray-600">{{ eventoSeleccionado.desc }}</span>
              </div>
              <div v-if="eventoSeleccionado.link" class="pt-2">
                <a :href="eventoSeleccionado.link" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition active:scale-95">
                  <VideoCameraIcon class="w-4 h-4" />
                  Entrar a la reunión
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
  ClipboardIcon, ListBulletIcon, CalendarDaysIcon,
  ChevronLeftIcon, ChevronRightIcon, XMarkIcon,
  InformationCircleIcon,
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
const vista                  = ref<'lista' | 'calendario'>('lista')
const eventoSeleccionado     = ref<any>(null)

// Solo cursos que tienen al menos 1 sesión
const cursosConSesiones = computed(() =>
  cursoStore.cursos.filter(c => (c.sesiones ?? []).length > 0)
)

// ── Helpers fecha ──
function mesCorto(f: string) {
  return new Date(f + 'T00:00:00').toLocaleDateString('es', { month: 'short' })
}
function dia(f: string) {
  return new Date(f + 'T00:00:00').getDate().toString()
}

// ── Calendario ──
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const ahora = new Date()
const mesActual = ref(ahora.getMonth())
const añoActual = ref(ahora.getFullYear())
const diaSeleccionado = ref<string | null>(null)

function irAHoy() {
  mesActual.value = ahora.getMonth()
  añoActual.value = ahora.getFullYear()
}

function mesAnterior() {
  if (mesActual.value === 0) {
    mesActual.value = 11
    añoActual.value--
  } else {
    mesActual.value--
  }
}

function mesSiguiente() {
  if (mesActual.value === 11) {
    mesActual.value = 0
    añoActual.value++
  } else {
    mesActual.value++
  }
}

interface DiaCalendario {
  fecha: string | null
  numero: number
  esMesActual: boolean
  esHoy: boolean
  seleccionado: boolean
  eventos: any[]
}

interface EventoCalendario {
  id: string
  titulo: string
  curso: string
  hora: string | null
  fecha: string
  desc: string | null
  link: string | null
  colorClase: string
  colorFondo: string
  colorTexto: string
}

const diasCalendario = computed<DiaCalendario[]>(() => {
  const primerDia = new Date(añoActual.value, mesActual.value, 1)
  const ultimoDia = new Date(añoActual.value, mesActual.value + 1, 0)
  const diasEnMes = ultimoDia.getDate()
  const diaSemanaInicio = primerDia.getDay()

  const hoy = new Date()
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`

  const hoyNumero = hoy.getDate()
  const hoyMes = hoy.getMonth()
  const hoyAño = hoy.getFullYear()

  // Construir mapa de eventos por fecha
  const eventosMap: Record<string, EventoCalendario[]> = {}

  for (const curso of cursosConSesiones.value) {
    for (const sesion of (curso.sesiones ?? [])) {
      const fecha = sesion.f_sesion
      if (!fecha) continue
      if (!eventosMap[fecha]) eventosMap[fecha] = []
      eventosMap[fecha].push({
        id: sesion.c_sesion || Math.random().toString(),
        titulo: sesion.l_sesion,
        curso: curso.l_curso,
        hora: sesion.f_hora || null,
        fecha: new Date(fecha + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }),
        desc: sesion.l_desc || null,
        link: sesion.linkReunion || null,
        colorClase: colorCalendario(curso.l_color),
        colorFondo: colorFondo(curso.l_color),
        colorTexto: colorText(curso.l_color),
      })
    }
  }

  const dias: DiaCalendario[] = []

  // Días del mes anterior (para llenar el grid)
  const mesAnteriorDias = new Date(añoActual.value, mesActual.value, 0).getDate()
  for (let i = diaSemanaInicio - 1; i >= 0; i--) {
    const d = mesAnteriorDias - i
    dias.push({
      fecha: null,
      numero: d,
      esMesActual: false,
      esHoy: false,
      seleccionado: false,
      eventos: [],
    })
  }

  // Días del mes actual
  for (let d = 1; d <= diasEnMes; d++) {
    const fechaStr = `${añoActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    dias.push({
      fecha: fechaStr,
      numero: d,
      esMesActual: true,
      esHoy: d === hoyNumero && mesActual.value === hoyMes && añoActual.value === hoyAño,
      seleccionado: diaSeleccionado.value === fechaStr,
      eventos: eventosMap[fechaStr] || [],
    })
  }

  // Días del mes siguiente (para llenar el grid)
  const totalDias = dias.length
  const restantes = 7 - (totalDias % 7)
  if (restantes < 7) {
    for (let d = 1; d <= restantes; d++) {
      dias.push({
        fecha: null,
        numero: d,
        esMesActual: false,
        esHoy: false,
        seleccionado: false,
        eventos: [],
      })
    }
  }

  return dias
})

function seleccionarDia(dia: DiaCalendario) {
  diaSeleccionado.value = dia.fecha
}

function verEvento(evento: any) {
  eventoSeleccionado.value = evento
}

function colorCalendario(color?: string): string {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-700',
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    slate: 'bg-slate-100 text-slate-700',
  }
  return (map[color ?? ''] ?? map.emerald)!
}

// ── Plataforma ──
function plataformaNombre(url: string) {
  const u = url.toLowerCase()
  if (u.includes('meet.google'))   return 'Google Meet'
  if (u.includes('zoom.us'))       return 'Zoom'
  if (u.includes('teams.'))        return 'Microsoft Teams'
  if (u.includes('meet.jit.si'))   return 'KoEduko Meet'
  return 'Reunión'
}

function plataformaBg(url: string) {
  const u = url.toLowerCase()
  if (u.includes('meet.google')) return 'bg-green-500'
  if (u.includes('zoom.us'))     return 'bg-blue-500'
  if (u.includes('teams.'))      return 'bg-indigo-500'
  if (u.includes('jit.si'))      return 'bg-emerald-500'
  return 'bg-gray-400'
}

// ── Acciones ──
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

// ── Carga inicial ──
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

// ── Colores por curso ──
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

const colorDot         = (c?: string): string => dots[c ?? '']          ?? dots.emerald!
const colorBar         = (c?: string): string => bars[c ?? '']          ?? bars.emerald!
const colorFondo       = (c?: string): string => fondos[c ?? '']        ?? fondos.emerald!
const colorText        = (c?: string): string => texts[c ?? '']         ?? texts.emerald!
const colorBadge       = (c?: string): string => badges[c ?? '']        ?? badges.emerald!
const colorBoton       = (c?: string): string => botones[c ?? '']       ?? botones.emerald!
const colorBotonOutline = (c?: string): string => botonesOutline[c ?? ''] ?? botonesOutline.emerald!
</script>
