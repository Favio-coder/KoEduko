<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="cerrar">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95 translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0">
          <div v-if="modelValue" class="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                  <DocumentArrowDownIcon class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-gray-800">Vista previa — Exportar SIAGIE</h2>
                  <p class="text-[10px] text-gray-400">Formato: {{ areaSeleccionada }} · {{ gradoText }} · {{ cursoSeleccionado?.l_curso }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="exportarExcel" :disabled="exportando"
                  class="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60">
                  <ArrowDownTrayIcon class="w-4 h-4" />
                  {{ exportando ? 'Exportando...' : 'Exportar Excel' }}
                </button>
                <button @click="cerrar" class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Info bar -->
            <div class="px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0 flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1.5">
                <UsersIcon class="w-3.5 h-3.5 text-gray-400" />
                {{ estudiantes.length }} estudiante{{ estudiantes.length !== 1 ? 's' : '' }}
              </span>
              <span class="flex items-center gap-1.5">
                <RectangleStackIcon class="w-3.5 h-3.5 text-gray-400" />
                {{ exportData.length }} fila{{ exportData.length !== 1 ? 's' : '' }}
              </span>
              <span class="flex items-center gap-1.5">
                <SwatchIcon class="w-3.5 h-3.5 text-gray-400" />
                {{ Object.keys(resultadosPorCompetencia).length }} competencia{{ Object.keys(resultadosPorCompetencia).length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Handsontable -->
            <div ref="hotContainer" class="flex-1 overflow-hidden"></div>

            <!-- Footer legend -->
            <div class="px-6 py-3 border-t border-gray-100 shrink-0 flex items-center gap-4 text-[10px] text-gray-400">
              <span>ID y CODESTUDIANTE se exportarán vacíos (formato SIAGIE)</span>
              <span class="ml-auto">1 fila por estudiante por competencia — {{ exportData.length }} fila{{ exportData.length !== 1 ? 's' : '' }} en total</span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Handsontable from 'handsontable'
import 'handsontable/styles/handsontable.css'
import 'handsontable/styles/ht-theme-main.css'
import * as XLSX from 'xlsx'
import {
  DocumentArrowDownIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  RectangleStackIcon,
  SwatchIcon,
} from '@heroicons/vue/24/outline'

interface Estudiante {
  c_usua: string
  nombre_completo: string
}

interface Resultado {
  estudiante: string
  calificativo: 'AD' | 'A' | 'B' | 'C'
  conclusionDescriptiva: string
}

interface Competencia {
  nombre: string
  descripcion: string
}

const props = defineProps<{
  modelValue: boolean
  estudiantes: Estudiante[]
  resultadosPorCompetencia: { [compIndex: number]: Resultado[] }
  competencias: Competencia[]
  competenciasSeleccionadas: number[]
  areaSeleccionada: string
  gradoText: string
  nivelSeleccionado: string
  cursoSeleccionado: any | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const hotContainer = ref<HTMLDivElement>()
let hotInstance: Handsontable | null = null
const exportando = ref(false)

const columnsDef = [
  { data: 'ID', title: 'ID', type: 'text', readOnly: true },
  { data: 'CODESTUDIANTE', title: 'CODESTUDIANTE', type: 'text', readOnly: true },
  { data: 'Nombres y apellidos', title: 'Nombres y apellidos', type: 'text', readOnly: true },
  { data: 'NL', title: 'NL', type: 'text', readOnly: true },
  { data: 'Conclusión Descriptiva de la competencia', title: 'Conclusión Descriptiva de la competencia', type: 'text', readOnly: true },
]

const exportData = computed(() => {
  const rows: any[] = []
  for (const est of props.estudiantes) {
    for (const ci of props.competenciasSeleccionadas) {
      const comp = props.competencias[ci]
      if (!comp) continue
      const result = props.resultadosPorCompetencia[ci]?.find(r => r.estudiante === est.nombre_completo)
      rows.push({
        ID: '',
        CODESTUDIANTE: '',
        'Nombres y apellidos': est.nombre_completo,
        'NL': result?.calificativo || '',
        'Conclusión Descriptiva de la competencia': result?.conclusionDescriptiva || '',
      })
    }
  }
  return rows
})

function destruirHot() {
  if (hotInstance) {
    hotInstance.destroy()
    hotInstance = null
  }
}

function inicializarHandsontable() {
  if (!hotContainer.value) return
  destruirHot()

  hotInstance = new Handsontable(hotContainer.value, {
    data: exportData.value,
    columns: columnsDef,
    colHeaders: true,
    rowHeaders: true,
    height: 'auto',
    stretchH: 'all',
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: false,
    readOnly: true,
    manualColumnResize: true,
    manualRowResize: false,
    colWidths: [50, 140, 220, 50, 400],
  })
}

function cerrar() {
  destruirHot()
  emit('update:modelValue', false)
}

function exportarExcel() {
  exportando.value = true
  try {
    const headers = columnsDef.map(c => c.title)
    const rows = exportData.value.map(row => columnsDef.map(c => row[c.data as keyof typeof row] ?? ''))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

    ws['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 40 },
      { wch: 6 },
      { wch: 60 },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'SIAGIE')

    const nivel = props.nivelSeleccionado
    const grado = props.gradoText
    const area = props.areaSeleccionada
    const curso = props.cursoSeleccionado?.l_curso || ''
    const filename = `SIAGIE_${nivel}_${grado}_${area}_${curso}.xlsx`
      .replace(/\s+/g, '_')
      .replace(/[^\w\-_.]/g, '')

    XLSX.writeFile(wb, filename)
  } finally {
    exportando.value = false
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    nextTick(() => inicializarHandsontable())
  } else {
    destruirHot()
  }
})
</script>
