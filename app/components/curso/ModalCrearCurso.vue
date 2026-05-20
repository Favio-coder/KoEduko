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
            class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden"
          >
            <!-- ── Header ── -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', colorSeleccionado.bg]">
                  <BookOpenIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-gray-800">
                    {{ esEdicion ? 'Editar curso' : 'Nuevo curso' }}
                  </h2>
                  <p class="text-[10px] text-gray-400">
                    {{ esEdicion ? 'Modifica los datos del curso' : 'Organiza tus sesiones por curso' }}
                  </p>
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

            <!-- ── Body ── -->
            <div class="px-6 py-5 space-y-5">

              <!-- Nombre -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                  Nombre del curso <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  placeholder="Ej: Matemáticas 5°, Inglés Avanzado…"
                  class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition placeholder:text-gray-300"
                  :class="{ 'border-red-300 ring-2 ring-red-100': errores.nombre }"
                />
                <p v-if="errores.nombre" class="text-[10px] text-red-400 mt-1">{{ errores.nombre }}</p>
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                  Descripción
                  <span class="text-gray-300 font-normal ml-1">(opcional)</span>
                </label>
                <textarea
                  v-model="form.descripcion"
                  placeholder="Breve descripción del curso…"
                  rows="2"
                  class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition placeholder:text-gray-300 resize-none"
                />
              </div>

              <!-- Selector de color -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2">Color del curso</label>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="c in COLORES"
                    :key="c.id"
                    @click="form.color = c.id"
                    :class="[
                      'w-8 h-8 rounded-xl transition-all duration-150',
                      c.bg,
                      form.color === c.id
                        ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    ]"
                    :title="c.label"
                  >
                    <span v-if="form.color === c.id" class="flex items-center justify-center">
                      <CheckIcon class="w-4 h-4 text-white" />
                    </span>
                  </button>
                </div>
                <!-- Preview -->
                <div :class="['mt-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl', colorSeleccionado.fondo]">
                  <div :class="['w-2 h-2 rounded-full', colorSeleccionado.dot]" />
                  <p :class="['text-xs font-semibold', colorSeleccionado.text]">
                    {{ form.nombre || 'Nombre del curso' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- ── Footer ── -->
            <div class="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
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
                <span>{{ loading ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear curso' }}</span>
              </button>
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
  BookOpenIcon, XMarkIcon, ArrowPathIcon, PencilIcon, CheckIcon,
} from '@heroicons/vue/24/outline'
import type { Curso, ColorCurso } from '~/types/curso'   
import { useGrabCurso } from '~/composable/curso/useGrabCurso';
import { useEditCurso } from '~/composable/curso/useEditCurso';

const {$swal} = useNuxtApp()

const props = defineProps<{
  modelValue: boolean
  curso?:     Curso | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'created', curso: Curso): void
  (e: 'updated', curso: Curso): void
}>()

const COLORES: { id: ColorCurso; label: string; bg: string; dot: string; fondo: string; text: string }[] = [
  { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500', dot: 'bg-emerald-500', fondo: 'bg-emerald-50', text: 'text-emerald-700' },
  { id: 'blue',    label: 'Azul',      bg: 'bg-blue-500',    dot: 'bg-blue-500',    fondo: 'bg-blue-50',    text: 'text-blue-700'    },
  { id: 'violet',  label: 'Violeta',   bg: 'bg-violet-500',  dot: 'bg-violet-500',  fondo: 'bg-violet-50',  text: 'text-violet-700'  },
  { id: 'rose',    label: 'Rosa',      bg: 'bg-rose-500',    dot: 'bg-rose-500',    fondo: 'bg-rose-50',    text: 'text-rose-700'    },
  { id: 'amber',   label: 'Ámbar',     bg: 'bg-amber-500',   dot: 'bg-amber-500',   fondo: 'bg-amber-50',   text: 'text-amber-700'   },
  { id: 'cyan',    label: 'Cian',      bg: 'bg-cyan-500',    dot: 'bg-cyan-500',    fondo: 'bg-cyan-50',    text: 'text-cyan-700'    },
  { id: 'slate',   label: 'Gris',      bg: 'bg-slate-500',   dot: 'bg-slate-500',   fondo: 'bg-slate-50',   text: 'text-slate-700'   },
]


const loading = ref(false)

const form = reactive<{ nombre: string; descripcion: string; color: ColorCurso }>({
  nombre:      '',
  descripcion: '',
  color:       'emerald',
})

const errores = reactive({ nombre: '' })

const esEdicion = computed(() => !!props.curso)

const colorSeleccionado = computed(() =>
  COLORES.find(c => c.id === form.color)!
)


watch(() => props.modelValue, (open) => {
  if (!open) return
  errores.nombre = ''
  if (props.curso) {
    form.nombre      = props.curso.l_curso      ?? ''
    form.descripcion = props.curso.l_desc ?? ''
    form.color       = props.curso.l_color       ?? 'emerald'
  } else {
    form.nombre      = ''
    form.descripcion = ''
    form.color       = 'emerald'
  }
})


function validar(): boolean {
  errores.nombre = ''
  if (!form.nombre.trim()) { errores.nombre = 'El nombre es obligatorio'; return false }
  return true
}

async function handleSubmit() {

  if (!validar()) return

  loading.value = true

  await new Promise(r => setTimeout(r, 400))

  const cursoData: Curso = {
    c_curso: props.curso?.c_curso ?? crypto.randomUUID(),
    l_curso: form.nombre.trim(),
    l_desc: form.descripcion.trim() || null,
    l_color: form.color,
    sesiones: props.curso?.sesiones ?? [],
    f_crea: props.curso?.f_crea ?? new Date().toISOString(),
  }

  try {

    if (esEdicion.value) {

      const { editCurso } = useEditCurso()

      const cursoActualizado = await editCurso(cursoData)

      emit('updated', cursoActualizado)

    } else {

      const { grabarCurso } = useGrabCurso()

      const cursoCreado = await grabarCurso(cursoData)


      //emit('created', cursoCreado[0])
    }

    cerrar()

  } catch(err:any) {

    $swal.fire("Error", err.message, 'error')

  } finally {

    loading.value = false
  }
}

function cerrar() {
  emit('update:modelValue', false)
}
</script>