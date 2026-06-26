<template>
  <div class="space-y-6">

    <!-- Tarjeta de bienvenida -->
    <div class="bg-white rounded-2xl shadow p-4 lg:p-6 flex items-center gap-3 lg:gap-4">
      <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-xl lg:text-2xl font-bold shrink-0">
        {{ inicialNombre }}
      </div>
      <div class="min-w-0">
        <h1 class="text-lg lg:text-2xl font-bold text-[#264e49] truncate">
          Mis calificaciones
        </h1>
        <p class="text-xs lg:text-sm text-gray-500 truncate">{{ authStore.perfil?.instieducativo?.l_col }}</p>
        <p class="text-[10px] lg:text-xs text-gray-400 mt-0.5 lg:mt-1 truncate">
          {{ aulaStore.contextoActual || 'Tu aula asignada' }}
        </p>
      </div>
    </div>

    <!-- Selector de curso -->
    <div class="relative w-full sm:w-80">
      <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <BookOpenIcon class="w-4 h-4 text-gray-400" />
      </div>
      <select
        v-model="cursoSeleccionadoId"
        class="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition cursor-pointer"
      >
        <option value="">Selecciona un curso</option>
        <option v-for="curso in cursos" :key="curso.c_curso" :value="curso.c_curso">
          {{ curso.l_curso }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-4">Cargando tus cursos...</p>
    </div>

    <!-- Sin curso seleccionado -->
    <div v-else-if="!cursoSeleccionadoId" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <AcademicCapIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Elige un curso</p>
      <p class="text-gray-400 text-xs mt-1">Selecciona un curso para ver tus notas</p>
    </div>

    <!-- Sin cursos disponibles -->
    <div v-else-if="cursos.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <BookOpenIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">No hay cursos disponibles</p>
      <p class="text-gray-400 text-xs mt-1">Aún no tienes cursos asignados</p>
    </div>

    <!-- Contenido del curso seleccionado -->
    <template v-else>

      <!-- Header del curso con promedio -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 lg:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <AcademicCapIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800">{{ cursoActual?.l_curso }}</p>
              <p class="text-xs text-gray-400">{{ cursoActual?.l_desc || 'Sin descripción' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] text-gray-400 hidden sm:inline">Promedio</span>
            <span :class="promedioClase(promedioCursoActual)" class="text-lg font-bold px-3 py-1.5 rounded-xl">
              {{ promedioCursoActual > 0 ? promedioCursoActual.toFixed(1) : '—' }}
            </span>
          </div>
        </div>

        <!-- Tarjetas de notas por categoría -->
        <div class="p-4 lg:p-6 space-y-4" v-if="notasActuales">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Conocimiento -->
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">Conocimiento</p>
                  <p class="text-2xl font-bold text-blue-700 mt-1">{{ formatNota(notasActuales.conocimiento) }}</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <AcademicCapIcon class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div class="w-full h-2 bg-blue-200/50 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-blue-500 transition-all duration-700" :style="{ width: barWidth(notasActuales.conocimiento) + '%' }"></div>
              </div>
              <div class="flex justify-between mt-1.5">
                <span class="text-[10px] text-blue-400">0</span>
                <span class="text-[10px] text-blue-400">20</span>
              </div>
            </div>

            <!-- Actitud -->
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60 p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Actitud</p>
                  <p class="text-2xl font-bold text-emerald-700 mt-1">{{ formatNota(notasActuales.actitud) }}</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <HeartIcon class="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div class="w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500 transition-all duration-700" :style="{ width: barWidth(notasActuales.actitud) + '%' }"></div>
              </div>
              <div class="flex justify-between mt-1.5">
                <span class="text-[10px] text-emerald-400">0</span>
                <span class="text-[10px] text-emerald-400">20</span>
              </div>
            </div>

            <!-- Participación -->
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Participación</p>
                  <p class="text-2xl font-bold text-amber-700 mt-1">{{ formatNota(notasActuales.participacion) }}</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <ChatBubbleLeftIcon class="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div class="w-full h-2 bg-amber-200/50 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-amber-500 transition-all duration-700" :style="{ width: barWidth(notasActuales.participacion) + '%' }"></div>
              </div>
              <div class="flex justify-between mt-1.5">
                <span class="text-[10px] text-amber-400">0</span>
                <span class="text-[10px] text-amber-400">20</span>
              </div>
            </div>
          </div>

          <!-- Charts: Radar + Doughnut -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <p class="text-xs font-semibold text-gray-700 mb-2">Rendimiento por categoría</p>
              <div class="h-56">
                <canvas ref="radarChartRef"></canvas>
              </div>
            </div>
            <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <p class="text-xs font-semibold text-gray-700 mb-2">Distribución de tu rendimiento</p>
              <div class="h-56">
                <canvas ref="doughnutChartRef"></canvas>
              </div>
            </div>
          </div>

          <!-- Comparativa con el aula -->
          <div v-if="datosBI" class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs font-semibold text-gray-700 mb-3">Comparativa con el aula</p>
            <div class="space-y-3">
              <div v-for="cmp in comparativaAula" :key="cmp.nombre" class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-gray-600">{{ cmp.nombre }}</span>
                  <span class="text-gray-400">
                    <span :class="getNotaClase(cmp.miNota)">{{ cmp.miNota.toFixed(1) }}</span>
                    <span class="mx-1.5 text-gray-300">vs</span>
                    <span class="text-gray-500">{{ cmp.promedioAula.toFixed(1) }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                    <div class="h-full rounded-full bg-blue-400 transition-all absolute top-0 left-0" :style="{ width: barWidth(cmp.miNota) + '%' }"></div>
                    <div class="h-full rounded-full bg-gray-400/40 transition-all absolute top-0" :style="{ left: barWidth(cmp.promedioAula) + '%', width: '2px' }"></div>
                  </div>
                  <span v-if="cmp.diferencia >= 0" class="text-[10px] font-semibold text-emerald-500 shrink-0">+{{ cmp.diferencia.toFixed(1) }}</span>
                  <span v-else class="text-[10px] font-semibold text-red-500 shrink-0">{{ cmp.diferencia.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Umbral de notas -->
          <div class="pt-2">
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                <span class="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
                <div class="text-[10px] leading-tight">
                  <span class="font-semibold text-red-700">Deficiente</span>
                  <span class="text-red-400 ml-1">&lt; 11</span>
                </div>
              </div>
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                <span class="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                <div class="text-[10px] leading-tight">
                  <span class="font-semibold text-amber-700">En proceso</span>
                  <span class="text-amber-400 ml-1">11 - 13</span>
                </div>
              </div>
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <span class="w-3 h-3 rounded-full bg-blue-500 shrink-0"></span>
                <div class="text-[10px] leading-tight">
                  <span class="font-semibold text-blue-700">Bueno</span>
                  <span class="text-blue-400 ml-1">14 - 16</span>
                </div>
              </div>
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span class="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <div class="text-[10px] leading-tight">
                  <span class="font-semibold text-emerald-700">Excelente</span>
                  <span class="text-emerald-400 ml-1">17 - 20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón Generar estadística -->
      <div class="flex justify-center">
        <button
          @click="abrirBI"
          class="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 active:scale-95"
        >
          <ChartBarIcon class="w-5 h-5" />
          Ver estadísticas del curso
        </button>
      </div>
    </template>

    <!-- ══════════════════════════════════════════
         MODAL BI - Estadísticas del curso
    ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showBI" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showBI = false">
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden transition-all duration-200" style="max-height: 90vh">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ChartBarIcon class="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800">Estadísticas del curso</p>
                  <p class="text-[10px] text-gray-400">{{ cursoActual?.l_curso }}</p>
                </div>
              </div>
              <button @click="showBI = false" class="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition shrink-0">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-5 space-y-6">

              <!-- Loader -->
              <div v-if="cargandoBI" class="flex flex-col items-center justify-center py-10">
                <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                <p class="text-xs text-gray-400 mt-3">Generando estadísticas...</p>
              </div>

              <template v-else-if="datosBI">
                <!-- KPI Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                    <p class="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Promedio</p>
                    <p class="text-xl font-bold text-emerald-700 mt-1">{{ datosBI.promedio.toFixed(1) }}</p>
                  </div>
                  <div class="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                    <p class="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Máxima</p>
                    <p class="text-xl font-bold text-blue-700 mt-1">{{ datosBI.maxima.toFixed(1) }}</p>
                  </div>
                  <div class="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                    <p class="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Mínima</p>
                    <p class="text-xl font-bold text-amber-700 mt-1">{{ datosBI.minima.toFixed(1) }}</p>
                  </div>
                  <div class="bg-violet-50 rounded-xl p-3 border border-violet-100 text-center">
                    <p class="text-[10px] font-semibold text-violet-600 uppercase tracking-wider">Rango</p>
                    <p class="text-xl font-bold text-violet-700 mt-1">{{ datosBI.rango.toFixed(1) }}</p>
                  </div>
                </div>

                <!-- Charts grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <!-- Distribución de notas (bar chart) -->
                  <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-xs font-semibold text-gray-700 mb-3">Distribución de notas</p>
                    <div class="h-48">
                      <canvas ref="distribucionChartRef"></canvas>
                    </div>
                  </div>

                  <!-- Promedios por categoría (doughnut) -->
                  <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-xs font-semibold text-gray-700 mb-3">Promedios por categoría</p>
                    <div class="h-48">
                      <canvas ref="biDoughnutChartRef"></canvas>
                    </div>
                  </div>
                </div>

                <!-- Detalle de notas con barras -->
                <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <p class="text-xs font-semibold text-gray-700 mb-3">Detalle por categoría</p>
                  <div class="space-y-3">
                    <div v-for="(cat, idx) in datosBI.categorias" :key="idx">
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span class="font-medium text-gray-600">{{ cat.nombre }}</span>
                        <span :class="getNotaClase(cat.valor)">{{ cat.valor.toFixed(1) }}</span>
                      </div>
                      <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500" :class="barraColor(cat.valor)" :style="{ width: (cat.valor / 20 * 100) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tu posición -->
                <div v-if="miPosicion !== null" class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <TrophyIcon class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-700">Tu posición en el curso</p>
                      <p class="text-lg font-bold text-emerald-600">
                        #{{ miPosicion }} de {{ datosBI.totalEstudiantes }}
                        <span class="text-xs font-normal text-gray-400 ml-1">estudiantes</span>
                      </p>
                    </div>
                  </div>
                </div>
              </template>

              <div v-else class="flex flex-col items-center justify-center py-10 text-center">
                <ChartBarIcon class="w-10 h-10 text-gray-200 mb-2" />
                <p class="text-xs text-gray-400">No hay datos suficientes para generar estadísticas</p>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

import {
  BookOpenIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  ChartBarIcon,
  XMarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  TrophyIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { $supabase, $swal } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()
const cursoStore = useCursoStore()

const cargando = ref(false)
const cursoSeleccionadoId = ref<string>('')
const cursos = ref<any[]>([])
const notasActuales = ref<any>(null)
const showBI = ref(false)
const cargandoBI = ref(false)
const datosBI = ref<any>(null)
const cargandoClase = ref(false)
const datosClase = ref<any[]>([])

// Chart refs
const radarChartRef = ref<HTMLCanvasElement | null>(null)
const doughnutChartRef = ref<HTMLCanvasElement | null>(null)
const distribucionChartRef = ref<HTMLCanvasElement | null>(null)
const biDoughnutChartRef = ref<HTMLCanvasElement | null>(null)

let radarChart: Chart | null = null
let doughnutChart: Chart | null = null
let distribucionChart: Chart | null = null
let biDoughnutChart: Chart | null = null

const c_instanceId = computed(() => authStore.perfil?.c_instanceId)

const inicialNombre = computed(() => {
  return authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
})

const cursoActual = computed(() => {
  if (!cursoSeleccionadoId.value) return null
  const curso = cursos.value.find(c => c.c_curso === cursoSeleccionadoId.value)
  if (!curso) return null
  return {
    ...curso,
    notas: notasActuales.value
  }
})

const promedioCursoActual = computed(() => {
  const notas = cursoActual.value?.notas
  if (!notas) return 0
  const valores = [
    notas.conocimiento,
    notas.actitud,
    notas.participacion
  ].filter((v): v is number => v != null && v > 0)
  if (valores.length === 0) return 0
  return Number((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1))
})

// Comparativa con el aula
const comparativaAula = computed(() => {
  if (!datosBI.value || !notasActuales.value) return []
  const cats = [
    { nombre: 'Conocimiento', miNota: notasActuales.value.conocimiento || 0, promAula: 0 },
    { nombre: 'Actitud', miNota: notasActuales.value.actitud || 0, promAula: 0 },
    { nombre: 'Participación', miNota: notasActuales.value.participacion || 0, promAula: 0 },
  ]
  datosBI.value.categorias.forEach((cat: any, i: number) => {
    if (cats[i]) cats[i].promAula = cat.valor
  })
  return cats.map(c => ({
    ...c,
    promedioAula: c.promAula,
    diferencia: c.miNota - c.promAula
  }))
})

const miPosicion = computed(() => {
  if (!datosBI.value?.promedios || !promedioCursoActual.value) return null
  const todos = [...datosBI.value.promedios].sort((a: number, b: number) => b - a)
  const idx = todos.findIndex((p: number) => p <= promedioCursoActual.value)
  return idx + 1
})

function formatNota(nota: number | null | undefined): string {
  const valor = nota ?? null
  return valor !== null ? valor.toFixed(1) : '—'
}

function getNotaClase(nota: number | null | undefined): string {
  const valor = nota ?? null
  if (valor === null) return 'text-sm font-bold px-3 py-1 rounded-full text-gray-300 bg-gray-50'
  if (valor >= 17) return 'text-sm font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50'
  if (valor >= 14) return 'text-sm font-bold px-3 py-1 rounded-full text-blue-700 bg-blue-50'
  if (valor >= 11) return 'text-sm font-bold px-3 py-1 rounded-full text-amber-700 bg-amber-50'
  return 'text-sm font-bold px-3 py-1 rounded-full text-red-700 bg-red-50'
}

function promedioClase(p: number): string {
  if (p === 0) return 'text-sm font-bold px-3 py-1 rounded-full text-gray-300 bg-gray-50'
  if (p >= 17) return 'text-sm font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50'
  if (p >= 14) return 'text-sm font-bold px-3 py-1 rounded-full text-blue-700 bg-blue-50'
  if (p >= 11) return 'text-sm font-bold px-3 py-1 rounded-full text-amber-700 bg-amber-50'
  return 'text-sm font-bold px-3 py-1 rounded-full text-red-700 bg-red-50'
}

function barraColor(valor: number): string {
  if (valor >= 17) return 'bg-emerald-500'
  if (valor >= 14) return 'bg-blue-500'
  if (valor >= 11) return 'bg-amber-500'
  return 'bg-red-500'
}

function barWidth(valor: number | null | undefined): number {
  const v = valor ?? 0
  return Math.min((v / 20) * 100, 100)
}

// Cargar cursos del estudiante
const cargarCursos = async () => {
  if (cursoStore.cursos.length > 0) {
    cursos.value = cursoStore.cursos
    if (cursos.value.length > 0 && !cursoSeleccionadoId.value) {
      cursoSeleccionadoId.value = cursos.value[0].c_curso
    }
    return
  }
  if (!c_instanceId.value) return
  cargando.value = true
  try {
    const { data: alumnoData, error: alumnoError } = await $supabase
      .schema('core')
      .from('alumno')
      .select('*')
      .eq('c_usua', c_instanceId.value)
      .maybeSingle()
    if (alumnoError) throw alumnoError
    if (!alumnoData?.c_aula) {
      cursos.value = []
      return
    }
    const { data: cursosData, error: cursosError } = await $supabase
      .schema('core')
      .from('curso')
      .select('c_curso, l_curso, l_desc')
      .eq('c_aula', alumnoData.c_aula)
    if (cursosError) throw cursosError
    cursos.value = cursosData || []
    if (cursos.value.length > 0 && !cursoSeleccionadoId.value) {
      cursoSeleccionadoId.value = cursos.value[0].c_curso
    }
  } catch (error: any) {
    console.error('Error cargando cursos:', error)
    await $swal.fire({ title: 'Error', text: error.message || 'No se pudieron cargar tus cursos', icon: 'error' })
  } finally {
    cargando.value = false
  }
}

const cargarNotas = async () => {
  if (!cursoSeleccionadoId.value || !c_instanceId.value) {
    notasActuales.value = null
    return
  }
  try {
    const { data: atributosData, error: atributosError } = await $supabase
      .schema('core')
      .from('atributos')
      .select('n_con, n_act, n_par')
      .eq('c_cur', cursoSeleccionadoId.value)
      .eq('c_usua', c_instanceId.value)
      .maybeSingle()
    if (atributosError) {
      console.error('Error atributos:', atributosError)
      notasActuales.value = null
      return
    }
    if (atributosData) {
      notasActuales.value = {
        conocimiento: atributosData.n_con,
        actitud: atributosData.n_act,
        participacion: atributosData.n_par
      }
    } else {
      notasActuales.value = null
    }
    await nextTick()
    renderCharts()
  } catch (error: any) {
    console.error('Error cargando notas:', error)
    notasActuales.value = null
  }
}

// ── Charts del dashboard ──────────────────────────

function renderCharts() {
  destroyCharts()
  renderRadarChart()
  renderDoughnutChart()
}

function destroyCharts() {
  if (radarChart) { radarChart.destroy(); radarChart = null }
  if (doughnutChart) { doughnutChart.destroy(); doughnutChart = null }
}

function renderRadarChart() {
  if (!radarChartRef.value || !notasActuales.value) return
  const ctx = radarChartRef.value.getContext('2d')
  if (!ctx) return

  const misValores = [
    notasActuales.value.conocimiento || 0,
    notasActuales.value.actitud || 0,
    notasActuales.value.participacion || 0,
  ]

  const promAula = datosBI.value?.categorias
    ? datosBI.value.categorias.map((c: any) => c.valor)
    : [0, 0, 0]

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Conocimiento', 'Actitud', 'Participación'],
      datasets: [
        {
          label: 'Tus notas',
          data: misValores,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
        },
        {
          label: 'Promedio del aula',
          data: promAula,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 20,
          ticks: { stepSize: 5, font: { size: 10 } },
          pointLabels: { font: { size: 11, weight: 'bold' } },
          grid: { color: 'rgba(0,0,0,0.06)' },
          angleLines: { color: 'rgba(0,0,0,0.06)' }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 12, font: { size: 10 } }
        }
      }
    }
  })
}

function renderDoughnutChart() {
  if (!doughnutChartRef.value || !notasActuales.value) return
  const ctx = doughnutChartRef.value.getContext('2d')
  if (!ctx) return

  const valores = [
    notasActuales.value.conocimiento || 0,
    notasActuales.value.actitud || 0,
    notasActuales.value.participacion || 0,
  ]

  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Conocimiento', 'Actitud', 'Participación'],
      datasets: [{
        data: valores,
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 12, font: { size: 10 } }
        }
      }
    }
  })
}

// ── BI Modal ──────────────────────────────────

const abrirBI = async () => {
  showBI.value = true
  cargandoBI.value = true
  datosBI.value = null
  try {
    const { data: todosData, error } = await $supabase
      .schema('core')
      .from('atributos')
      .select('n_con, n_act, n_par, c_usua')
      .eq('c_cur', cursoSeleccionadoId.value)

    if (error) throw error

    if (!todosData || todosData.length === 0) {
      datosBI.value = null
      return
    }

    const promedios = todosData.map((r: any) => {
      const vals = [r.n_con, r.n_act, r.n_par].filter((v: any) => v != null && v > 0)
      return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0
    }).filter((p: number) => p > 0)

    if (promedios.length === 0) {
      datosBI.value = null
      return
    }

    const suma = promedios.reduce((a: number, b: number) => a + b, 0)
    const promedio = suma / promedios.length
    const maxima = Math.max(...promedios)
    const minima = Math.min(...promedios)
    const rango = maxima - minima

    const categorias: { nombre: string; valor: number }[] = [
      { nombre: 'Conocimiento', valor: 0 },
      { nombre: 'Actitud', valor: 0 },
      { nombre: 'Participación', valor: 0 },
    ]

    const conVals = todosData.map((r: any) => r.n_con).filter((v: any) => v != null && v > 0)
    const actVals = todosData.map((r: any) => r.n_act).filter((v: any) => v != null && v > 0)
    const parVals = todosData.map((r: any) => r.n_par).filter((v: any) => v != null && v > 0)

    if (conVals.length > 0 && categorias[0]) categorias[0].valor = conVals.reduce((a: number, b: number) => a + b, 0) / conVals.length
    if (actVals.length > 0 && categorias[1]) categorias[1].valor = actVals.reduce((a: number, b: number) => a + b, 0) / actVals.length
    if (parVals.length > 0 && categorias[2]) categorias[2].valor = parVals.reduce((a: number, b: number) => a + b, 0) / parVals.length

    datosBI.value = {
      promedio,
      maxima,
      minima,
      rango,
      categorias,
      distribucion: [0, 0, 0, 0],
      promedios,
      totalEstudiantes: promedios.length
    }

    await nextTick()
    renderGrafico()
    renderBiDoughnut()

  } catch (error: any) {
    console.error('Error generando estadísticas:', error)
    datosBI.value = null
  } finally {
    cargandoBI.value = false
  }
}

function renderGrafico() {
  if (!distribucionChartRef.value || !datosBI.value) return

  if (distribucionChart) {
    distribucionChart.destroy()
  }

  const biData = datosBI.value
  if (!biData) return

  const promedios = biData.promedios as number[]
  const labels = ['0-5', '6-10', '11-13', '14-16', '17-20']
  const counts: number[] = [0, 0, 0, 0, 0]
  const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#3b82f6', '#10b981']

  promedios.forEach((p: number) => {
    if (p <= 5 && counts[0] !== undefined) counts[0]++
    else if (p <= 10 && counts[1] !== undefined) counts[1]++
    else if (p <= 13 && counts[2] !== undefined) counts[2]++
    else if (p <= 16 && counts[3] !== undefined) counts[3]++
    else if (counts[4] !== undefined) counts[4]++
  })

  const ctx = distribucionChartRef.value.getContext('2d')
  if (!ctx) return

  distribucionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Estudiantes',
        data: counts,
        backgroundColor: colors,
        borderRadius: 6,
        barPercentage: 0.7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} estudiante${ctx.parsed.y !== 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, font: { size: 10 } },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          ticks: { font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  })
}

function renderBiDoughnut() {
  if (!biDoughnutChartRef.value || !datosBI.value) return

  if (biDoughnutChart) {
    biDoughnutChart.destroy()
  }

  const cats = datosBI.value.categorias as { nombre: string; valor: number }[]
  const ctx = biDoughnutChartRef.value.getContext('2d')
  if (!ctx) return

  biDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: cats.map(c => c.nombre),
      datasets: [{
        data: cats.map(c => c.valor),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, padding: 12, font: { size: 10 } }
        }
      }
    }
  })
}

watch(cursoSeleccionadoId, () => {
  cargarNotas()
})

onMounted(() => {
  cargarCursos()
})
</script>
