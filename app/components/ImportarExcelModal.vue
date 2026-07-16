<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="cerrar">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95 translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0">
          <div v-if="modelValue" class="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ArrowUpTrayIcon class="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-gray-800">Importar calificaciones</h2>
                  <p class="text-[10px] text-gray-400">Sube un archivo Excel para importar notas</p>
                </div>
              </div>
              <button @click="cerrar" class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- File upload -->
            <div v-if="!datosParseados" class="p-6">
              <div
                class="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition"
                @click="fileInput?.click()"
                @dragover.prevent="dragOver = true"
                @dragleave="dragOver = false"
                @drop.prevent="manejarDrop"
                :class="dragOver ? 'border-emerald-400 bg-emerald-50/50' : ''"
              >
                <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <ArrowUpTrayIcon class="w-7 h-7 text-emerald-400" />
                </div>
                <p class="text-sm font-semibold text-gray-700 mb-1">Sube tu archivo Excel</p>
                <p class="text-xs text-gray-400 mb-4">Formatos: .xlsx, .xls</p>
                <button class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition">
                  Seleccionar archivo
                </button>
                <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="manejarArchivo" />
              </div>
              <div v-if="errorParse" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <ExclamationTriangleIcon class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p class="text-xs text-red-700">{{ errorParse }}</p>
              </div>
            </div>

            <!-- Data preview with Handsontable -->
            <div v-else class="flex-1 overflow-hidden flex flex-col">
              <!-- Toolbar -->
              <div class="px-6 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-gray-600">{{ filasValidas }} estudiante{{ filasValidas !== 1 ? 's' : '' }}</span>
                  <span v-if="filasErrorTotal > 0" class="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{{ filasErrorTotal }} error{{ filasErrorTotal !== 1 ? 'es' : '' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="resetear" class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    Cancelar
                  </button>
                  <button @click="confirmarImportacion" :disabled="importando" class="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition">
                    <ArrowPathIcon v-if="importando" class="w-3.5 h-3.5 animate-spin" />
                    <CheckIcon v-else class="w-3.5 h-3.5" />
                    Importar
                  </button>
                </div>
              </div>

              <!-- Handsontable -->
              <div ref="hotContainer" class="flex-1 overflow-hidden"></div>

              <!-- Error summary -->
              <div v-if="erroresVisibles.length > 0" class="px-6 py-3 border-t border-red-100 bg-red-50/50 shrink-0 max-h-32 overflow-y-auto">
                <p class="text-[10px] font-bold text-red-700 mb-1 uppercase tracking-wider">Errores de validación</p>
                <p v-for="err in erroresVisibles" :key="err.fila + '-' + err.col" class="text-[11px] text-red-600 leading-relaxed">
                  Fila {{ err.fila }}, Columna "{{ err.col }}": {{ err.mensaje }}
                </p>
              </div>
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
import { ArrowUpTrayIcon, XMarkIcon, ExclamationTriangleIcon, CheckIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

import type { Estudiante } from '~/services/estudiantes/obtenerEstudiantesAula'
import type { Atributo } from '~/types/atributo'

const props = defineProps<{
  modelValue: boolean
  estudiantes: Estudiante[]
  atributos: Atributo[]
  cursoId: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'importar', data: { c_usua: string; c_atri: string; valor: number }[]): void
  (e: 'crearAtributo', nombre: string, peso: number): void
  (e: 'actualizarPesoAtributo', c_atributo: string, peso: number): void
}>()

const { $supabase, $swal } = useNuxtApp()

// ── State ──
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement>()
const errorParse = ref('')
const datosParseados = ref<any[] | null>(null)
const colAlumno = ref('')
const columnasDetectadas = ref<string[]>([])
const erroresValidacion = ref<{ fila: number; col: string; mensaje: string }[]>([])
const filaErrores = ref<Set<number>>(new Set())
const nuevosAtributosPendientes = ref<string[]>([])
const importando = ref(false)
const hotContainer = ref<HTMLDivElement>()
let hotInstance: Handsontable | null = null

// ── Computed ──
const filasValidas = computed(() => datosParseados.value?.length ?? 0)
const filasErrorTotal = computed(() => filaErrores.value.size)
const erroresVisibles = computed(() => erroresValidacion.value.slice(0, 20))

// ── Close / Reset ──
function cerrar() {
  destruirHot()
  emit('update:modelValue', false)
}

function resetear() {
  destruirHot()
  datosParseados.value = null
  colAlumno.value = ''
  columnasDetectadas.value = []
  erroresValidacion.value = []
  filaErrores.value = new Set()
  nuevosAtributosPendientes.value = []
  errorParse.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function destruirHot() {
  if (hotInstance) {
    hotInstance.destroy()
    hotInstance = null
  }
}

// ── String similarity ──
function normalizar(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function sugerirNombre(escrito: string): { match: string; razon: string } | null {
  const nom = normalizar(escrito)
  if (!nom) return null

  for (const est of props.estudiantes) {
    const nomEst = normalizar(est.nombre_completo)
    if (nomEst === nom) return null // exact match after normalization
  }

  let mejor: { match: string; razon: string; dist: number } | null = null

  for (const est of props.estudiantes) {
    const nomEst = normalizar(est.nombre_completo)
    const dist = levenshtein(nom, nomEst)
    const maxLen = Math.max(nom.length, nomEst.length)
    const sim = 1 - dist / maxLen

    if (sim >= 0.6 && (!mejor || dist < mejor.dist)) {
      let razon = ''
      if (nom !== nomEst && escrito.toLowerCase().trim() !== est.nombre_completo.trim().replace(/\s+/g, ' ').toLowerCase()) {
        razon = `¿Quisiste decir "${est.nombre_completo}"?`
        if (nom === nomEst) razon += ' (diferencia de tildes)'
        else razon += ' (nombre similar)'
      }
      mejor = { match: est.nombre_completo, razon, dist }
    }
  }

  return mejor
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i]![0] = i
  for (let j = 0; j <= n; j++) dp[0]![j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i]![j] = a[i - 1] === b[j - 1] ? dp[i - 1]![j - 1]! : Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!) + 1
    }
  }
  return dp[m]![n]!
}

// ── File handling ──
function manejarDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) procesarArchivo(file)
}

function manejarArchivo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) procesarArchivo(file)
}

function procesarArchivo(file: File) {
  errorParse.value = ''
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !['xlsx', 'xls'].includes(ext)) {
    errorParse.value = 'Formato no soportado. Usa .xlsx o .xls'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]!]
      const json = XLSX.utils.sheet_to_json<any>(firstSheet!, { defval: '' })
      if (json.length === 0) {
        errorParse.value = 'El archivo está vacío'
        return
      }
      prepararDatos(json)
    } catch (err) {
      errorParse.value = 'Error al leer el archivo: ' + (err as Error).message
    }
  }
  reader.readAsArrayBuffer(file)
}

// ── Data preparation ──
function prepararDatos(rows: any[]) {
  const headers = Object.keys(rows[0])
  const col = headers.find(h => /alumno|nombre|estudiante/i.test(h))
  if (!col) {
    errorParse.value = 'No se encontró una columna de nombres (Alumno, Nombre o Estudiante)'
    return
  }
  colAlumno.value = col

  const colAtributos = headers.filter(h => h !== col)
  columnasDetectadas.value = colAtributos

  const nuevos = colAtributos.filter(nombreAttr =>
    !props.atributos.some(a => a.l_nombre.toLowerCase().trim() === nombreAttr.toLowerCase().trim())
  )
  nuevosAtributosPendientes.value = nuevos

  const errores: { fila: number; col: string; mensaje: string }[] = []
  const filasErrorSet = new Set<number>()
  const data: any[] = []

  rows.forEach((row, i) => {
    const nombreAlumno = String(row[col] ?? '').trim().replace(/\s+/g, ' ')
    const match = props.estudiantes.find(e =>
      e.nombre_completo.trim().replace(/\s+/g, ' ').toLowerCase() === nombreAlumno.toLowerCase()
    )

    const entry: any = { _nombreOriginal: nombreAlumno }
    if (match) {
      entry._c_usua = match.c_usua
      entry[col] = match.nombre_completo
    } else {
      entry._c_usua = null
      entry[col] = nombreAlumno
      const sugerencia = sugerirNombre(nombreAlumno)
      if (sugerencia) {
        errores.push({ fila: i + 2, col, mensaje: `${sugerencia.razon}. Edita el nombre para corregir.` })
      } else {
        errores.push({ fila: i + 2, col, mensaje: `"${nombreAlumno}" no coincide con ningún alumno registrado` })
      }
      filasErrorSet.add(i)
    }

    for (const attr of colAtributos) {
      const val = parseFloat(String(row[attr]).replace(',', '.'))
      entry[attr] = isNaN(val) ? '' : val

      if (val < 0 || val > 20) {
        errores.push({ fila: i + 2, col: attr, mensaje: `Valor ${val} fuera de rango (0-20)` })
        filasErrorSet.add(i)
      }
    }

    data.push(entry)
  })

  erroresValidacion.value = errores
  filaErrores.value = filasErrorSet
  datosParseados.value = data

  nextTick(async () => {
    if (nuevos.length > 0) {
      await preguntarNuevosAtributos(nuevos)
    }
    inicializarHandsontable()
  })
}

// ── Weight redistribution dialog ──
async function preguntarNuevosAtributos(nuevos: string[]) {
  // Build a dynamic HTML form with all attributes + new ones
  const todos = [
    ...props.atributos.map(a => ({ nombre: a.l_nombre, peso: a.peso, isNew: false, c_atributo: a.c_atributo })),
    ...nuevos.map(n => ({ nombre: n, peso: 10, isNew: true, c_atributo: null as string | null })),
  ]

  let html = `<div class="space-y-3 text-left">`
  html += `<p class="text-sm font-semibold text-gray-700 mb-4">Se detectaron nuevos atributos. Redistribuye los pesos:</p>`
  html += `<div class="max-h-60 overflow-y-auto space-y-2">`

  for (let i = 0; i < todos.length; i++) {
    const t = todos[i]!
    html += `
      <div class="flex items-center gap-3 p-2 rounded-lg ${t.isNew ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}">
        <span class="text-xs font-medium text-gray-700 flex-1 ${t.isNew ? 'text-emerald-700' : ''}">
          ${t.isNew ? '🆕 ' : ''}${t.nombre}
        </span>
        <input id="peso_${i}" type="number" min="0" max="100" value="${t.peso}"
          class="w-20 text-center text-sm border border-gray-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400" />
        <span class="text-xs text-gray-400 w-6">%</span>
      </div>`
  }
  html += `</div>`
  html += `<p id="pesoTotalMsg" class="text-xs font-semibold text-center mt-2 text-gray-500">Total: <span id="pesoTotalVal">${todos.reduce((s, t) => s + t.peso, 0)}</span>%</p>`
  html += `</div>`

  const result = await $swal.fire({
    title: 'Redistribuir pesos',
    html,
    showCancelButton: true,
    confirmButtonText: 'Guardar pesos',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    didOpen: () => {
      // Add live total calculation
      const inputs = document.querySelectorAll('[id^="peso_"]')
      const totalEl = document.getElementById('pesoTotalVal')
      const msgEl = document.getElementById('pesoTotalMsg')
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          let total = 0
          inputs.forEach(inp => {
            total += parseFloat((inp as HTMLInputElement).value) || 0
          })
          if (totalEl) totalEl.textContent = String(total)
          if (msgEl) {
            if (total === 100) {
              msgEl.className = 'text-xs font-semibold text-center mt-2 text-emerald-600'
            } else {
              msgEl.className = 'text-xs font-semibold text-center mt-2 text-red-500'
            }
          }
        })
      })
    },
    preConfirm: () => {
      const pesos: number[] = []
      for (let i = 0; i < todos.length; i++) {
        const input = document.getElementById(`peso_${i}`) as HTMLInputElement
        const val = parseFloat(input?.value)
        if (isNaN(val) || val < 0 || val > 100) {
          $swal.showValidationMessage(`Peso inválido para "${todos[i]!.nombre}"`)
          return false
        }
        pesos.push(val)
      }
      const total = pesos.reduce((s, v) => s + v, 0)
      if (total !== 100) {
        $swal.showValidationMessage(`Los pesos deben sumar exactamente 100% (actual: ${total}%)`)
        return false
      }
      return pesos
    }
  })

  if (!result.isConfirmed || !result.value) return

  const pesos = result.value as number[]

  // Update existing attributes in DB
  for (let i = 0; i < todos.length; i++) {
    const t = todos[i]!
    if (!t.isNew && t.peso !== pesos[i]) {
      try {
        await $supabase
          .schema('core')
          .from('atributo')
          .update({ peso: pesos[i]! })
          .eq('c_atributo', t.c_atributo)
        emit('actualizarPesoAtributo', t.c_atributo!, pesos[i]!)
      } catch (e: any) {
        console.error('Error updating weight:', e)
      }
    }
  }

  // Create new attributes
  for (let i = 0; i < todos.length; i++) {
    const t = todos[i]!
    if (t.isNew) {
      emit('crearAtributo', t.nombre, pesos[i]!)
    }
  }
}

// ── Handsontable ──
function inicializarHandsontable() {
  if (!hotContainer.value) return
  destruirHot()

  const col = colAlumno.value
  const colAtributos = columnasDetectadas.value

  const columns = [
    {
      data: col,
      title: 'Alumno',
      type: 'text',
      validator: (value: any, callback: (valid: boolean) => void) => {
        const str = String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
        if (!str) { callback(false); return }
        const match = props.estudiantes.find(e =>
          e.nombre_completo.trim().replace(/\s+/g, ' ').toLowerCase() === str
        )
        if (match) { callback(true); return }
        const sug = sugerirNombre(str)
        if (sug) { callback(false); return }
        callback(false)
      },
      invalidCellClassName: 'htInvalid',
    },
    ...colAtributos.map(attr => ({
      data: attr,
      title: attr,
      type: 'numeric',
      numericFormat: { pattern: '0.0' },
      validator: (value: any, callback: (valid: boolean) => void) => {
        if (value === '' || value === null || value === undefined) { callback(true); return }
        const n = parseFloat(String(value).replace(',', '.'))
        callback(!isNaN(n) && n >= 0 && n <= 20)
      },
      allowInvalid: false,
      invalidCellClassName: 'htInvalid',
    })),
  ]

  hotInstance = new Handsontable(hotContainer.value, {
    data: datosParseados.value!.map(row => {
      const r: any = { [col]: row[col] }
      for (const attr of colAtributos) {
        r[attr] = row[attr] ?? ''
      }
      return r
    }),
    columns,
    colHeaders: true,
    rowHeaders: true,
    height: 'auto',
    stretchH: 'all',
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: false,
    manualColumnResize: true,
    manualRowResize: false,
    afterChange: (changes) => {
      if (!changes || !datosParseados.value) return
      const col = colAlumno.value

      for (const [row, prop, oldVal, newVal] of changes) {
        const entry = datosParseados.value[row]

        if (prop === col) {
          // Student name changed
          const str = String(newVal ?? '').trim().replace(/\s+/g, ' ')
          entry[col] = newVal
          entry._nombreOriginal = str

          const match = props.estudiantes.find(e =>
            e.nombre_completo.trim().replace(/\s+/g, ' ').toLowerCase() === str.toLowerCase()
          )
          if (match) {
            entry._c_usua = match.c_usua
            entry[col] = match.nombre_completo
            // Remove name errors
            erroresValidacion.value = erroresValidacion.value.filter(e => e.fila !== row + 2 || e.col === col)
            filaErrores.value.delete(row)
          } else {
            entry._c_usua = null
            // Add/replace error
            erroresValidacion.value = erroresValidacion.value.filter(e => e.fila !== row + 2 || e.col !== col)
            const sug = sugerirNombre(str)
            if (sug) {
              erroresValidacion.value.push({ fila: row + 2, col, mensaje: `${sug.razon}. Edita el nombre para corregir.` })
            } else {
              erroresValidacion.value.push({ fila: row + 2, col, mensaje: `"${str}" no coincide con ningún alumno registrado` })
            }
            filaErrores.value.add(row)
          }
        } else {
          // Attribute value changed
          const val = parseFloat(String(newVal ?? '').replace(',', '.'))
          entry[prop as string] = isNaN(val) || newVal === '' || newVal === null ? '' : val

          // Validate range
          erroresValidacion.value = erroresValidacion.value.filter(e => !(e.fila === row + 2 && e.col === (prop as string)))
          if (val < 0 || val > 20) {
            erroresValidacion.value.push({ fila: row + 2, col: prop as string, mensaje: `Valor ${val} fuera de rango (0-20)` })
            filaErrores.value.add(row)
          } else if (entry._c_usua !== null) {
            filaErrores.value.delete(row)
          }
        }
      }
    },
    cells: (row: number, _column: number, _prop: string | number) => {
      if (filaErrores.value.has(row)) {
        return { className: 'htInvalid' }
      }
      return {}
    },
  })
}

// ── Import ──
async function confirmarImportacion() {
  if (!datosParseados.value) return

  // Check unresolved names
  const unresolved = erroresValidacion.value.filter(e =>
    e.col === colAlumno.value
  )
  if (unresolved.length > 0) {
    const result = await $swal.fire({
      title: 'Nombres sin resolver',
      text: `${unresolved.length} estudiante(s) tienen nombres no reconocidos. Se omitirán esas filas.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Importar igual',
      cancelButtonText: 'Revisar',
      confirmButtonColor: '#10b981',
    })
    if (!result.isConfirmed) return
  }

  importando.value = true
  try {
    const colAtributos = columnasDetectadas.value
    const valores: { c_usua: string; c_atri: string; valor: number }[] = []
    let omitidos = 0

    for (const row of datosParseados.value) {
      if (!row._c_usua) { omitidos++; continue }
      for (const attr of colAtributos) {
        const val = parseFloat(String(row[attr]).replace(',', '.'))
        if (isNaN(val) || row[attr] === '' || row[attr] === null) continue
        const atri = props.atributos.find(a =>
          a.l_nombre.toLowerCase().trim() === attr.toLowerCase().trim()
        )
        if (!atri) continue
        valores.push({ c_usua: row._c_usua, c_atri: atri.c_atributo, valor: val })
      }
    }

    // Batch upsert
    for (const v of valores) {
      await $supabase
        .schema('core')
        .from('valor_atributo')
        .upsert(
          { c_usua: v.c_usua, c_atri: v.c_atri, valor: v.valor },
          { onConflict: 'c_atri,c_usua' }
        )
    }

    emit('importar', valores)
    await $swal.fire({
      title: 'Importado',
      text: `${valores.length} calificaciones importadas${omitidos > 0 ? `, ${omitidos} omitidos` : ''}`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
    resetear()
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message || 'Error al importar', icon: 'error' })
  } finally {
    importando.value = false
  }
}

// Cleanup
watch(() => props.modelValue, (val) => {
  if (!val) resetear()
})
</script>
