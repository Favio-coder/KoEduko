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
        v-if="esDocente"
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
      <div v-if="esDocente" class="flex flex-col items-center text-center">
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
      <div v-else class="flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <BookOpenIcon class="w-8 h-8 text-emerald-300" />
        </div>
        <p class="text-gray-600 font-semibold text-sm">Aún no tienes cursos</p>
        <p class="text-gray-400 text-xs mt-1">Espera que el docente cree el primer curso</p>
      </div>
    </div>

    <!-- LISTA DE CURSOS -->
    <div v-else class="space-y-3">
      <div
        v-for="curso in cursos"
        :key="curso.c_curso"
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
      >
        <!-- Cabecera del curso (toggle) -->
        <div
          :class="['flex items-center justify-between px-5 py-4 cursor-pointer select-none transition-colors hover:brightness-95', colorFondo(curso.l_color)]"
          @click="toggleCurso(curso.c_curso)"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-2.5 h-2.5 rounded-full shrink-0', colorDot(curso.l_color)]" />
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ curso.l_curso }}</p>
              <p v-if="curso.l_desc" class="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{{ curso.l_desc }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['text-[10px] font-semibold px-2.5 py-1 rounded-full', colorBadge(curso.l_color)]">
              {{ (curso.sesiones ?? []).length }} sesión{{ (curso.sesiones ?? []).length !== 1 ? 'es' : '' }}
            </span>
            <ChevronDownIcon
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', cursosAbiertos.has(curso.c_curso) ? 'rotate-180' : '']"
            />
          </div>
        </div>

        <!-- Cuerpo expandible -->
        <div v-if="cursosAbiertos.has(curso.c_curso)">

          <!-- Cargando -->
          <div v-if="cargandoSesiones.has(curso.c_curso)" class="flex items-center justify-center py-10 gap-2 text-emerald-600">
            <ArrowPathIcon class="w-4 h-4 animate-spin" />
            <span class="text-xs">Cargando sesiones...</span>
          </div>

          <!-- Sin sesiones -->
          <div v-else-if="(curso.sesiones ?? []).length === 0" class="flex flex-col items-center py-10 text-center">
            <CalendarDaysIcon class="w-8 h-8 text-gray-200 mb-2" />
            <p class="text-xs text-gray-400">Este curso aún no tiene sesiones</p>
          </div>

          <!-- Lista de sesiones -->
          <div v-else class="divide-y divide-gray-50">
            <div
              v-for="sesion in (curso.sesiones ?? [])"
              :key="sesion.c_sesion"
              class="group"
            >
              <!-- Fila principal de la sesión -->
              <div class="flex items-start gap-4 px-5 py-4">

                <!-- Fecha pill -->
                <div :class="['flex flex-col items-center justify-center w-10 shrink-0 rounded-xl py-2', colorFondo(curso.l_color)]">
                  <span :class="['text-[9px] font-semibold uppercase tracking-wide', colorText(curso.l_color)]">
                    {{ mesCorto(sesion.f_sesion) }}
                  </span>
                  <span :class="['text-lg font-bold leading-tight', colorText(curso.l_color)]">
                    {{ dia(sesion.f_sesion) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800">{{ sesion.l_sesion }}</p>
                  <p v-if="sesion.l_desc" class="text-xs text-gray-400 mt-0.5 truncate">{{ sesion.l_desc }}</p>
                  <div class="flex items-center gap-2 mt-2 flex-wrap">
                    <span v-if="sesion.f_hora" class="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      <ClockIcon class="w-3 h-3" />
                      {{ sesion.f_hora }}
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
                </div>

                <!-- Eliminar (hover, solo docente) -->
                 <button
                  v-if="esDocente"
                  @click.stop="sesion && editarSesion(sesion)"
                  class="relative z-10 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-emerald-50 text-emerald-500 hover:text-emerald-400 transition-all shrink-0 text-xs"
                >
                  <PencilIcon class="w-3.5 h-3.5" />
                  Editar
                </button>

                <button
                  v-if="esDocente"
                  @click.stop="sesion.c_sesion && eliminarSesion(sesion.c_sesion)"
                  class="relative z-10 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-400 transition-all shrink-0 text-xs"
                >
                  <TrashIcon class="w-3.5 h-3.5" />
                  Eliminar
                </button>

       
              </div>

              <!-- Tabs por sesión -->
              <div :class="['flex border-t border-gray-50', colorFondoSuave(curso.l_color)]">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="setTab(sesion.c_sesion!, tab.key)"
                  :class="[
                    'flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium border-b-2 transition-all',
                    tabActiva(sesion.c_sesion!) === tab.key
                      ? [colorTabActiva(curso.l_color), colorBorderTab(curso.l_color)]
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  ]"
                >
                  <component :is="tab.icon" class="w-3.5 h-3.5" />
                  {{ tab.label }}
                  <span
                    v-if="tab.key === 'archivos' && (sesion.archivos ?? []).length > 0"
                    :class="['text-[9px] font-semibold px-1.5 py-0.5 rounded-full', colorBadge(curso.l_color)]"
                  >
                    {{ (sesion.archivos ?? []).length }}
                  </span>
                </button>
              </div>

              <!-- Tab: Datos generales -->
              <div v-if="tabActiva(sesion.c_sesion!) === 'datos'" class="px-5 py-4 bg-gray-50/40">
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="bg-white rounded-xl p-3 border border-gray-100">
                    <p class="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
                      <CalendarDaysIcon class="w-3 h-3" /> Fecha
                    </p>
                    <p class="text-xs font-semibold text-gray-700">{{ fechaLarga(sesion.f_sesion) }}</p>
                  </div>
                  <div class="bg-white rounded-xl p-3 border border-gray-100">
                    <p class="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
                      <ClockIcon class="w-3 h-3" /> Hora
                    </p>
                    <p class="text-xs font-semibold text-gray-700">{{ sesion.f_hora || '-- : --' }}</p>
                  </div>
                  <div v-if="sesion.linkReunion" class="col-span-2 bg-white rounded-xl p-3 border border-gray-100">
                    <p class="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
                      <LinkIcon class="w-3 h-3" /> Enlace de reunión
                    </p>
                    <a :href="sesion.linkReunion" target="_blank" class="text-xs font-medium text-emerald-500 hover:underline truncate block">
                      {{ sesion.linkReunion }}
                    </a>
                  </div>
                </div>
                <!-- <div class="bg-white rounded-xl p-3 border border-gray-100">
                  <p class="text-[10px] text-gray-400 flex items-center gap-1 mb-1.5">
                    <ClipboardDocumentListIcon class="w-3 h-3" /> Notas
                  </p>

                </div> -->
              </div>

              <!-- Tab: Archivos -->
              <div v-if="tabActiva(sesion.c_sesion!) === 'archivos'" class="px-5 py-4 bg-gray-50/40">
                <div v-if="(sesion.archivos ?? []).length === 0" class="flex flex-col items-center py-6 text-center">
                  <PaperClipIcon class="w-7 h-7 text-gray-200 mb-2" />
                  <p class="text-xs text-gray-400">No hay archivos adjuntos</p>
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="archivo in sesion.archivos"
                    :key="archivo.c_archivo"
                    class="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconoBg(archivo.tipo)]">
                      <component :is="iconoArchivo(archivo.tipo)" :class="['w-5 h-5', iconoColor(archivo.tipo)]" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold text-gray-800 truncate">{{ archivo.l_nombre }}</p>
                      <p class="text-[10px] text-gray-400 mt-0.5">
                        {{ archivo.tamano }} · <span class="uppercase">{{ archivo.tipo }}</span>
                      </p>
                    </div>
                    <button
                      v-if="esDocente"
                      @click="eliminarArchivo(archivo, sesion)"
                      class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      <TrashIcon class="w-3.5 h-3.5" /> Eliminar
                    </button>
                    <button
                      @click="descargarArchivo(archivo)"
                      :disabled="descargandoArchivos.has(archivo.c_archivo!)"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all shrink-0 disabled:opacity-60 disabled:cursor-not-allowed text-gray-500 bg-gray-50 border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                    >
                      <ArrowPathIcon
                        v-if="descargandoArchivos.has(archivo.c_archivo!)"
                        class="w-3.5 h-3.5 animate-spin"
                      />

                      <ClipboardDocumentListIcon
                        v-else
                        class="w-3.5 h-3.5"
                      />

                      {{
                        descargandoArchivos.has(archivo.c_archivo!)
                          ? 'Descargando...'
                          : 'Descargar'
                      }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Footer del curso -->
          <div class="flex items-center justify-between px-5 py-3 bg-gray-50/50 border-t border-gray-100">
            <div v-if="esDocente" class="flex items-center gap-1">
              <button
                @click="abrirModalEditar(curso)"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-500 transition px-2 py-1.5 rounded-lg hover:bg-emerald-50"
              >
                <PencilIcon class="w-3.5 h-3.5" /> Editar curso
              </button>
              <button
                @click="eliminarCurso(curso.c_curso)"
                class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-50"
              >
                <TrashIcon class="w-3.5 h-3.5" /> Eliminar
              </button>
            </div>
            <div v-else />
            <button
              v-if="esDocente"
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

    <!-- ══════════════════════════════════════════════════
         MODAL: VISTA PREVIA DE ARCHIVO
    ══════════════════════════════════════════════════ -->
    
    <!-- <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModalArchivo && archivoSeleccionado"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showModalArchivo = false"
          
        >
          <div
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden transition-all duration-200"
            style="max-height: 90vh"
          >

        
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div class="flex items-center gap-2.5 min-w-0">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconoBg(archivoSeleccionado.tipo)]">
                  <component :is="iconoArchivo(archivoSeleccionado.tipo)" :class="['w-4 h-4', iconoColor(archivoSeleccionado.tipo)]" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate leading-tight">
                    {{ archivoSeleccionado.l_nombre || 'Archivo' }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    <span v-if="archivoSeleccionado.tamano">{{ archivoSeleccionado.tamano }} · </span>
                    <span class="uppercase font-medium">{{ archivoSeleccionado.tipo }}</span>
                  </p>
                </div>
              </div>
              <button
                @click="showModalArchivo = false"
                class="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition shrink-0 ml-3"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>

          

             <div class="relative bg-gray-50 border-b border-gray-100 shrink-0" style="height: 380px">

           
              <iframe
                v-if="esPDF(archivoSeleccionado.tipo)"
                :src="previewUrl"
                class="w-full h-full border-0"
                title="Vista previa PDF"
                @load="previewCargado = true"
              />

      
              <iframe
                v-else-if="esOffice(archivoSeleccionado.tipo)"
                :src="`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`"
                class="w-full h-full border-0"
                title="Vista previa documento"
                @load="previewCargado = true"
              />

              <div
                v-else-if="esImagen(archivoSeleccionado.tipo)"
                class="w-full h-full flex items-center justify-center p-6 bg-gray-50"
              >
                <img
                  :src="previewUrl"
                  :alt="archivoSeleccionado.l_nombre"
                  class="max-w-full max-h-full object-contain rounded-xl shadow-sm"
                  @load="previewCargado = true"
                />
              </div>

          
              <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
                <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center', iconoBg(archivoSeleccionado.tipo)]">
                  <component :is="iconoArchivo(archivoSeleccionado.tipo)" :class="['w-9 h-9', iconoColor(archivoSeleccionado.tipo)]" />
                </div>
                <p class="text-xs text-gray-400 text-center px-8">Vista previa no disponible para este tipo de archivo</p>
              </div>

            
              <Transition
                enter-active-class="transition-opacity duration-300"
                leave-active-class="transition-opacity duration-300"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="!previewCargado && (esPDF(archivoSeleccionado.tipo) || esOffice(archivoSeleccionado.tipo) || esImagen(archivoSeleccionado.tipo))"
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50"
                >
                  <ArrowPathIcon class="w-6 h-6 text-gray-300 animate-spin" />
                  <p class="text-xs text-gray-400">Cargando vista previa...</p>
                </div>
              </Transition>
            </div> 
         
            <div class="px-5 py-4 shrink-0">
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="bg-gray-50 rounded-xl p-2.5">
                  <p class="text-[10px] text-gray-400 mb-0.5">Tipo</p>
                  <p class="text-xs font-semibold text-gray-700 uppercase">{{ archivoSeleccionado.tipo || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-2.5">
                  <p class="text-[10px] text-gray-400 mb-0.5">Tamaño</p>
                  <p class="text-xs font-semibold text-gray-700">{{ archivoSeleccionado.tamano || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-2.5">
                  <p class="text-[10px] text-gray-400 mb-0.5">Estado</p>
                  <p class="text-xs font-semibold text-emerald-500">Disponible</p>
                </div>
              </div>

              <button
                @click="descargarArchivo(archivoSeleccionado)"
                :disabled="descargando"
                class="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition active:scale-95"
              >
                <ArrowPathIcon v-if="descargando" class="w-4 h-4 animate-spin" />
                <ArrowDownTrayIcon v-else class="w-4 h-4" />
                {{ descargando ? 'Descargando...' : 'Descargar archivo' }}
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport> -->

    <!-- Modales de curso y sesión -->
    <CursoModalCrearCurso
      v-model="showModalCurso"
      :curso="cursoEditando"
      @created="onCursoCreado"
      @updated="onCursoActualizado"
    />
    <SesionModalCrearSesion
      v-model="showModalSesion"
      :curso="cursoSeleccionado"
      :sesion="sesionEditando"
      @created="onSesionCreada"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '#imports'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useSesionStore } from '#imports'
import type { Sesion } from '~/types/sesion'
import type { Curso } from '~/types/curso'

import {
  PlusIcon, BookOpenIcon, CalendarDaysIcon, ChevronDownIcon,
  ClockIcon, TrashIcon, VideoCameraIcon, ClipboardDocumentListIcon,
  PencilIcon, XMarkIcon, EyeIcon, ArrowDownTrayIcon, PaperClipIcon,
  InformationCircleIcon, LinkIcon, ArrowPathIcon,
  DocumentTextIcon, PhotoIcon, DocumentIcon, TableCellsIcon,
  ArchiveBoxIcon, PresentationChartBarIcon,
} from '@heroicons/vue/24/outline'

import { useListCursos } from '~/composable/curso/useListCursos'
import { useElimCurso } from '~/composable/curso/useElimCurso'
import { useListSesion } from '~/composable/sesion/useListSesion'
import { withLoading } from '~/utils/withLoading'
import { useElimSesion } from '~/composable/sesion/useElimSesion'
import { useElimArchivo } from '~/composable/archivo/useElimArchivo'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { $swal } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()
const cursoStore = useCursoStore()
const sesionStore = useSesionStore()
const esDocente = computed(() => authStore.user?.rol === 'Docente')

const { listCursos } = useListCursos()
const { elimCurso } = useElimCurso()
const { listSesion } = useListSesion()
const { elimSesion} = useElimSesion()
const {elimArchivo} = useElimArchivo()
// ── Estado ────────────────────────────────────────────────────────────────────

const cursos = computed(() => cursoStore.cursos)
const cursosAbiertos = ref<Set<string>>(new Set())
const sesionesCargadas = ref<Set<string>>(new Set())
const cargandoSesiones = ref<Set<string>>(new Set())

const showModalCurso = ref(false)
const showModalSesion = ref(false)
const cursoSeleccionado = ref<Curso | null>(null)
const cursoEditando = ref<Curso | null>(null)
const sesionEditando = ref<Sesion | null>(null)


// Tabs: mapa sesionId → tab activa
const tabsActivas = ref<Map<string, 'datos' | 'archivos'>>(new Map())

// Modal archivo
const showModalArchivo = ref(false)
const archivoSeleccionado = ref<any>(null)
const previewCargado = ref(false)

//ELiminar si no se usa
const descargandoArchivos = ref<Set<string>>(new Set())
const previewUrl = ref('')
const descargando = ref(false)


type TabKey = 'datos' | 'archivos'

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'datos',    label: 'Datos generales', icon: InformationCircleIcon },
  { key: 'archivos', label: 'Archivos',         icon: PaperClipIcon },
]

// ── Tabs ──────────────────────────────────────────────────────────────────────

function tabActiva(sesionId: string): TabKey {
  return tabsActivas.value.get(sesionId) ?? 'datos'
}

function setTab(sesionId: string, tab: TabKey) {
  tabsActivas.value = new Map(tabsActivas.value).set(sesionId, tab)
}

// ── Modal archivo ─────────────────────────────────────────────────────────────

function abrirModalArchivo(archivo: any) {
  archivoSeleccionado.value = archivo
  previewCargado.value = false
  showModalArchivo.value = true
}

// ── Detección de tipo ─────────────────────────────────────────────────────────

function esPDF(tipo: string) {
  return tipo?.toLowerCase() === 'pdf'
}

function esOffice(tipo: string) {
  return ['doc', 'docx', 'word', 'ppt', 'pptx', 'xls', 'xlsx', 'excel'].includes(tipo?.toLowerCase())
}

function esImagen(tipo: string) {
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'imagen'].includes(tipo?.toLowerCase())
}

// ── Descarga forzada (evita que el navegador solo abra el archivo) ─────────────

async function descargarArchivo(archivo: any) {

    const { $supabase } = useNuxtApp()

    if (!archivo?.l_url || !archivo?.c_archivo) return

    try {

        // bloquear botón
        descargandoArchivos.value.add(archivo.c_archivo)

        // Extraer path real
        const path = archivo.l_url.split('/public/sesiones/')[1]

        const { data, error } = await $supabase.storage
            .from('sesiones')
            .createSignedUrl(path, 60)

        if (error) {
            console.error(error)
            return
        }

        window.open(data.signedUrl, '_blank')

    } finally {

        // desbloquear botón
        descargandoArchivos.value.delete(archivo.c_archivo)
    }
}

// ── Íconos por tipo ───────────────────────────────────────────────────────────

function iconoArchivo(tipo: string) {
  const t = tipo?.toLowerCase()
  if (t === 'pdf') return DocumentIcon
  if (['doc', 'docx', 'word'].includes(t)) return DocumentTextIcon
  if (['xls', 'xlsx', 'csv', 'excel'].includes(t)) return TableCellsIcon
  if (['ppt', 'pptx'].includes(t)) return PresentationChartBarIcon
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'imagen'].includes(t)) return PhotoIcon
  if (['zip', 'rar', '7z'].includes(t)) return ArchiveBoxIcon
  return DocumentIcon
}

function iconoBg(tipo: string) {
  const t = tipo?.toLowerCase()
  if (t === 'pdf')                                     return 'bg-violet-100'
  if (['doc', 'docx', 'word'].includes(t))             return 'bg-blue-100'
  if (['xls', 'xlsx', 'csv', 'excel'].includes(t))     return 'bg-emerald-100'
  if (['ppt', 'pptx'].includes(t))                     return 'bg-orange-100'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'imagen'].includes(t)) return 'bg-green-100'
  return 'bg-gray-100'
}

function iconoColor(tipo: string) {
  const t = tipo?.toLowerCase()
  if (t === 'pdf')                                     return 'text-violet-600'
  if (['doc', 'docx', 'word'].includes(t))             return 'text-blue-600'
  if (['xls', 'xlsx', 'csv', 'excel'].includes(t))     return 'text-emerald-600'
  if (['ppt', 'pptx'].includes(t))                     return 'text-orange-500'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'imagen'].includes(t)) return 'text-green-600'
  return 'text-gray-500'
}

// ── Modales curso/sesión ──────────────────────────────────────────────────────

function abrirModalSesion(curso: Curso) {
  cursoSeleccionado.value = curso
  showModalSesion.value = true
}

function abrirModalEditar(curso: Curso) {
  cursoEditando.value = curso
  showModalCurso.value = true
}

function editarSesion(sesion: Sesion){
  sesionEditando.value = sesion
  showModalSesion.value = true  
}

// ── Toggle curso con lazy-load de sesiones ────────────────────────────────────

async function toggleCurso(id: string) {
  if (cursosAbiertos.value.has(id)) {
    cursosAbiertos.value.delete(id)
  } else {
    cursosAbiertos.value.add(id)
    if (!sesionesCargadas.value.has(id)) {
      await cargarSesionesCurso(id)
    }
  }
}

async function cargarSesionesCurso(cursoId: string) {

  if (cargandoSesiones.value.has(cursoId)) return

  try {

    cargandoSesiones.value.add(cursoId)

    const curso = cursoStore.cursos.find(
      c => c.c_curso === cursoId
    )

    if (!curso) return


    const sesiones = await listSesion(cursoId)

    curso.sesiones = sesiones

    sesionesCargadas.value.add(cursoId)

  } catch (error: any) {

    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudieron cargar las sesiones',
      icon: 'error',
      timer: 2000
    })

  } finally {

    cargandoSesiones.value.delete(cursoId)
  }
}

// ── Eventos de modales ────────────────────────────────────────────────────────

function onCursoCreado(_curso: Curso) {}

function onSesionCreada(sesion: Sesion) {

  if (!cursoSeleccionado.value) return

  // buscar el curso actual
  const curso = cursos.value.find(
    c => c.c_curso === cursoSeleccionado.value?.c_curso
  )

  if (!curso) return

  // si no existe el array
  if (!curso.sesiones) {
    curso.sesiones = []
  }

  // agregar nueva sesión al inicio
  curso.sesiones.unshift(sesion)

  // marcar como cargado
  sesionesCargadas.value.add(curso.c_curso)
}

function onCursoActualizado(cursoActualizado: Curso) {
  cursoStore.updateCurso(cursoActualizado.c_curso, cursoActualizado)
}

async function eliminarSesion(sesionId: string) {

  const r = await $swal.fire({
    title: '¿Eliminar sesión?',
    text: 'Esta acción no se podrá revertir.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (!r.isConfirmed) return

  const { $supabase } = useNuxtApp()

  const sesion = sesionStore.sesiones.find(
    c => c.c_sesion === sesionId
  )

  if (!sesion) return

  try {

    const archivos = sesion.archivos ?? []

    if (archivos.length > 0) {

      const paths = archivos
        .map((archivo: any) => {

          if (!archivo?.l_url) return null

          // obtener path real del bucket
          return archivo.l_url
            .split('/public/sesiones/')[1]

        })
        .filter(Boolean)

      if (paths.length > 0) {

        const { error: storageError } = await $supabase.storage
          .from('sesiones')
          .remove(paths)

        if (storageError) {
          console.error("Alerta!!!, no se elimino archivo del store: ")
  

          await $swal.fire({
            title: 'Error',
            text: storageError.message || 'No se pudo eliminar la sesión',
            icon: 'error'
          })
          throw new Error(storageError.message)
        }
      }
    }


    await withLoading(() => elimSesion(sesionId))

    for (const curso of cursos.value) {

      const index = (curso.sesiones ?? [])
        .findIndex((s: any) => s.c_sesion === sesionId)

      if (index !== -1) {
        curso.sesiones.splice(index, 1)
        break
      }
    }

    await $swal.fire({
      title: 'Sesión eliminada',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })

  } catch (error: any) {

    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo eliminar la sesión',
      icon: 'error'
    })
  }
}

async function eliminarArchivo(archivo: any, sesion: Sesion) {
  const r = await $swal.fire({
    title: '¿Eliminar archivo?',
    text: 'Esta acción no se podrá revertir.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (!r.isConfirmed) return

  const { $supabase } = useNuxtApp()

  try {
    // 🔒 validar IDs seguros (evita TS issues)
    const sesionId = sesion?.c_sesion
    const archivoId = archivo?.c_archivo
    const url = archivo?.l_url

    if (!sesionId || !archivoId) return

    // =========================
    // 1. ELIMINAR DEL STORAGE
    // =========================
    if (url) {
      const path = url.split('/public/sesiones/')[1]

      if (path) {
        const { error: storageError } = await $supabase.storage
          .from('sesiones')
          .remove([path])

        if (storageError) {
          throw new Error(storageError.message)
        }
      }
    }

    // =========================
    // 2. ELIMINAR DEL BACKEND
    // =========================
    await withLoading(() =>
      elimArchivo(archivoId, sesionId)
    )

    // =========================
    // 3. ACTUALIZAR STORE (UI)
    // =========================
    const sesionActual = sesionStore.getSesionById(sesionId)

    if (sesionActual?.archivos) {
      sesionActual.archivos = sesionActual.archivos.filter(
        a => a.c_archivo !== archivoId
      )
    }

    await $swal.fire({
      title: 'Archivo eliminado',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })

  } catch (error: any) {
    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo eliminar el archivo',
      icon: 'error'
    })
  }
}


async function eliminarCurso(cursoId: string) {
  const r = await $swal.fire({
    title: '¿Eliminar curso?', text: 'Esta acción eliminará el curso y sus sesiones.', icon: 'warning',
    showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', reverseButtons: true,
  })
  if (!r.isConfirmed) return
  try {
    await withLoading(() => elimCurso(cursoId))
    cursosAbiertos.value.delete(cursoId)
    sesionesCargadas.value.delete(cursoId)
    await $swal.fire({ title: 'Curso eliminado', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (error: any) {
    await $swal.fire({ title: 'Error', text: error.message || 'No se pudo eliminar el curso', icon: 'error' })
  }
}

// 

watch(showModalCurso, val => { if (!val) cursoEditando.value = null })
watch(showModalArchivo, val => {
  if (!val) {
    archivoSeleccionado.value = null
    previewCargado.value = false
  }
})

onMounted(async () => {
  try { await withLoading(() => listCursos()) } catch (e) { console.error(e) }
})

// 

function mesCorto(fecha: any) {

  return new Date(fecha + 'T00:00:00').toLocaleDateString('es', { month: 'short' })
  // return "mes"
}
function dia(fecha: any) {

  return new Date(fecha + 'T00:00:00').getDate().toString()
  // return "día"
}
function fechaLarga(fecha: any) {

  return new Date(fecha + 'T00:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
  // return "fecha larga"
}
function plataforma(url: string) {
  const u = url.toLowerCase()
  if (u.includes('meet.google')) return 'Google Meet'
  if (u.includes('zoom.us')) return 'Zoom'
  if (u.includes('teams.microsoft') || u.includes('teams.live')) return 'Teams'
  return 'Reunión'
}




// ── Colores por color de curso ────────────────────────────────────────────────

const fondos: Record<string, string> = {
  emerald: 'bg-emerald-50', blue: 'bg-blue-50', violet: 'bg-violet-50',
  rose: 'bg-rose-50', amber: 'bg-amber-50', cyan: 'bg-cyan-50', slate: 'bg-slate-50',
}
const fondosSuaves: Record<string, string> = {
  emerald: 'bg-emerald-50/50', blue: 'bg-blue-50/50', violet: 'bg-violet-50/50',
  rose: 'bg-rose-50/50', amber: 'bg-amber-50/50', cyan: 'bg-cyan-50/50', slate: 'bg-slate-50/50',
}
const dots: Record<string, string> = {
  emerald: 'bg-emerald-500', blue: 'bg-blue-500', violet: 'bg-violet-500',
  rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500', slate: 'bg-slate-500',
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
const tabColors: Record<string, string> = {
  emerald: 'text-emerald-600', blue: 'text-blue-600', violet: 'text-violet-600',
  rose: 'text-rose-600', amber: 'text-amber-600', cyan: 'text-cyan-600', slate: 'text-slate-600',
}
const tabBorders: Record<string, string> = {
  emerald: 'border-emerald-500', blue: 'border-blue-500', violet: 'border-violet-500',
  rose: 'border-rose-500', amber: 'border-amber-500', cyan: 'border-cyan-500', slate: 'border-slate-500',
}
const botones: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  blue:    'bg-blue-100 text-blue-700 hover:bg-blue-200',
  violet:  'bg-violet-100 text-violet-700 hover:bg-violet-200',
  rose:    'bg-rose-100 text-rose-700 hover:bg-rose-200',
  amber:   'bg-amber-100 text-amber-700 hover:bg-amber-200',
  cyan:    'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  slate:   'bg-slate-100 text-slate-700 hover:bg-slate-200',
}

const colorFondo       = (c: string) => fondos[c]      ?? fondos.emerald
const colorFondoSuave  = (c: string) => fondosSuaves[c] ?? fondosSuaves.emerald
const colorDot         = (c: string) => dots[c]         ?? dots.emerald
const colorText        = (c: string) => texts[c]        ?? texts.emerald
const colorBadge       = (c: string) => badges[c]       ?? badges.emerald
const colorTabActiva   = (c: string) => tabColors[c]    ?? tabColors.emerald
const colorBorderTab   = (c: string) => tabBorders[c]   ?? tabBorders.emerald
const colorBotonSesion = (c: string) => botones[c]      ?? botones.emerald
</script>