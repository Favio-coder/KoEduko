<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-white rounded-2xl shadow p-4 lg:p-6 flex items-center gap-3 lg:gap-4">
      <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-xl lg:text-2xl font-bold shrink-0">
        {{ inicialNombre }}
      </div>
      <div class="min-w-0">
        <h1 class="text-lg lg:text-2xl font-bold text-[#264e49] truncate">
          {{ esDocente ? 'Evaluación por atributos' : 'Mis calificaciones' }}
        </h1>
        <p class="text-xs lg:text-sm text-gray-500 truncate">{{ authStore.perfil?.instieducativo?.l_col }}</p>
        <p class="text-[10px] lg:text-xs text-gray-400 mt-0.5 lg:mt-1 truncate">
          {{ aulaStore.contextoActual || (esDocente ? 'Selecciona un aula en Principal' : 'Tu aula asignada') }}
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
    <div v-if="cargandoCursos" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p class="text-sm text-gray-500 mt-4">Cargando cursos...</p>
    </div>

    <!-- Sin curso -->
    <div v-else-if="!cursoSeleccionadoId" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <AcademicCapIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">{{ esDocente ? 'Selecciona un curso' : 'Elige un curso' }}</p>
      <p class="text-gray-400 text-xs mt-1">{{ esDocente ? 'Selecciona un curso para evaluar' : 'Selecciona un curso para ver tus notas' }}</p>
    </div>

    <!-- Sin cursos -->
    <div v-else-if="cursos.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <BookOpenIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">No hay cursos disponibles</p>
      <p class="text-gray-400 text-xs mt-1">Este aula no tiene cursos asignados</p>
    </div>

    <!-- ══════════════════════════════════════════
         VISTA DOCENTE: Evaluación por atributos
    ══════════════════════════════════════════ -->
    <template v-else-if="esDocente">

      <!-- Validación: sin atributos -->
      <div v-if="atributos.length === 0 && !cargandoAtributos" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <ExclamationTriangleIcon class="w-7 h-7 text-amber-400" />
        </div>
        <p class="text-gray-700 font-semibold text-sm">Faltan atributos de evaluación</p>
        <p class="text-gray-400 text-xs mt-1 mb-4">Crea atributos y asigna pesos en la sección Atributos</p>
        <NuxtLink to="/atributos" class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition">
          <PlusIcon class="w-4 h-4" />
          Ir a Atributos
        </NuxtLink>
      </div>

      <!-- Validación: peso incorrecto -->
      <div v-else-if="pesoTotal !== 100 && atributos.length > 0" class="bg-amber-50 border border-amber-200 rounded-2xl p-4 lg:p-5 flex items-start gap-3">
        <ExclamationTriangleIcon class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-bold text-amber-800">Distribución de pesos incorrecta</p>
          <p class="text-xs text-amber-700 mt-1">
            El peso total es <strong>{{ pesoTotal }}%</strong>, debe ser exactamente 100%.
            Ve a <NuxtLink to="/atributos" class="underline font-semibold">Atributos</NuxtLink> para ajustarlos.
          </p>
        </div>
      </div>

      <!-- Grid de evaluación -->
      <div v-else-if="atributos.length > 0 && estudiantes.length > 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 lg:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AcademicCapIcon class="w-5 h-5 text-gray-400" />
            <p class="text-sm font-semibold text-gray-700">Calificar alumnos</p>
            <span class="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ estudiantes.length }} estudiantes</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative">
              <button @click="mostrarExportMenu = !mostrarExportMenu" class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 text-gray-500 text-xs font-semibold rounded-xl transition">
                <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                Exportar
              </button>
              <div v-if="mostrarExportMenu" class="fixed inset-0 z-10" @click="mostrarExportMenu = false" />
              <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95 translate-y-1" enter-to-class="opacity-100 scale-100 translate-y-0">
                <div v-if="mostrarExportMenu" class="absolute right-0 mt-1.5 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  <button @click="exportarExcel" :disabled="exportando" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 transition">
                    <DocumentIcon class="w-4 h-4" />
                    Excel (.xlsx)
                  </button>
                  <button @click="exportarPDF" :disabled="exportando" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 transition border-t border-gray-50">
                    <DocumentTextIcon class="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </Transition>
            </div>
            <button @click="abrirImportar" class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 text-gray-500 text-xs font-semibold rounded-xl transition">
              <ArrowUpTrayIcon class="w-3.5 h-3.5" />
              Importar Excel
            </button>
            <span v-if="saving" class="text-[10px] text-emerald-600 font-medium animate-pulse">Guardando...</span>
          </div>
        </div>

        <!-- Loading grid data -->
        <div v-if="cargandoGrid" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-2">
            <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            <p class="text-xs text-gray-400">Cargando datos...</p>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table ref="tablaExportRef" class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-50 bg-gray-50/50">
                <th class="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 lg:px-6 py-3 sticky left-0 bg-gray-50/50 z-10">Alumno</th>
                <th v-for="atri in atributos" :key="atri.c_atributo" class="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 py-3 min-w-[90px]">
                  <div class="flex flex-col items-center">
                    <span>{{ atri.l_nombre }}</span>
                    <span class="text-[9px] text-gray-400 font-normal">({{ atri.peso }}%)</span>
                  </div>
                </th>
                <th class="text-center text-[10px] font-semibold text-emerald-600 uppercase tracking-wider px-3 py-3 min-w-[80px] bg-gray-50/50">Prom. Pond</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="est in estudiantes" :key="est.c_usua" class="hover:bg-gray-50/30 transition-colors">
                <td class="px-4 lg:px-6 py-2.5 sticky left-0 bg-white z-10">
                  <p class="font-semibold text-gray-800 text-sm whitespace-nowrap">{{ est.nombre_completo }}</p>
                </td>
                <td v-for="atri in atributos" :key="`${est.c_usua}-${atri.c_atributo}`" class="px-2 py-2.5 text-center">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    :value="getValor(atri.c_atributo, est.c_usua)"
                    @change="onCambioValor(atri.c_atributo, est.c_usua, ($event.target as HTMLInputElement).value)"
                    class="w-16 text-center text-sm font-semibold border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white text-gray-800"
                  />
                </td>
                <td class="px-3 py-2.5 text-center">
                  <span :class="promedioClase(promedioPonderado(est))">{{ promedioPonderado(est).toFixed(1) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sin estudiantes -->
      <div v-else-if="!cargandoGrid && estudiantes.length === 0 && atributos.length > 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <UsersIcon class="w-7 h-7 text-gray-300" />
        </div>
        <p class="text-gray-500 font-semibold text-sm">No hay estudiantes en este curso</p>
      </div>
    </template>

    <!-- ══════════════════════════════════════════
         VISTA ALUMNO: Mis calificaciones
    ══════════════════════════════════════════ -->
    <template v-else>
      <div v-if="cargandoAtributos" class="flex items-center justify-center py-12">
        <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>

      <div v-else-if="misNotas.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <AcademicCapIcon class="w-7 h-7 text-gray-300" />
        </div>
        <p class="text-gray-500 font-semibold text-sm">Sin calificaciones aún</p>
        <p class="text-gray-400 text-xs mt-1">El docente aún no ha registrado notas para este curso</p>
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 lg:px-6 py-4 border-b border-gray-100">
          <p class="text-sm font-semibold text-gray-700">Tus notas</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-50 bg-gray-50/50">
                <th class="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 lg:px-6 py-3">Atributo</th>
                <th class="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Peso</th>
                <th class="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Nota</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="n in misNotas" :key="n.c_atributo" class="hover:bg-gray-50/30 transition-colors">
                <td class="px-4 lg:px-6 py-3">
                  <p class="font-semibold text-gray-800 text-sm">{{ n.l_nombre }}</p>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-xs text-gray-500">{{ n.peso }}%</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="notaClase(n.valor)">{{ n.valor.toFixed(1) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

  </div>

  <!-- Importar Excel Modal -->
  <ImportarExcelModal
    v-model="mostrarImportar"
    :estudiantes="estudiantes"
    :atributos="atributos"
    :cursoId="cursoSeleccionadoId"
    @importar="onImportados"
    @crear-atributo="onCrearAtributoDesdeImport"
    @actualizar-peso-atributo="onActualizarPesoAtributo"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useAtributos } from '~/composable/atributos/useAtributos'
import { useEvaluacion } from '~/composable/calificaciones/useEvaluacion'
import { obtenerValoresAtributo } from '~/services/atributos/obtenerValoresAtributo'
import { guardarValorAtributo } from '~/services/atributos/guardarValorAtributo'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

const ImportarExcelModal = defineAsyncComponent(() => import('~/components/ImportarExcelModal.vue'))

import {
  BookOpenIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { $supabase, $swal } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()
const cursoStore = useCursoStore()

// ── Export ────────────────────────────────
const mostrarExportMenu = ref(false)
const tablaExportRef = ref<HTMLTableElement>()
const exportando = ref(false)

async function exportarExcel() {
  mostrarExportMenu.value = false
  if (!cursoSeleccionadoId.value || atributos.length === 0) return
  exportando.value = true
  try {
    const curso = cursos.value.find(c => c.c_curso === cursoSeleccionadoId.value)
    const nombreCurso = curso?.l_curso ?? 'Curso'
    const usuario = authStore.perfil?.l_nom + ' ' + (authStore.perfil?.l_apellp ?? '')
    const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })

    const headers = ['Alumno', ...atributos.value.map(a => a.l_nombre), 'Prom. Pond']
    const rows = estudiantes.value.map(est => [
      est.nombre_completo,
      ...atributos.value.map(a => getValor(a.c_atributo, est.c_usua)),
      promedioPonderado(est),
    ])

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

    ws['!cols'] = [{ wch: 35 }, ...atributos.value.map(() => ({ wch: 15 })), { wch: 12 }]

    XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones')

    const meta = [[`Exportado por: ${usuario}`], [`Fecha: ${fecha}`], [`Curso: ${nombreCurso}`]]
    const wsMeta = XLSX.utils.aoa_to_sheet(meta)
    XLSX.utils.book_append_sheet(wb, wsMeta, 'Metadatos')

    XLSX.writeFile(wb, `Calificaciones_${nombreCurso.replace(/\s+/g, '_')}.xlsx`)
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'Error al exportar', icon: 'error' })
  } finally {
    exportando.value = false
  }
}

async function exportarPDF() {
  mostrarExportMenu.value = false
  exportando.value = true
  try {
    const usuario = authStore.perfil?.l_nom + ' ' + (authStore.perfil?.l_apellp ?? '')
    const apellido = authStore.perfil?.l_apellp ?? ''
    const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
    const curso = cursos.value.find(c => c.c_curso === cursoSeleccionadoId.value)
    const nombreCurso = curso?.l_curso ?? 'Curso'

    const pdf = new jsPDF('l', 'mm', 'a4')
    const pageW = pdf.internal.pageSize.getWidth()
    let y = 14

    pdf.setFontSize(11)
    pdf.text(`Curso: ${nombreCurso}`, 14, y)
    y += 6
    pdf.setFontSize(9)
    pdf.text(`Exportado por: ${usuario}  |  ${fecha}`, 14, y)
    y += 10

    const colW = 30
    const nameW = 50
    const startX = 14
    const headerH = 8
    const rowH = 7
    const marginLeft = 14

    const headers = ['Alumno', ...atributos.value.map(a => a.l_nombre), 'Prom.']

    // Header bg
    pdf.setFillColor(45, 79, 79)
    pdf.rect(marginLeft, y - headerH + 2, pageW - 28, headerH, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(7)

    let x = marginLeft
    pdf.text('Alumno', x + 1, y - 1)
    x += nameW
    for (const h of headers.slice(1, -1)) {
      pdf.text(h, x + colW / 2 - (h.length * 1.5), y - 1, { align: 'center' })
      x += colW
    }
    pdf.text('Prom.', x + 1, y - 1)
    y += headerH

    // Rows
    pdf.setTextColor(50, 50, 50)
    pdf.setDrawColor(200, 200, 200)
    let rowNum = 0
    for (const est of estudiantes.value) {
      if (y + rowH > pdf.internal.pageSize.getHeight() - 14) {
        pdf.addPage()
        y = 14
      }

      if (rowNum % 2 === 0) {
        pdf.setFillColor(245, 245, 245)
        pdf.rect(marginLeft, y - rowH + 2, pageW - 28, rowH, 'F')
      }

      x = marginLeft
      pdf.text(est.nombre_completo, x + 1, y - 1)
      x += nameW
      for (const a of atributos.value) {
        const val = getValor(a.c_atributo, est.c_usua)
        pdf.text(val > 0 ? val.toFixed(1) : '—', x + colW / 2 - 3, y - 1, { align: 'center' })
        x += colW
      }
      const prom = promedioPonderado(est)
      pdf.setTextColor(prom >= 17 ? 22 : prom >= 14 ? 37 : prom >= 11 ? 180 : 200, prom >= 17 ? 163 : prom >= 14 ? 99 : prom >= 11 ? 83 : 50, prom >= 17 ? 74 : prom >= 14 ? 235 : prom >= 11 ? 9 : 50)
      pdf.text(prom.toFixed(1), x + colW / 2 - 3, y - 1, { align: 'center' })
      pdf.setTextColor(50, 50, 50)

      y += rowH
      rowNum++
    }

    pdf.save(`Calificaciones_${nombreCurso.replace(/\s+/g, '_')}.pdf`)
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'Error al exportar PDF', icon: 'error' })
  } finally {
    exportando.value = false
  }
}

const { atributos, loading: cargandoAtributos, pesoTotal, loadAtributos } = useAtributos()
const { estudiantes, loading: cargandoEstudiantes, getValor, saveValor, loadEstudiantes, loadValores } = useEvaluacion()

const esDocente = computed(() => authStore.perfil?.rol?.l_rol === 'Docente')

function promedioPonderado(est: Estudiante): number {
  let sumaValorPeso = 0
  let sumaPesos = 0
  for (const a of atributos.value) {
    const val = getValor(a.c_atributo, est.c_usua)
    if (val > 0) {
      sumaValorPeso += val * a.peso
      sumaPesos += a.peso
    }
  }
  return sumaPesos > 0 ? sumaValorPeso / sumaPesos : 0
}

function promedioClase(p: number): string {
  if (p === 0) return 'text-sm font-bold text-gray-300'
  if (p >= 17) return 'text-sm font-bold text-emerald-600'
  if (p >= 14) return 'text-sm font-bold text-blue-600'
  if (p >= 11) return 'text-sm font-bold text-amber-600'
  return 'text-sm font-bold text-red-600'
}

// ── Importar Excel ────────────────────────
const mostrarImportar = ref(false)

function abrirImportar() {
  mostrarImportar.value = true
}

function onImportados(valores: { c_usua: string; c_atri: string; valor: number }[]) {
  for (const v of valores) {
    saveValor(v.c_atri, v.c_usua, v.valor)
  }
  mostrarImportar.value = false
}

async function onCrearAtributoDesdeImport(nombre: string, peso: number) {
  try {
    const { error } = await $supabase
      .schema('core')
      .from('atributo')
      .insert({
        c_curso: cursoSeleccionadoId.value,
        l_nombre: nombre,
        peso,
        tipo: 'Académico',
      })
    if (error) throw error
    await loadAtributos(cursoSeleccionadoId.value)
  } catch (e: any) {
    $swal.fire({ title: 'Error', text: e.message || 'No se pudo crear el atributo', icon: 'error' })
  }
}

function onActualizarPesoAtributo(c_atributo: string, peso: number) {
  const idx = atributos.value.findIndex(a => a.c_atributo === c_atributo)
  if (idx !== -1) {
    atributos.value[idx] = { ...atributos.value[idx], peso }
  }
}

// ── Cursos ───────────────────────────────
const cargandoCursos = ref(false)
const cursos = ref<any[]>([])
const cursoSeleccionadoId = ref('')
const cargandoGrid = ref(false)
const saving = ref(false)

const c_usua = computed(() => authStore.perfil?.c_instanceId)

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
      .select('c_curso, l_curso, l_desc, c_aula')
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

function notaClase(val: number): string {
  if (val >= 17) return 'text-sm font-semibold text-emerald-600'
  if (val >= 14) return 'text-sm font-semibold text-blue-600'
  if (val >= 11) return 'text-sm font-semibold text-amber-600'
  if (val === 0) return 'text-sm font-semibold text-gray-300'
  return 'text-sm font-semibold text-red-600'
}

// ── Notas del alumno ─────────────────────
const misNotas = ref<any[]>([])

async function cargarMisNotas() {
  if (!cursoSeleccionadoId.value || !c_usua.value) {
    misNotas.value = []
    return
  }
  try {
    await loadAtributos(cursoSeleccionadoId.value)
    if (atributos.value.length === 0) {
      misNotas.value = []
      return
    }
    const rows = await obtenerValoresAtributo($supabase, atributos.value.map(a => a.c_atributo))
    const notasMap = new Map(rows.map(r => [r.c_atri, r.valor]))
    misNotas.value = atributos.value.map(a => ({
      c_atributo: a.c_atributo,
      l_nombre: a.l_nombre,
      peso: a.peso,
      valor: notasMap.get(a.c_atributo) ?? 0,
    }))
  } catch (e: any) {
    console.error('Error cargando notas:', e)
    misNotas.value = []
  }
}

// ── Grid docente ─────────────────────────
async function cargarGridDocente() {
  if (!cursoSeleccionadoId.value) return

  cargandoGrid.value = true
  try {
    await loadAtributos(cursoSeleccionadoId.value)
    if (atributos.value.length > 0) {
      await Promise.all([
        loadEstudiantes(cursoSeleccionadoId.value),
        loadValores(atributos.value),
      ])
    }
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'Error al cargar datos', icon: 'error' })
  } finally {
    cargandoGrid.value = false
  }
}

async function onCambioValor(c_atri: string, c_usua: string, raw: string) {
  const val = raw.trim() === '' ? 0 : parseFloat(raw)
  if (isNaN(val) || val < 0 || val > 20) return
  saving.value = true
  try {
    await saveValor(c_atri, c_usua, val)
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'No se pudo guardar', icon: 'error' })
  } finally {
    saving.value = false
  }
}

// ── Watchers ──────────────────────────────
watch(cursoSeleccionadoId, async () => {
  if (!cursoSeleccionadoId.value) return
  if (esDocente.value) {
    await cargarGridDocente()
  } else {
    await cargarMisNotas()
  }
})

// ── Mount ─────────────────────────────────
onMounted(() => {
  cargarCursos()
})
</script>
