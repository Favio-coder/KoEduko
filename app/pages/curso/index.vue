<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-800">Sesiones</h1>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ aulaStore.contextoActual || 'Selecciona un aula en Principal' }}
        </p>
      </div>
      <button
        @click="showModalCurso = true"
        class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 active:scale-95"
      >
        <PlusIcon class="w-4 h-4" />
        Crear curso
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="cursos.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <BookOpenIcon class="w-8 h-8 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Aún no tienes cursos</p>
      <p class="text-gray-400 text-xs mt-1 mb-5">Crea tu primer curso para comenzar a agregar sesiones</p>
      <button
        @click="showModalCurso = true"
        class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition"
      >
        <PlusIcon class="w-4 h-4" />
        Crear primer curso
      </button>
    </div>

    <!-- LISTA DE CURSOS -->
    <div v-else class="space-y-4">
      <div
        v-for="curso in cursos"
        :key="curso.c_curso"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <!-- Cabecera del curso -->
        <div
          :class="['flex items-center justify-between px-5 py-4 border-b border-gray-100 cursor-pointer select-none', colorFondo(curso.l_color)]"
          @click="toggleCurso(curso.c_curso)"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-3 h-3 rounded-full shrink-0', colorDot(curso.l_color)]" />
            <div>
              <p class="text-sm font-bold text-gray-800">{{ curso.l_curso }}</p>
              <p v-if="curso.l_desc" class="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                {{ curso.l_desc }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- ✅ sesiones protegida con ?? [] -->
            <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full', colorBadge(curso.l_color)]">
              {{ (curso.sesiones ?? []).length }} sesión{{ (curso.sesiones ?? []).length !== 1 ? 'es' : '' }}
            </span>
            <ChevronDownIcon
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', cursosAbiertos.has(curso.c_curso) ? 'rotate-180' : '']"
            />
          </div>
        </div>

        <!-- Cuerpo expandible -->
        <div v-if="cursosAbiertos.has(curso.c_curso)">

          <!-- ✅ sesiones protegida con ?? [] -->
          <div v-if="(curso.sesiones ?? []).length === 0" class="flex flex-col items-center py-10 text-center">
            <CalendarDaysIcon class="w-8 h-8 text-gray-200 mb-2" />
            <p class="text-xs text-gray-400">Este curso aún no tiene sesiones</p>
          </div>

          <!-- ✅ sesiones protegida con ?? [] -->
          <div v-else class="divide-y divide-gray-50">
            <div
              v-for="sesion in (curso.sesiones ?? [])"
              :key="sesion.id"
              class="px-5 py-4 hover:bg-gray-50/60 transition-colors group"
            >
              <div class="flex items-start gap-4">

                <!-- Fecha pill -->
                <div :class="['flex flex-col items-center justify-center w-10 shrink-0 rounded-xl py-1.5', colorFondo(curso.l_color)]">
                  <span :class="['text-[10px] font-bold uppercase', colorText(curso.l_color)]">
                    {{ mesCorto(sesion.fecha) }}
                  </span>
                  <span :class="['text-base font-black leading-tight', colorText(curso.l_color)]">
                    {{ dia(sesion.fecha) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-semibold text-gray-800">{{ sesion.titulo }}</p>
                    <span v-if="sesion.hora" class="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      <ClockIcon class="w-3 h-3" />
                      {{ sesion.hora }}
                    </span>
                    <a
                      v-if="sesion.linkReunion"
                      :href="sesion.linkReunion"
                      target="_blank"
                      :class="['flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition hover:opacity-80', colorBadge(curso.l_color)]"
                      @click.stop
                    >
                      <VideoCameraIcon class="w-3 h-3" />
                      {{ plataforma(sesion.linkReunion || '') }}
                    </a>
                  </div>
                  <p v-if="sesion.descripcion" class="text-xs text-gray-400 mt-0.5 truncate">
                    {{ sesion.descripcion }}
                  </p>
                  <div v-if="sesion.materiales" class="flex items-start gap-1.5 mt-1.5">
                    <ClipboardDocumentListIcon class="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                    <p class="text-xs text-gray-400 line-clamp-2">{{ sesion.materiales }}</p>
                  </div>
                </div>

                <!-- Eliminar (hover) -->
                <button
                  @click="eliminarSesion(curso.c_curso, sesion.id)"
                  class="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all shrink-0"
                >
                  <TrashIcon class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Footer del curso -->
          <div class="flex items-center justify-between px-5 py-3 bg-gray-50/50 border-t border-gray-100">
            <div class="flex items-center gap-1.5">
              <button
                @click="abrirModalEditar(curso)"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-500 transition"
              >
                <PencilIcon class="w-3.5 h-3.5" />
                Editar curso
              </button>
              <button
                @click="eliminarCurso(curso.c_curso)"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition"
              >
                <TrashIcon class="w-3.5 h-3.5" />
                Eliminar curso
              </button>
            </div>
            <button
              @click="abrirModalSesion(curso)"
              :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition', colorBotonSesion(curso.l_color)]"
            >
              <PlusIcon class="w-3.5 h-3.5" />
              Agregar sesión
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- MODALES -->
    <CursoModalCrearCurso
      v-model="showModalCurso"
      :curso="cursoEditando"
      @created="onCursoCreado"
      @updated="onCursoActualizado"
    />
    <SesionModalCrearSesion
      v-model="showModalSesion"
      :curso="cursoSeleccionado"
      @created="onSesionCreada"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import type { Sesion } from '~/types/sesion'
import type { Curso } from '~/types/curso'
import {
  PlusIcon, BookOpenIcon, CalendarDaysIcon, ChevronDownIcon,
  ClockIcon, TrashIcon, VideoCameraIcon, ClipboardDocumentListIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import { useListCursos } from '~/composable/curso/useListCursos'
import { useElimCurso } from '~/composable/curso/useElimCurso'

import { withLoading } from '~/utils/withLoading'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const {$swal} = useNuxtApp()


const aulaStore         = useAulaStore()
const cursoStore        = useCursoStore()
const { listCursos }    = useListCursos()
const { elimCurso } = useElimCurso()

// computed de solo lectura para la template; las mutaciones van por acciones del store
const cursos            = computed(() => cursoStore.cursos)

const cursosAbiertos    = ref<Set<string>>(new Set())
const showModalCurso    = ref(false)
const showModalSesion   = ref(false)
const cursoSeleccionado = ref<Curso | null>(null)
const cursoEditando     = ref<Curso | null>(null)

// ── Modales ──────────────────────────────────────────────────────────────────

function abrirModalSesion(curso: Curso) {
  cursoSeleccionado.value = curso
  showModalSesion.value   = true
}

function abrirModalEditar(curso: Curso) {
  cursoEditando.value  = curso
  showModalCurso.value = true
}

function toggleCurso(id: string) {
  cursosAbiertos.value.has(id)
    ? cursosAbiertos.value.delete(id)
    : cursosAbiertos.value.add(id)
}

// ── Eventos de modales ────────────────────────────────────────────────────────

function onCursoCreado(curso: Curso) {
  // usar acción del store en lugar de mutar el computed
  //cursoStore.addCurso(curso)
  //cursosAbiertos.value.add(curso.c_curso)
}

function onSesionCreada(sesion: Sesion) {
  const curso = cursoStore.cursos.find(c => c.c_curso === cursoSeleccionado.value?.c_curso)
  if (curso) curso.sesiones.push(sesion)
}

function onCursoActualizado(cursoActualizado: Curso) {
  // usar acción del store
  cursoStore.updateCurso(cursoActualizado.c_curso, cursoActualizado)
}

function eliminarSesion(cursoId: string, sesionId: string) {
  // mutar directamente en el store (Pinia lo permite)
  const curso = cursoStore.cursos.find(c => c.c_curso === cursoId)
  if (curso) curso.sesiones = curso.sesiones.filter(s => s.id !== sesionId)
}

async function eliminarCurso(cursoId: string) {

  const confirmacion = await $swal.fire({
    title: '¿Eliminar curso?',
    text: 'Esta acción eliminará el curso y no se podrá recuperar.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (!confirmacion.isConfirmed) return

  try {

    await withLoading(() =>
      elimCurso(cursoId)
    )

    cursosAbiertos.value.delete(cursoId)

    await $swal.fire({
      title: 'Curso eliminado',
      text: 'El curso fue eliminado correctamente.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })

  } catch (error: any) {

    console.error("No se eliminó el curso:", error)

    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo eliminar el curso',
      icon: 'error'
    })

  }
}

// ── Watch ─────────────────────────────────────────────────────────────────────

watch(showModalCurso, (val) => {
  if (!val) cursoEditando.value = null
})

// ── Montado ───────────────────────────────────────────────────────────────────

// onMounted debe ser async para poder usar await dentro
onMounted(async () => {
  if (cursoStore.cursos.length === 0) {
    try {
      await withLoading(() => listCursos())
    } catch (error) {
      console.error('Error al cargar cursos:', error)
    }
  }
})

// ── Helpers de fecha ──────────────────────────────────────────────────────────

function mesCorto(fecha: string) {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es', { month: 'short' })
}
function dia(fecha: string) {
  return new Date(fecha + 'T00:00:00').getDate().toString()
}
function plataforma(url: string): string {
  const u = url.toLowerCase()
  if (u.includes('meet.google'))                              return 'Google Meet'
  if (u.includes('zoom.us'))                                  return 'Zoom'
  if (u.includes('teams.microsoft') || u.includes('teams.live')) return 'Teams'
  return 'Reunión'
}

// ── Colores ───────────────────────────────────────────────────────────────────

const fondos:  Record<string, string> = { emerald: 'bg-emerald-50', blue: 'bg-blue-50', violet: 'bg-violet-50', rose: 'bg-rose-50', amber: 'bg-amber-50', cyan: 'bg-cyan-50', slate: 'bg-slate-50' }
const dots:    Record<string, string> = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', violet: 'bg-violet-500', rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500', slate: 'bg-slate-500' }
const texts:   Record<string, string> = { emerald: 'text-emerald-600', blue: 'text-blue-600', violet: 'text-violet-600', rose: 'text-rose-600', amber: 'text-amber-600', cyan: 'text-cyan-600', slate: 'text-slate-600' }
const badges:  Record<string, string> = { emerald: 'bg-emerald-100 text-emerald-700', blue: 'bg-blue-100 text-blue-700', violet: 'bg-violet-100 text-violet-700', rose: 'bg-rose-100 text-rose-700', amber: 'bg-amber-100 text-amber-700', cyan: 'bg-cyan-100 text-cyan-700', slate: 'bg-slate-100 text-slate-700' }
const botones: Record<string, string> = { emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200', blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200', violet: 'bg-violet-100 text-violet-700 hover:bg-violet-200', rose: 'bg-rose-100 text-rose-700 hover:bg-rose-200', amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200', cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200', slate: 'bg-slate-100 text-slate-700 hover:bg-slate-200' }

const colorFondo       = (c: string) => fondos[c]  ?? fondos.emerald
const colorDot         = (c: string) => dots[c]    ?? dots.emerald
const colorText        = (c: string) => texts[c]   ?? texts.emerald
const colorBadge       = (c: string) => badges[c]  ?? badges.emerald
const colorBotonSesion = (c: string) => botones[c] ?? botones.emerald
</script>