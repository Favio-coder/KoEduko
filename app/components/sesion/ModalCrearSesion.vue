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
                  <p class="text-[10px] text-gray-400 truncate max-w-52">{{ curso?.nombre }}</p>
                </div>
              </div>

              <!-- Indicador de edición -->
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

            <!-- ── Tabs internas ── -->
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
                <!-- Badge contador archivos -->
                <span
                  v-if="tab.id === 'archivos' && archivosLocales.length > 0"
                  :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-full', colorBadgeBg]"
                >
                  {{ archivosLocales.length }}
                </span>
              </button>
            </div>

            <!-- ── Body: scrollable ── -->
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

                <!-- Materiales (texto) -->
                <div>
                  <label class="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                    <ClipboardDocumentListIcon class="w-3.5 h-3.5 text-gray-400" />
                    Notas / materiales a tratar
                    <span class="text-gray-300 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    v-model="form.materiales"
                    placeholder="Ej: Repasar cap. 3, traer calculadora…"
                    rows="2"
                    class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition placeholder:text-gray-300 resize-none"
                  />
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
                        <span v-if="arch.cargando" class="text-[10px] text-emerald-500 flex items-center gap-1">
                          <ArrowPathIcon class="w-2.5 h-2.5 animate-spin" />
                          {{ arch.progreso }}%
                        </span>
                        <span v-else class="text-[10px] font-bold uppercase text-gray-300">{{ arch.tipo }}</span>
                      </div>
                      <div v-if="arch.cargando" class="mt-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          :class="['h-full rounded-full transition-all duration-300', colorDotBg]"
                          :style="{ width: `${arch.progreso}%` }"
                        />
                      </div>
                    </div>
                    <button
                      @click="eliminarArchivoLocal(arch.id)"
                      class="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
                    >
                      <TrashIcon class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p v-else class="text-center text-xs text-gray-300 py-2">
                  Sin archivos · Se subirán a la nube al guardar
                </p>
              </div>

              <!-- Tab Reunión -->
              <div v-else-if="tabModal === 'reunion'" class="px-6 py-5 space-y-4">
                <div>
                  <label class="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                    <VideoCameraIcon class="w-3.5 h-3.5 text-gray-400" />
                    Link de reunión
                    <span class="text-gray-300 font-normal">(opcional)</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.linkReunion"
                      type="url"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      class="w-full pl-3.5 pr-20 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition placeholder:text-gray-300"
                      :class="{ 'border-red-300 ring-2 ring-red-100': errores.linkReunion }"
                    />
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <span v-if="plataformaReunion === 'meet'"  class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Meet</span>
                      <span v-else-if="plataformaReunion === 'zoom'"  class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Zoom</span>
                      <span v-else-if="plataformaReunion === 'teams'" class="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">Teams</span>
                      <LinkIcon v-else-if="form.linkReunion" class="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  </div>
                  <p v-if="errores.linkReunion" class="text-[10px] text-red-400 mt-1">{{ errores.linkReunion }}</p>
                </div>

                <!-- Sugerencia del curso -->
                <div
                  v-if="curso?.linkReunion && !form.linkReunion"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p class="text-[10px] font-semibold text-gray-500">Link del curso disponible</p>
                    <p class="text-xs text-gray-700 truncate max-w-xs">{{ curso.linkReunion }}</p>
                  </div>
                  <button
                    @click="form.linkReunion = curso!.linkReunion!"
                    :class="['text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition', colorBotonBg]"
                  >
                    Usar
                  </button>
                </div>
              </div>
            </div>

            <!-- ── Footer ── -->
            <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <!-- Indicador de cambios -->
                <span v-if="esEdicion && haycambios" class="flex items-center gap-1 text-[10px] text-amber-500">
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Cambios sin guardar
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="cerrar"
                  class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition font-medium"
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
  CalendarDaysIcon, XMarkIcon, ArrowPathIcon, ClipboardDocumentListIcon,
  VideoCameraIcon, LinkIcon, PencilIcon, ArrowUpTrayIcon, TrashIcon,
  DocumentIcon, DocumentTextIcon, PresentationChartBarIcon, TableCellsIcon,
  PhotoIcon, FilmIcon, ArchiveBoxIcon, CheckIcon,
} from '@heroicons/vue/24/outline'
import type { Sesion } from '~/types/sesion'
import type { Curso } from '~/types/curso'

// ── Tipos ──────────────────────────────────────────────────────────────────────
type TipoArchivo = 'pdf' | 'pptx' | 'docx' | 'xlsx' | 'imagen' | 'video' | 'zip' | 'otro'

interface ArchivoLocal {
  id:       string
  nombre:   string
  tipo:     TipoArchivo
  tamano:   number
  cargando: boolean
  progreso: number
  url?:     string
}

type TabModal = 'general' | 'archivos' | 'reunion'

// ── Props & emits ──────────────────────────────────────────────────────────────
const props = defineProps<{
  modelValue: boolean
  curso:      Curso | null
  sesion?:    Sesion | null        // si se pasa → modo edición
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created',  sesion: Sesion): void
  (e: 'updated',  sesion: Sesion): void
}>()

// ── Estado ────────────────────────────────────────────────────────────────────
const loading       = ref(false)
const dropActivo    = ref(false)
const tabModal      = ref<TabModal>('general')
const fileInputRef  = ref<HTMLInputElement | null>(null)
const archivosLocales = ref<ArchivoLocal[]>([])

const TABS_MODAL: { id: TabModal; label: string; icon: any }[] = [
  { id: 'general',  label: 'General',   icon: CalendarDaysIcon },
  { id: 'archivos', label: 'Archivos',  icon: DocumentIcon },
  { id: 'reunion',  label: 'Reunión',   icon: VideoCameraIcon },
]

const form = reactive({
  titulo:       '',
  descripcion:  '',
  fecha:        '',
  hora:         '',
  materiales:   '',
  linkReunion:  '',
})

const errores = reactive({
  titulo:      '',
  fecha:       '',
  linkReunion: '',
})

// ── Computed ───────────────────────────────────────────────────────────────────
const esEdicion = computed(() => !!props.sesion)

const haycambios = computed(() => {
  if (!esEdicion.value || !props.sesion) return false
  return (
    form.titulo       !== (props.sesion.titulo        ?? '') ||
    form.descripcion  !== (props.sesion.descripcion   ?? '') ||
    form.fecha        !== (props.sesion.fecha         ?? '') ||
    form.hora         !== (props.sesion.hora          ?? '') ||
    form.materiales   !== (props.sesion.materiales    ?? '') ||
    form.linkReunion  !== (props.sesion.linkReunion   ?? '')
  )
})

// ── Color helpers ──────────────────────────────────────────────────────────────
const colorMap:     Record<string,string> = { emerald:'bg-emerald-500', blue:'bg-blue-500', violet:'bg-violet-500', rose:'bg-rose-500', amber:'bg-amber-500', cyan:'bg-cyan-500', slate:'bg-slate-500' }
const colorMapLight: Record<string,string> = { emerald:'bg-emerald-50', blue:'bg-blue-50', violet:'bg-violet-50', rose:'bg-rose-50', amber:'bg-amber-50', cyan:'bg-cyan-50', slate:'bg-slate-50' }
const colorMapText:  Record<string,string> = { emerald:'text-emerald-600', blue:'text-blue-600', violet:'text-violet-600', rose:'text-rose-600', amber:'text-amber-600', cyan:'text-cyan-600', slate:'text-slate-600' }
const colorMapDot:   Record<string,string> = { emerald:'bg-emerald-500', blue:'bg-blue-500', violet:'bg-violet-500', rose:'bg-rose-500', amber:'bg-amber-500', cyan:'bg-cyan-500', slate:'bg-slate-500' }
const colorMapBadge: Record<string,string> = { emerald:'bg-emerald-100 text-emerald-700', blue:'bg-blue-100 text-blue-700', violet:'bg-violet-100 text-violet-700', rose:'bg-rose-100 text-rose-700', amber:'bg-amber-100 text-amber-700', cyan:'bg-cyan-100 text-cyan-700', slate:'bg-slate-100 text-slate-700' }
const colorMapBoton: Record<string,string> = { emerald:'bg-emerald-100 text-emerald-700 hover:bg-emerald-200', blue:'bg-blue-100 text-blue-700 hover:bg-blue-200', violet:'bg-violet-100 text-violet-700 hover:bg-violet-200', rose:'bg-rose-100 text-rose-700 hover:bg-rose-200', amber:'bg-amber-100 text-amber-700 hover:bg-amber-200', cyan:'bg-cyan-100 text-cyan-700 hover:bg-cyan-200', slate:'bg-slate-100 text-slate-700 hover:bg-slate-200' }
const colorMapBorde: Record<string,string> = { emerald:'border-emerald-400', blue:'border-blue-400', violet:'border-violet-400', rose:'border-rose-400', amber:'border-amber-400', cyan:'border-cyan-400', slate:'border-slate-400' }

const colorKey  = computed(() => props.curso?.color ?? 'emerald')
const colorBg      = computed(() => colorMap[colorKey.value]      ?? colorMap.emerald)
const colorBgLight = computed(() => colorMapLight[colorKey.value]  ?? colorMapLight.emerald)
const colorTextBg  = computed(() => colorMapText[colorKey.value]   ?? colorMapText.emerald)
const colorDotBg   = computed(() => colorMapDot[colorKey.value]    ?? colorMapDot.emerald)
const colorBadgeBg = computed(() => colorMapBadge[colorKey.value]  ?? colorMapBadge.emerald)
const colorBotonBg = computed(() => colorMapBoton[colorKey.value]  ?? colorMapBoton.emerald)
const colorBordeDrop = computed(() => colorMapBorde[colorKey.value] ?? colorMapBorde.emerald)

// ── Detección de plataforma ───────────────────────────────────────────────────
const plataformaReunion = computed((): string => {
  const url = form.linkReunion.toLowerCase()
  if (url.includes('meet.google')) return 'meet'
  if (url.includes('zoom.us'))     return 'zoom'
  if (url.includes('teams.microsoft') || url.includes('teams.live')) return 'teams'
  return ''
})

// ── Watchers: pre-fill en edición ─────────────────────────────────────────────
watch(() => props.modelValue, (open) => {
  if (open) {
    tabModal.value = 'general'
    archivosLocales.value = props.sesion?.archivos ? [...props.sesion.archivos] : []

    if (props.sesion) {
      // Modo edición: pre-llenar formulario
      Object.assign(form, {
        titulo:      props.sesion.titulo        ?? '',
        descripcion: props.sesion.descripcion   ?? '',
        fecha:       props.sesion.fecha         ?? '',
        hora:        props.sesion.hora          ?? '',
        materiales:  props.sesion.materiales    ?? '',
        linkReunion: props.sesion.linkReunion   ?? '',
      })
    } else {
      // Modo creación: limpiar
      Object.assign(form, { titulo:'', descripcion:'', fecha:'', hora:'', materiales:'', linkReunion:'' })
    }
    Object.assign(errores, { titulo:'', fecha:'', linkReunion:'' })
  }
})

// ── Archivos ──────────────────────────────────────────────────────────────────
function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) procesarArchivos(Array.from(files))
}
function onDrop(event: DragEvent) {
  dropActivo.value = false
  const files = event.dataTransfer?.files
  if (files) procesarArchivos(Array.from(files))
}
function procesarArchivos(files: File[]) {
  for (const file of files) {
    const arch: ArchivoLocal = {
      id:       crypto.randomUUID(),
      nombre:   file.name,
      tipo:     detectarTipo(file.name),
      tamano:   file.size,
      cargando: true,
      progreso: 0,
    }
    archivosLocales.value.push(arch)
    simularSubida(arch.id)
  }
}
function simularSubida(id: string) {
  // TODO: upload real a S3
  const iv = setInterval(() => {
    const arch = archivosLocales.value.find(a => a.id === id)
    if (!arch) { clearInterval(iv); return }
    arch.progreso = Math.min(arch.progreso + Math.random() * 25, 100)
    if (arch.progreso >= 100) {
      arch.progreso = 100
      arch.cargando = false
      clearInterval(iv)
    }
  }, 300)
}
function eliminarArchivoLocal(id: string) {
  archivosLocales.value = archivosLocales.value.filter(a => a.id !== id)
}
function detectarTipo(nombre: string): TipoArchivo {
  const ext = nombre.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf')                      return 'pdf'
  if (['ppt','pptx'].includes(ext))       return 'pptx'
  if (['doc','docx'].includes(ext))       return 'docx'
  if (['xls','xlsx'].includes(ext))       return 'xlsx'
  if (['png','jpg','jpeg','gif','webp'].includes(ext)) return 'imagen'
  if (['mp4','mov','avi'].includes(ext))  return 'video'
  if (['zip','rar','7z'].includes(ext))   return 'zip'
  return 'otro'
}
function iconoArchivo(tipo: string) {
  const map: Record<string,any> = {
    pdf: DocumentIcon, pptx: PresentationChartBarIcon, docx: DocumentTextIcon,
    xlsx: TableCellsIcon, imagen: PhotoIcon, video: FilmIcon, zip: ArchiveBoxIcon,
  }
  return map[tipo] ?? DocumentIcon
}
function formatSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

// ── Validación ────────────────────────────────────────────────────────────────
function validar(): boolean {
  errores.titulo = errores.fecha = errores.linkReunion = ''
  let ok = true
  if (!form.titulo.trim()) { errores.titulo = 'El título es obligatorio'; ok = false }
  if (!form.fecha)          { errores.fecha  = 'La fecha es obligatoria';  ok = false }
  if (form.linkReunion && !form.linkReunion.startsWith('http')) {
    errores.linkReunion = 'Debe comenzar con http:// o https://'
    ok = false
  }
  return ok
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validar()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 400))

  const sesionData: Sesion = {
    id:          props.sesion?.id ?? crypto.randomUUID(),
    titulo:      form.titulo.trim(),
    descripcion: form.descripcion.trim()  || null,
    fecha:       form.fecha,
    hora:        form.hora                || null,
    materiales:  form.materiales.trim()   || null,
    linkReunion: form.linkReunion.trim()  || null,
    archivos:    archivosLocales.value.filter(a => !a.cargando),
    creadoEn:    props.sesion?.creadoEn ?? new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  }

  if (esEdicion.value) {
    emit('updated', sesionData)
  } else {
    emit('created', sesionData)
  }

  cerrar()
  loading.value = false
}

function cerrar() {
  emit('update:modelValue', false)
}
</script>