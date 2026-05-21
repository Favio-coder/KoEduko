<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Estudiantes</h1>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ aulaStore.contextoActual || 'Selecciona un aula en Principal' }}
        </p>
      </div>
    </div>

    <!-- CONTROLES: Select de curso + Search -->
    <div class="flex flex-col sm:flex-row gap-4">

      <!-- Select curso -->
      <div class="relative sm:w-80">
        <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <BookOpenIcon class="w-4 h-4 text-gray-400" />
        </div>
        <select
          v-model="cursoSeleccionadoId"
          class="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition cursor-pointer"
        >
          <option value="">Selecciona un curso</option>
          <option
            v-for="curso in cursos"
            :key="curso.c_curso"
            :value="curso.c_curso"
          >
            {{ curso.l_curso }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      <!-- Search -->
      <div class="relative flex-1">
        <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
        </div>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar estudiante…"
          class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
        />
        <button
          v-if="busqueda"
          @click="busqueda = ''"
          class="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-500"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>

    </div>

    <!-- Loading state -->
    <div v-if="cargando" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-4">Cargando estudiantes...</p>
    </div>

    <!-- EMPTY: sin curso seleccionado -->
    <div
      v-else-if="!cursoSeleccionadoId"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <AcademicCapIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Elige un curso</p>
      <p class="text-gray-400 text-xs mt-1">Selecciona un curso para ver el ranking de estudiantes</p>
    </div>

    <!-- EMPTY: sin estudiantes -->
    <div
      v-else-if="estudiantesFiltrados.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <UsersIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">
        {{ busqueda ? 'Sin resultados' : 'Sin estudiantes' }}
      </p>
      <p class="text-gray-400 text-xs mt-1">
        {{ busqueda ? `No se encontró "${busqueda}"` : 'Este curso aún no tiene estudiantes registrados' }}
      </p>
    </div>

    <!-- TABLA -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Cabecera de la tabla -->
      <div
        class="grid items-center px-6 py-4 bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400"
        :style="gridCols"
      >
        <span class="text-center">#</span>
        <span>Estudiante</span>
        <span
          v-for="campo in camposActivos"
          :key="campo.key"
          class="text-center"
        >
          {{ campo.label }}
        </span>
        <span class="text-right pr-6">Promedio</span>
        <span class="text-center" v-if="esDocente">Acción</span>
      </div>

      <!-- Filas -->
      <div class="divide-y divide-gray-50">
        <div
          v-for="(est, index) in estudiantesFiltrados"
          :key="est.c_usua"
          class="grid items-center px-6 py-4 hover:bg-gray-50/50 transition-colors group"
          :style="gridCols"
        >
          <!-- Posición / ranking -->
          <div class="flex justify-center">
            <span v-if="index === 0" class="text-2xl">🥇</span>
            <span v-else-if="index === 1" class="text-2xl">🥈</span>
            <span v-else-if="index === 2" class="text-2xl">🥉</span>
            <span v-else class="text-sm font-bold text-gray-400 w-7 h-7 flex items-center justify-center">
              {{ index + 1 }}
            </span>
          </div>

          <!-- Avatar + Nombre -->
          <div class="flex items-center gap-3 min-w-0">
            <div
              :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0', avatarColor(est.nombre_completo)]"
            >
              {{ inicial(est.nombre_completo) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ est.nombre_completo }}</p>
              <p class="text-[10px] text-gray-400 truncate">{{ est.email || 'Estudiante' }}</p>
            </div>
          </div>

          <!-- Campos dinámicos de notas -->
          <div
            v-for="campo in camposActivos"
            :key="campo.key"
            class="flex justify-center"
          >
            <template v-if="editandoId === est.c_usua">
              <input
                v-model.number="editForm[campo.key]"
                type="number" min="0" max="20" step="0.5"
                class="w-16 text-center text-sm border border-emerald-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </template>
            <template v-else>
              <span :class="getNotaClase(est.notas?.[campo.key])">
                {{ formatNota(est.notas?.[campo.key]) }}
              </span>
            </template>
          </div>

          <!-- Promedio - Alineado a la derecha -->
          <div class="flex justify-end pr-6">
            <span
              v-if="editandoId === est.c_usua"
              :class="['text-sm font-bold px-3 py-1 rounded-full', promedioClase(promedioEditando)]"
            >
              {{ promedioEditando.toFixed(1) }}
            </span>
            <span
              v-else
              :class="['text-sm font-bold px-3 py-1 rounded-full', promedioClase(promedio(est))]"
            >
              {{ tieneNotas(est) ? promedio(est).toFixed(1) : '—' }}
            </span>
          </div>

          <!-- Acción (solo docente) -->
          <div v-if="esDocente" class="flex justify-center">
            <template v-if="editandoId === est.c_usua">
              <div class="flex items-center gap-2">
                <button
                  @click="confirmarGuardar(est)"
                  :disabled="guardando"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-[11px] font-semibold rounded-lg transition whitespace-nowrap"
                >
                  <ArrowPathIcon v-if="guardando" class="w-3.5 h-3.5 animate-spin" />
                  <CheckIcon v-else class="w-3.5 h-3.5" />
                  Guardar
                </button>
                <button
                  @click="cancelarEdicion"
                  class="px-3 py-1.5 text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
                >
                  Cancelar
                </button>
              </div>
            </template>
            <template v-else>
              <button
                @click="iniciarEdicion(est)"
                class="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition"
              >
                <PencilIcon class="w-3.5 h-3.5" />
                Editar
              </button>
            </template>
          </div>

        </div>
      </div>

      <!-- Footer con stats -->
      <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-[11px] text-gray-400">
          {{ estudiantesFiltrados.length }} estudiante{{ estudiantesFiltrados.length !== 1 ? 's' : '' }}
          <template v-if="busqueda"> · filtrado{{ estudiantesFiltrados.length !== 1 ? 's' : '' }}</template>
        </p>
        <div class="flex items-center gap-3">
          <span class="text-[11px] text-gray-400">Promedio del curso:</span>
          <span :class="['text-sm font-bold px-3 py-1 rounded-full', promedioClase(promedioCurso)]">
            {{ promedioCurso > 0 ? promedioCurso.toFixed(1) : '—' }}
          </span>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useAuthStore } from '#imports'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useListCursos } from '~/composable/curso/useListCursos'
import { withLoading } from '~/utils/withLoading'
import { gestionarAtributos, type NotaAlumno } from '~/services/notas/gestionarAtributos'

import {
  BookOpenIcon, ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon,
  AcademicCapIcon, UsersIcon, PencilIcon, CheckIcon, ArrowPathIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN MODULAR DE CAMPOS
// Activa o desactiva campos cambiando `activo: true/false`
// ─────────────────────────────────────────────────────────────────────────────
const CAMPOS_CONFIG = [
  { key: 'conocimiento',  label: 'Conocimiento',  activo: true  },
  { key: 'actitud',       label: 'Actitud',       activo: true  },
  { key: 'participacion', label: 'Participación', activo: true  },
  { key: 'interes',       label: 'Interés',       activo: false },
  { key: 'estrella',      label: 'Estrella',      activo: false },
] as const

type CampoKey = typeof CAMPOS_CONFIG[number]['key']

const camposActivos = computed(() => CAMPOS_CONFIG.filter(c => c.activo))

// ─────────────────────────────────────────────────────────────────────────────

const { $swal, $supabase } = useNuxtApp()
const authStore  = useAuthStore()
const aulaStore  = useAulaStore()
const cursoStore = useCursoStore()
const esDocente  = computed(() => authStore.user?.rol === 'Docente')

const { listCursos } = useListCursos()

// Estado
const cursoSeleccionadoId = ref<string>('')
const busqueda            = ref<string>('')
const editandoId          = ref<string | null>(null)
const guardando           = ref<boolean>(false)
const cargando            = ref<boolean>(false)
const estudiantes         = ref<NotaAlumno[]>([])

const editForm = reactive<Record<CampoKey, number>>({
  conocimiento:  0,
  actitud:       0,
  participacion: 0,
  interes:       0,
  estrella:      0,
})

const cursos = computed(() => cursoStore.cursos)

// Grid dinámico - Promedio más ancho y alineado a la derecha
const gridCols = computed(() => {
  const n = camposActivos.value.length
  const notasCols = `repeat(${n}, minmax(80px, 100px))`
  const accionCol = esDocente.value ? ' minmax(140px, 160px)' : ''
  return {
    gridTemplateColumns: `minmax(50px, 70px) minmax(200px, 1fr) ${notasCols} minmax(90px, 110px)${accionCol}`,
  }
})

// Funciones helper para notas
function getNotaClase(nota: number | null | undefined): string {
  const valor = nota ?? null
  if (valor === null) return 'text-sm font-bold px-3 py-1 rounded-full text-gray-300 bg-gray-50'
  if (valor >= 17) return 'text-sm font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50'
  if (valor >= 13) return 'text-sm font-bold px-3 py-1 rounded-full text-blue-700 bg-blue-50'
  if (valor >= 11) return 'text-sm font-bold px-3 py-1 rounded-full text-amber-700 bg-amber-50'
  return 'text-sm font-bold px-3 py-1 rounded-full text-red-700 bg-red-50'
}

function formatNota(nota: number | null | undefined): string {
  const valor = nota ?? null
  return valor !== null ? valor.toFixed(1) : '—'
}

// Computed
const estudiantesOrdenados = computed(() => {
  return [...estudiantes.value].sort((a, b) => {
    const pa = promedio(a)
    const pb = promedio(b)
    if (!tieneNotas(a) && !tieneNotas(b)) return 0
    if (!tieneNotas(a)) return 1
    if (!tieneNotas(b)) return -1
    return pb - pa
  })
})

const estudiantesFiltrados = computed(() => {
  if (!cursoSeleccionadoId.value) return []
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return estudiantesOrdenados.value
  return estudiantesOrdenados.value.filter(e =>
    e.nombre_completo.toLowerCase().includes(q) ||
    (e.email ?? '').toLowerCase().includes(q)
  )
})

const promedioCurso = computed(() => {
  const con = estudiantesFiltrados.value.filter(e => tieneNotas(e))
  if (con.length === 0) return 0
  return con.reduce((acc, e) => acc + promedio(e), 0) / con.length
})

const promedioEditando = computed(() => {
  const vals = camposActivos.value
    .map(c => editForm[c.key])
    .filter(v => v > 0)
  if (vals.length === 0) return 0
  return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
})

// Helpers
function promedio(est: NotaAlumno): number {
  const n = est.notas
  if (!n) return 0
  const valores = camposActivos.value
    .map(c => n[c.key] as number | null | undefined)
    .filter((v): v is number => v != null && v > 0)
  if (valores.length === 0) return 0
  return Number((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1))
}

function tieneNotas(est: NotaAlumno): boolean {
  const n = est.notas
  if (!n) return false
  return camposActivos.value.some(c => {
    const v = n[c.key] as number | null | undefined
    return v != null && v > 0
  })
}

function promedioClase(p: number): string {
  if (p === 0)  return 'text-xs font-bold px-2.5 py-0.5 rounded-full text-gray-300 bg-gray-50'
  if (p >= 17)  return 'text-xs font-bold px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50'
  if (p >= 14)  return 'text-xs font-bold px-2.5 py-0.5 rounded-full text-blue-700 bg-blue-50'
  if (p >= 11)  return 'text-xs font-bold px-2.5 py-0.5 rounded-full text-amber-700 bg-amber-50'
  return 'text-xs font-bold px-2.5 py-0.5 rounded-full text-red-700 bg-red-50'
}

function inicial(nombre: string): string {
  return nombre?.charAt(0).toUpperCase() ?? '?'
}

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-violet-500',
  'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-teal-500',
]

function avatarColor(nombre: string): string {
  const i = (nombre?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[i] ?? 'bg-gray-500'
}

// Cargar estudiantes
async function cargarEstudiantes() {
  if (!cursoSeleccionadoId.value) return
  cargando.value = true
  try {
    const resultado = await gestionarAtributos($supabase, {
      accion: 'obtener',
      p_c_curso: cursoSeleccionadoId.value
    })
    if (resultado.ok && resultado.data) {
      estudiantes.value = resultado.data
    } else {
      estudiantes.value = []
      if (resultado.mensaje) throw new Error(resultado.mensaje)
    }
  } catch (error: any) {
    console.error('Error cargando estudiantes:', error)
    await $swal.fire({ title: 'Error', text: error.message || 'No se pudieron cargar los estudiantes', icon: 'error' })
    estudiantes.value = []
  } finally {
    cargando.value = false
  }
}

// Edición
function iniciarEdicion(est: NotaAlumno) {
  editandoId.value = est.c_usua
  for (const campo of CAMPOS_CONFIG) {
    editForm[campo.key] = (est.notas?.[campo.key] as number) ?? 0
  }
}

function cancelarEdicion() {
  editandoId.value = null
  for (const campo of CAMPOS_CONFIG) editForm[campo.key] = 0
}

async function confirmarGuardar(est: NotaAlumno) {
  const result = await $swal.fire({
    title: '¿Guardar cambios?',
    text: `¿Estás seguro de guardar las notas de ${est.nombre_completo}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  })
  if (result.isConfirmed) await guardarNotas(est)
}

async function guardarNotas(est: NotaAlumno) {
  guardando.value = true
  try {
    const resultado = await gestionarAtributos($supabase, {
      accion: 'editar',
      p_c_curso: cursoSeleccionadoId.value,
      p_c_usua: est.c_usua,
      p_n_con:  editForm.conocimiento,
      p_n_act:  editForm.actitud,
      p_n_par:  editForm.participacion,
      p_n_int:  editForm.interes,
      p_n_star: editForm.estrella
    })
    if (resultado.ok) {
      await cargarEstudiantes()
      editandoId.value = null
      await $swal.fire({ title: '¡Guardado!', text: 'Las notas se han guardado correctamente', icon: 'success', timer: 1500, showConfirmButton: false })
    } else {
      throw new Error(resultado.mensaje || 'Error al guardar')
    }
  } catch (error: any) {
    await $swal.fire({ title: 'Error', text: error.message || 'No se pudieron guardar las notas', icon: 'error' })
  } finally {
    guardando.value = false
  }
}

// Watchers
watch(cursoSeleccionadoId, async () => {
  busqueda.value = ''
  editandoId.value = null
  await cargarEstudiantes()
})

// Lifecycle
// onMounted(async () => {
//   try {
//     await withLoading(() => listCursos())
//     if (cursos.value.length > 0) {
//       cursoSeleccionadoId.value = cursos.value[0].c_curso
//     }
//   } catch (e) { 
//     console.error(e) 
//   }
// })
</script>