<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm p-4 lg:p-6 flex items-center gap-3 lg:gap-4">
      <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#2f4f4f] flex items-center justify-center shrink-0">
        <span class="text-white text-xl lg:text-2xl font-bold">{{ inicialNombre }}</span>
      </div>
      <div class="min-w-0">
        <h1 class="text-lg lg:text-xl font-bold text-[#264e49] truncate flex items-center gap-2">
          <ClipboardDocumentCheckIcon class="w-5 h-5 text-[#264e49]/60" />
          Atributos de evaluación
        </h1>
        <p class="text-xs lg:text-sm text-gray-500 truncate">{{ authStore.perfil?.instieducativo?.l_col }}</p>
        <p class="text-[10px] lg:text-xs text-gray-400 mt-0.5 truncate">{{ aulaStore.contextoActual || 'Selecciona un aula' }}</p>
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
    <div v-if="cargandoCursos" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p class="text-sm text-gray-500 mt-4">Cargando cursos...</p>
    </div>

    <!-- Sin curso -->
    <div v-else-if="!cursoSeleccionadoId" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <ClipboardDocumentCheckIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Selecciona un curso</p>
      <p class="text-gray-400 text-xs mt-1">Elige un curso para gestionar sus atributos de evaluación</p>
    </div>

    <!-- Sin cursos -->
    <div v-else-if="cursos.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <BookOpenIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">No hay cursos disponibles</p>
      <p class="text-gray-400 text-xs mt-1">Este aula no tiene cursos asignados</p>
    </div>

    <!-- Contenido del curso -->
    <template v-else>
      <!-- Barra de peso total -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-600">Peso total</p>
          <span class="text-xs font-bold" :class="pesoClase">{{ pesoTotal }}%</span>
        </div>
        <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="barraPesoClase"
            :style="{ width: Math.min(pesoTotal, 100) + '%' }"
          />
        </div>
        <p class="text-[11px] mt-1.5 font-medium" :class="mensajePesoClase">
          {{ mensajePeso }}
        </p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <ClipboardDocumentCheckIcon class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Atributos</p>
            <p class="text-xl font-bold text-gray-800">{{ atributos.length }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <PercentBadgeIcon class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Peso total</p>
            <p class="text-xl font-bold" :class="pesoTotal === 100 ? 'text-emerald-600' : pesoTotal > 100 ? 'text-red-600' : 'text-gray-800'">
              {{ pesoTotal }}%
            </p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <ChartBarIcon class="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Tipo predominante</p>
            <p class="text-xl font-bold text-gray-800 truncate">{{ tipoPredominante }}</p>
          </div>
        </div>
      </div>

      <!-- Loading atributos -->
      <div v-if="cargandoAtributos" class="flex items-center justify-center py-12 bg-white rounded-2xl border border-gray-100">
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          <p class="text-xs text-gray-400">Cargando atributos...</p>
        </div>
      </div>

      <!-- Sin atributos -->
      <div v-else-if="atributos.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <PlusCircleIcon class="w-7 h-7 text-gray-300" />
        </div>
        <p class="text-gray-600 font-semibold text-sm">Sin atributos</p>
        <p class="text-gray-400 text-xs mt-1 mb-4">Crea el primer atributo de evaluación para este curso</p>
        <button
          @click="abrirModalCrear"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
        >
          <PlusIcon class="w-4 h-4" />
          Nuevo atributo
        </button>
      </div>

      <!-- Tabla de atributos -->
      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 lg:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ClipboardDocumentCheckIcon class="w-5 h-5 text-gray-400" />
            <p class="text-sm font-semibold text-gray-700">Atributos del curso</p>
            <span class="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ atributos.length }}</span>
          </div>
          <button
            @click="abrirModalCrear"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95"
          >
            <PlusIcon class="w-3.5 h-3.5" />
            Nuevo
          </button>
        </div>

        <!-- Chart: peso por atributo -->
        <div v-if="atributos.length >= 2" class="px-4 lg:px-6 pt-4 pb-2">
          <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            <p class="text-xs font-semibold text-gray-700 mb-3">Peso por atributo</p>
            <div class="h-48">
              <canvas ref="chartRef" />
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-50 bg-gray-50/50">
                <th class="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 lg:px-6 py-3">Nombre</th>
                <th class="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Peso</th>
                <th class="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Tipo</th>
                <th class="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 lg:px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="atri in atributos" :key="atri.c_atributo" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-4 lg:px-6 py-3.5">
                  <p class="font-semibold text-gray-800 text-sm">{{ atri.l_nombre }}</p>
                  <p v-if="atri.l_desc" class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{{ atri.l_desc }}</p>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :class="pesoBarColor(atri.peso)"
                        :style="{ width: atri.peso + '%' }"
                      />
                    </div>
                    <span class="text-xs font-semibold text-gray-600">{{ atri.peso }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <span class="text-[11px] font-medium" :class="tipoBadge(atri.tipo)">{{ atri.tipo }}</span>
                </td>
                <td class="px-4 lg:px-6 py-3.5 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="abrirModalEditar(atri)"
                      class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Editar"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="confirmarEliminar(atri)"
                      class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Eliminar"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Botón crear cuando hay tabla -->
      <div v-if="atributos.length > 0" class="flex justify-center">
        <button
          @click="abrirModalCrear"
          class="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 active:scale-95"
        >
          <PlusIcon class="w-5 h-5" />
          Nuevo atributo
        </button>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useAtributos } from '~/composable/atributos/useAtributos'
import { Chart, registerables } from 'chart.js'
import type { Atributo } from '~/types/atributo'

Chart.register(...registerables)

import {
  BookOpenIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  PlusIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  PercentBadgeIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { $supabase, $swal } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()
const cursoStore = useCursoStore()

const { atributos, loading: cargandoAtributos, pesoTotal, tipoPredominante, loadAtributos, create, update, remove } = useAtributos()

// ── Cursos ───────────────────────────────
const cargandoCursos = ref(false)
const cursos = ref<any[]>([])
const cursoSeleccionadoId = ref('')

async function cargarCursos() {
  if (cursoStore.cursos.length > 0) {
    cursos.value = cursoStore.cursos
    return
  }
  const c_aula = aulaStore.aulaActual?.c_aula
  if (!c_aula) return
  cargandoCursos.value = true
  try {
    const { data, error } = await $supabase
      .schema('core')
      .from('curso')
      .select('c_curso, l_curso, l_desc')
      .eq('c_aula', c_aula)
      .order('f_crea', { ascending: true })
    if (error) throw error
    cursos.value = data || []
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'No se pudieron cargar los cursos', icon: 'error' })
  } finally {
    cargandoCursos.value = false
  }
}

// ── Computed ─────────────────────────────
const inicialNombre = computed(() => authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?')

const pesoClase = computed(() => {
  if (pesoTotal.value === 100) return 'text-emerald-600'
  if (pesoTotal.value > 100) return 'text-red-600'
  return 'text-amber-600'
})

const barraPesoClase = computed(() => {
  if (pesoTotal.value === 100) return 'bg-emerald-500'
  if (pesoTotal.value > 100) return 'bg-red-500'
  return 'bg-amber-400'
})

const mensajePeso = computed(() => {
  if (pesoTotal.value === 0) return 'Agrega atributos para definir la evaluación'
  if (pesoTotal.value < 100) return `Falta ${100 - pesoTotal.value}% para completar la distribución`
  if (pesoTotal.value === 100) return 'Distribución correcta ✓'
  return `El peso supera el 100% en ${pesoTotal.value - 100}%`
})

const mensajePesoClase = computed(() => {
  if (pesoTotal.value === 100) return 'text-emerald-600'
  if (pesoTotal.value > 100) return 'text-red-600'
  return 'text-amber-600'
})

function pesoBarColor(peso: number): string {
  if (peso >= 25) return 'bg-emerald-500'
  if (peso >= 15) return 'bg-blue-500'
  return 'bg-amber-400'
}

function tipoBadge(tipo: string): string {
  const map: Record<string, string> = {
    'Académico': 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full',
    'Actitudinal': 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full',
    'Personalizado': 'text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full',
  }
  return map[tipo] ?? 'text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full'
}

// ── Chart ────────────────────────────────
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
  if (!chartRef.value || atributos.value.length < 2) return
  if (chartInstance) chartInstance.destroy()

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const labels = atributos.value.map(a => a.l_nombre)
  const data = atributos.value.map(a => a.peso)
  const colors = atributos.value.map((_, i) => {
    const palette = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']
    return palette[i % palette.length]
  })

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Peso (%)',
        data,
        backgroundColor: colors.map(c => c + 'CC'),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.x}%`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { font: { size: 10 }, stepSize: 20 },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y: {
          ticks: { font: { size: 11, weight: 'bold' } },
          grid: { display: false },
        },
      },
    },
  })
}

// ── Modales con SweetAlert ───────────────

function abrirModalCrear() {
  $swal.fire({
    title: 'Nuevo atributo',
    html: `
      <div class="space-y-3 text-left">
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Nombre</label>
          <input id="swal-nombre" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" placeholder="Ej: Conocimiento" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Descripción</label>
          <input id="swal-desc" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" placeholder="Opcional" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Peso (%)</label>
          <input id="swal-peso" type="number" min="1" max="100" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" placeholder="Ej: 30" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Tipo</label>
          <select id="swal-tipo" onchange="document.getElementById('swal-custom-tipo-container').style.display = this.value === '__custom__' ? 'block' : 'none'" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none">
            <option value="Académico">Académico</option>
            <option value="Actitudinal">Actitudinal</option>
            <option value="__custom__">Personalizado</option>
          </select>
        </div>
        <div id="swal-custom-tipo-container" style="display:none">
          <label class="text-xs font-semibold text-gray-600 block mb-1">Nombre del tipo personalizado</label>
          <input id="swal-custom-tipo" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" placeholder="Ej: Liderazgo" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    preConfirm: async () => {
      const nombre = (document.getElementById('swal-nombre') as HTMLInputElement)?.value.trim()
      const desc = (document.getElementById('swal-desc') as HTMLInputElement)?.value.trim()
      const peso = parseInt((document.getElementById('swal-peso') as HTMLInputElement)?.value)
      let tipo = (document.getElementById('swal-tipo') as HTMLSelectElement)?.value

      if (tipo === '__custom__') {
        tipo = (document.getElementById('swal-custom-tipo') as HTMLInputElement)?.value.trim()
        if (!tipo) {
          $swal.showValidationMessage('Escribe el nombre del tipo personalizado')
          return false
        }
      }

      if (!nombre) {
        $swal.showValidationMessage('El nombre es obligatorio')
        return false
      }
      if (!peso || peso < 1 || peso > 100) {
        $swal.showValidationMessage('El peso debe ser entre 1 y 100')
        return false
      }

      try {
        await create({
          c_curso: cursoSeleccionadoId.value,
          l_nombre: nombre,
          l_desc: desc || undefined,
          peso,
          tipo,
        })
        await nextTick()
        renderChart()
        $swal.fire({ title: 'Creado', text: 'Atributo creado correctamente', icon: 'success', timer: 1500, showConfirmButton: false })
      } catch (e: any) {
        $swal.showValidationMessage(e.message || 'Error al crear')
      }
    },
  })
}

function abrirModalEditar(atri: Atributo) {
  const esCustom = !['Académico', 'Actitudinal'].includes(atri.tipo)
  $swal.fire({
    title: 'Editar atributo',
    html: `
      <div class="space-y-3 text-left">
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Nombre</label>
          <input id="swal-nombre" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" value="${atri.l_nombre}" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Descripción</label>
          <input id="swal-desc" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" value="${atri.l_desc ?? ''}" placeholder="Opcional" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Peso (%)</label>
          <input id="swal-peso" type="number" min="1" max="100" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" value="${atri.peso}" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-1">Tipo</label>
          <select id="swal-tipo" onchange="document.getElementById('swal-custom-tipo-container').style.display = this.value === '__custom__' ? 'block' : 'none'" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none">
            <option value="Académico" ${atri.tipo === 'Académico' ? 'selected' : ''}>Académico</option>
            <option value="Actitudinal" ${atri.tipo === 'Actitudinal' ? 'selected' : ''}>Actitudinal</option>
            <option value="__custom__" ${esCustom ? 'selected' : ''}>Personalizado</option>
          </select>
        </div>
        <div id="swal-custom-tipo-container" style="${esCustom ? 'display:block' : 'display:none'}">
          <label class="text-xs font-semibold text-gray-600 block mb-1">Nombre del tipo personalizado</label>
          <input id="swal-custom-tipo" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none" value="${esCustom ? atri.tipo : ''}" placeholder="Ej: Liderazgo" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    preConfirm: async () => {
      const nombre = (document.getElementById('swal-nombre') as HTMLInputElement)?.value.trim()
      const desc = (document.getElementById('swal-desc') as HTMLInputElement)?.value.trim()
      const peso = parseInt((document.getElementById('swal-peso') as HTMLInputElement)?.value)
      let tipo = (document.getElementById('swal-tipo') as HTMLSelectElement)?.value

      if (tipo === '__custom__') {
        tipo = (document.getElementById('swal-custom-tipo') as HTMLInputElement)?.value.trim()
        if (!tipo) {
          $swal.showValidationMessage('Escribe el nombre del tipo personalizado')
          return false
        }
      }

      if (!nombre) {
        $swal.showValidationMessage('El nombre es obligatorio')
        return false
      }
      if (!peso || peso < 1 || peso > 100) {
        $swal.showValidationMessage('El peso debe ser entre 1 y 100')
        return false
      }

      try {
        await update(atri.c_atributo, {
          l_nombre: nombre,
          l_desc: desc || undefined,
          peso,
          tipo,
        })
        await nextTick()
        renderChart()
        $swal.fire({ title: 'Actualizado', text: 'Atributo actualizado correctamente', icon: 'success', timer: 1500, showConfirmButton: false })
      } catch (e: any) {
        $swal.showValidationMessage(e.message || 'Error al actualizar')
      }
    },
  })
}

async function confirmarEliminar(atri: Atributo) {
  const result = await $swal.fire({
    title: '¿Eliminar atributo?',
    html: `Se eliminará "<strong>${atri.l_nombre}</strong>" y <strong>todas las notas</strong> asociadas.<br><br>
           <span class="text-amber-600 font-semibold">El peso total bajará y deberás reconfigurar los pesos para que sumen 100%.</span>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    try {
      await remove(atri.c_atributo)
      await nextTick()
      renderChart()
      $swal.fire({ title: 'Eliminado', text: 'Atributo eliminado. Reconfigura los pesos en la sección Atributos.', icon: 'success', timer: 2000, showConfirmButton: false })
    } catch (e: any) {
      $swal.fire({ title: 'Error', text: e.message || 'No se pudo eliminar', icon: 'error' })
    }
  }
}

// ── Watchers ──────────────────────────────
watch(cursoSeleccionadoId, async (cursoId) => {
  if (!cursoId) {
    atributos.value = []
    return
  }
  try {
    await loadAtributos(cursoId)
    await nextTick()
    renderChart()
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'Error al cargar atributos', icon: 'error' })
  }
})

// ── Mount ─────────────────────────────────
onMounted(() => {
  cargarCursos()
})
</script>
