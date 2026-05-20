<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="cerrar"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
        >
          <div
            v-if="modelValue"
            class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 overflow-hidden"
          >
            <!-- ── Header ── -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', colorBg]">
                  <component :is="esEdicion ? PencilIcon : CalendarDaysIcon" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-gray-800">
                    {{ esEdicion ? 'Editar sesión' : 'Nueva sesión' }}
                  </h2>
                  <p class="text-[10px] text-gray-400 truncate max-w-52">{{ curso?.l_curso }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="esEdicion"
                  class="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full"
                >
                  <PencilIcon class="w-2.5 h-2.5" />
                  Editando
                </span>
                <button
                  @click="cerrar"
                  class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- ── Tabs ── -->
            <div class="flex border-b border-gray-100 px-6">
              <button
                v-for="tab in TABS_MODAL"
                :key="tab.id"
                @click="tabModal = tab.id"
                :class="[
                  'flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-colors',
                  tabModal === tab.id
                    ? [colorTextBg, 'border-current']
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                ]"
              >
                <component :is="tab.icon" class="w-3.5 h-3.5" />
                {{ tab.label }}
                <span
                  v-if="tab.id === 'archivos' && archivosLocales.length > 0"
                  :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-full', colorBadgeBg]"
                >
                  {{ archivosLocales.length }}
                </span>
              </button>
            </div>

            <!-- ── Error global ── -->
            <div
              v-if="errorGuardar"
              class="mx-6 mt-4 flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl"
            >
              <ExclamationCircleIcon class="w-4 h-4 text-red-400 shrink-0" />
              <p class="text-xs text-red-600">{{ errorGuardar }}</p>
            </div>

            <!-- ── Body ── -->
            <div class="max-h-[60vh] overflow-y-auto">

              <!-- Tab General -->
              <div v-if="tabModal === 'general'" class="px-6 py-5 space-y-4">
                <!-- Título -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                    Título de la sesión <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="form.titulo"
                    type="text"
                    placeholder="Ej: Introducción a las fracciones"
                    class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition placeholder:text-gray-300"
                    :class="{ 'border-red-300 ring-2 ring-red-100': errores.titulo }"
                  />
                  <p v-if="errores.titulo" class="text-[10px] text-red-400 mt-1">{{ errores.titulo }}</p>
                </div>

                <!-- Descripción -->
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                    Descripción
                    <span class="text-gray-300 font-normal ml-1">(opcional)</span>
                  </label>
                  <textarea
                    v-model="form.descripcion"
                    placeholder="¿Qué se trabajará en esta sesión?"
                    rows="2"
                    class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition placeholder:text-gray-300 resize-none"
                  />
                </div>

                <!-- Fecha y hora -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                      Fecha <span class="text-red-400">*</span>
                    </label>
                    <input
                      v-model="form.fecha"
                      type="date"
                      class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      :class="{ 'border-red-300 ring-2 ring-red-100': errores.fecha }"
                    />
                    <p v-if="errores.fecha" class="text-[10px] text-red-400 mt-1">{{ errores.fecha }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Hora</label>
                    <input
                      v-model="form.hora"
                      type="time"
                      class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <!-- Tab Archivos -->
              <div v-else-if="tabModal === 'archivos'" class="px-6 py-5 space-y-4">
                <!-- Dropzone -->
                <div
                  :class="[
                    'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
                    dropActivo ? [colorBordeDrop, 'opacity-90'] : 'border-gray-200 hover:border-gray-300'
                  ]"
                  @click="fileInputRef?.click()"
                  @dragover.prevent="dropActivo = true"
                  @dragleave.prevent="dropActivo = false"
                  @drop.prevent="onDrop"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.mp4,.zip"
                    class="hidden"
                    @change="onFileChange"
                  />
                  <div :class="['w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center', colorBgLight]">
                    <ArrowUpTrayIcon :class="['w-6 h-6', colorTextBg]" />
                  </div>
                  <p class="text-sm font-semibold text-gray-700">Arrastra archivos aquí</p>
                  <p class="text-xs text-gray-400 mt-1">PDF, PPT, Word, Excel, imágenes · Máx. 50 MB</p>
                  <p class="text-[10px] text-gray-300 mt-2">O haz clic para seleccionar</p>
                </div>

                <!-- Lista archivos -->
                <div v-if="archivosLocales.length > 0" class="space-y-2">
                  <div
                    v-for="arch in archivosLocales"
                    :key="arch.id"
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group"
                  >
                    <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', colorBgLight]">
                      <component :is="iconoArchivo(arch.tipo)" :class="['w-4 h-4', colorTextBg]" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold text-gray-700 truncate">{{ arch.nombre }}</p>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[10px] text-gray-400">{{ formatSize(arch.tamano) }}</span>
                        <!-- Subiendo durante el submit -->
                        <span v-if="loading" class="text-[10px] text-emerald-500 flex items-center gap-1">
                          <ArrowPathIcon class="w-2.5 h-2.5 animate-spin" />
                          Subiendo…
                        </span>
                        <span v-else class="text-[10px] font-bold uppercase text-gray-300">{{ arch.tipo }}</span>
                      </div>
                      <!-- Barra de progreso solo al guardar -->
                      <div v-if="loading" class="mt-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                        <div :class="['h-full rounded-full animate-pulse', colorDotBg]" style="width: 60%" />
                      </div>
                    </div>
                    <button
                      :disabled="loading"
                      @click="eliminarArchivoLocal(arch.id)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all disabled:pointer-events-none"
                    >
                      <TrashIcon class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p v-else class="text-center text-xs text-gray-300 py-2">
                  Sin archivos · Se subirán a la nube al guardar
                </p>
              </div>

            </div>

            <!-- ── Footer ── -->
            <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <span v-if="esEdicion && haycambios" class="flex items-center gap-1 text-[10px] text-amber-500">
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Cambios sin guardar
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="cerrar"
                  :disabled="loading"
                  class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  @click="handleSubmit"
                  :disabled="loading"
                  :class="[
                    'flex items-center gap-2 px-5 py-2 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow-sm',
                    esEdicion ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                  ]"
                >
                  <ArrowPathIcon v-if="loading" class="w-4 h-4 animate-spin" />
                  <CheckIcon v-else-if="esEdicion" class="w-4 h-4" />
                  <span>{{ loading ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear sesión' }}</span>
                </button>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  CalendarDaysIcon, XMarkIcon, ArrowPathIcon,
  PencilIcon, ArrowUpTrayIcon, TrashIcon,
  DocumentIcon, DocumentTextIcon, PresentationChartBarIcon, TableCellsIcon,
  PhotoIcon, FilmIcon, ArchiveBoxIcon, CheckIcon, ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

import type { Sesion }          from '~/types/sesion'
import type { Curso }           from '~/types/curso'
import type { TipoArchivo }     from '~/types/archivo'
import type { CrearSesionDTO }  from '~/types/sesionDTO'

// ── Composable ────────────────────────────────────────────────────────────────
import { useGrabSesion } from '~/composable/sesion/useGrabSesion'
import { useEditSesion } from '~/composable/sesion/useEditSesion'

const { grabarSesion, loading, error: errorComposable } = useGrabSesion()
const {editSesion} = useEditSesion()

// ── Tipos locales ─────────────────────────────────────────────────────────────

interface ArchivoLocal {
  id:      string
  nombre:  string
  tipo:    TipoArchivo
  tamano:  number
  file:    File         
}

type TabModal = 'general' | 'archivos'

// ── Props & emits ──────────────────────────────────────────────────────────────
const props = defineProps<{
  modelValue: boolean
  curso:      Curso | null
  sesion?:    Sesion | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created', sesion: Sesion): void
  (e: 'updated', sesion: Sesion): void
}>()

// ── Estado ────────────────────────────────────────────────────────────────────
const dropActivo      = ref(false)
const tabModal        = ref<TabModal>('general')
const fileInputRef    = ref<HTMLInputElement | null>(null)
const archivosLocales = ref<ArchivoLocal[]>([])
const errorGuardar    = ref<string | null>(null)

const TABS_MODAL: { id: TabModal; label: string; icon: any }[] = [
  { id: 'general',  label: 'General',  icon: CalendarDaysIcon },
  { id: 'archivos', label: 'Archivos', icon: DocumentIcon },
]

const form = reactive({
  titulo:      '',
  descripcion: '',
  fecha:       '',
  hora:        '',
  linkReunion: '',
})

const errores = reactive({
  titulo: '',
  fecha:  '',
})

// Computed 
const esEdicion = computed(() => !!props.sesion)

const haycambios = computed(() => {
  if (!esEdicion.value || !props.sesion) return false
  return (
    form.titulo      !== (props.sesion.l_sesion    ?? '') ||
    form.descripcion !== (props.sesion.l_desc      ?? '') ||
    form.fecha       !== (props.sesion.f_sesion    ?? '') ||
    form.hora        !== (props.sesion.f_hora      ?? '') ||
    form.linkReunion !== (props.sesion.linkReunion ?? '')
  )
})

// ── Color helpers ──────────────────────────────────────────────────────────────
const colorMap:      Record<string, string> = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', violet: 'bg-violet-500', rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500', slate: 'bg-slate-500' }
const colorMapLight: Record<string, string> = { emerald: 'bg-emerald-50',  blue: 'bg-blue-50',  violet: 'bg-violet-50',  rose: 'bg-rose-50',  amber: 'bg-amber-50',  cyan: 'bg-cyan-50',  slate: 'bg-slate-50'  }
const colorMapText:  Record<string, string> = { emerald: 'text-emerald-600', blue: 'text-blue-600', violet: 'text-violet-600', rose: 'text-rose-600', amber: 'text-amber-600', cyan: 'text-cyan-600', slate: 'text-slate-600' }
const colorMapDot:   Record<string, string> = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', violet: 'bg-violet-500', rose: 'bg-rose-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500', slate: 'bg-slate-500' }
const colorMapBadge: Record<string, string> = { emerald: 'bg-emerald-100 text-emerald-700', blue: 'bg-blue-100 text-blue-700', violet: 'bg-violet-100 text-violet-700', rose: 'bg-rose-100 text-rose-700', amber: 'bg-amber-100 text-amber-700', cyan: 'bg-cyan-100 text-cyan-700', slate: 'bg-slate-100 text-slate-700' }
const colorMapBorde: Record<string, string> = { emerald: 'border-emerald-400', blue: 'border-blue-400', violet: 'border-violet-400', rose: 'border-rose-400', amber: 'border-amber-400', cyan: 'border-cyan-400', slate: 'border-slate-400' }

const colorKey    = computed(() => props.curso?.l_color ?? 'emerald')
const colorBg      = computed(() => colorMap[colorKey.value]      ?? colorMap.emerald)
const colorBgLight = computed(() => colorMapLight[colorKey.value]  ?? colorMapLight.emerald)
const colorTextBg  = computed(() => colorMapText[colorKey.value]   ?? colorMapText.emerald)
const colorDotBg   = computed(() => colorMapDot[colorKey.value]    ?? colorMapDot.emerald)
const colorBadgeBg = computed(() => colorMapBadge[colorKey.value]  ?? colorMapBadge.emerald)
const colorBordeDrop = computed(() => colorMapBorde[colorKey.value] ?? colorMapBorde.emerald)

// Watcher
watch(() => props.modelValue, (open) => {
  if (!open) return
  tabModal.value    = 'general'
  errorGuardar.value = null
  archivosLocales.value = []          

  if (props.sesion) {
    Object.assign(form, {
      titulo:      props.sesion.l_sesion    ?? '',
      descripcion: props.sesion.l_desc      ?? '',
      fecha:       props.sesion.f_sesion    ?? '',
      hora:        props.sesion.f_hora      ?? '',
      linkReunion: props.sesion.linkReunion ?? '',
    })
  } else {
    Object.assign(form, { titulo: '', descripcion: '', fecha: '', hora: '', linkReunion: '' })
  }

  Object.assign(errores, { titulo: '', fecha: '' })
})

// ── Manejo de archivos ────────────────────────────────────────────────────────
function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) procesarArchivos(Array.from(files))
  // Reset input para permitir seleccionar el mismo archivo de nuevo
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function onDrop(event: DragEvent) {
  dropActivo.value = false
  const files = event.dataTransfer?.files
  if (files) procesarArchivos(Array.from(files))
}

function procesarArchivos(files: File[]) {
  for (const file of files) {
    // Evitar duplicados por nombre
    const yaExiste = archivosLocales.value.some(a => a.nombre === file.name)
    if (yaExiste) continue

    archivosLocales.value.push({
      id:     crypto.randomUUID(),
      nombre: file.name,
      tipo:   detectarTipo(file.name),
      tamano: file.size,
      file,                           // ← referencia real al File
    })
  }
}

function eliminarArchivoLocal(id: string) {
  archivosLocales.value = archivosLocales.value.filter(a => a.id !== id)
}

function detectarTipo(nombre: string): TipoArchivo {
  const ext = nombre.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf')                               return 'pdf'
  if (['ppt', 'pptx'].includes(ext))              return 'pptx'
  if (['doc', 'docx'].includes(ext))              return 'docx'
  if (['xls', 'xlsx'].includes(ext))              return 'xlsx'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'imagen'
  if (['mp4', 'mov', 'avi'].includes(ext))        return 'video'
  if (['zip', 'rar', '7z'].includes(ext))         return 'zip'
  return 'otro'
}

function iconoArchivo(tipo: string) {
  const map: Record<string, any> = {
    pdf: DocumentIcon, pptx: PresentationChartBarIcon, docx: DocumentTextIcon,
    xlsx: TableCellsIcon, imagen: PhotoIcon, video: FilmIcon, zip: ArchiveBoxIcon,
  }
  return map[tipo] ?? DocumentIcon
}

function formatSize(bytes: number): string {
  if (bytes < 1024)      return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

// ── Validación ────────────────────────────────────────────────────────────────
function validar(): boolean {
  errores.titulo = ''
  errores.fecha  = ''
  let ok = true
  if (!form.titulo.trim()) { errores.titulo = 'El título es obligatorio'; ok = false }
  if (!form.fecha)          { errores.fecha  = 'La fecha es obligatoria';  ok = false }
  return ok
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validar()) return
  errorGuardar.value = null

  // Mapear al DTO que espera el composable / service
  const dto: CrearSesionDTO = {
    l_sesion: form.titulo.trim(),
    l_desc:   form.descripcion.trim() || null,
    f_sesion: form.fecha,
    f_hora:   form.hora               || null,
    l_reu:    form.linkReunion.trim() || null,
    // Cada ArchivoLocal → ArchivoUpload (solo los campos que pide el service)
    archivos: archivosLocales.value.map(a => ({
      file:     a.file,
      tipo:     a.tipo,
      cargando: false,
      progreso: 0,
    })),
  }

  try {
    if (esEdicion.value && props.sesion?.c_sesion) {
      
      const dtoEditar = {
        ...dto,
        c_sesion: props.sesion.c_sesion,

        archivosExistentes: props.sesion.archivos ?? []
      }

      const sesionActualizada = await editSesion(dtoEditar, props.sesion?.c_sesion )

      emit('updated', sesionActualizada)
      cerrar()
    } else {
      
      const sesionCreada = await grabarSesion(dto)

      emit('created', sesionCreada)
      cerrar()
    }
  } catch (e: any) {
    errorGuardar.value = e?.message ?? 'Ocurrió un error al guardar la sesión'
  }
}

function cerrar() {
  if (loading.value) return          // no cerrar mientras sube archivos
  emit('update:modelValue', false)
}
</script>