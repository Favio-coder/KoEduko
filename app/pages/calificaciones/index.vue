<template>
  <div class="space-y-6">

    <!-- Tarjeta de bienvenida -->
    <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      
      <div class="w-16 h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-2xl font-bold">
        {{ inicialNombre }}
      </div>

      <div>
        <h1 class="text-2xl font-bold text-[#264e49]">
          Bienvenido, {{ authStore.user?.nombre }} 👋
        </h1>
        <p class="text-sm text-gray-500">{{ authStore.perfil?.instieducativo?.l_col }}</p>
        <p class="text-xs text-gray-400 mt-1">
          {{ aulaStore.contextoActual || 'Tu aula asignada' }}
        </p>
      </div>

    </div>

    <!-- Selector de curso -->
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

    <!-- Loading -->
    <div v-if="cargando" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-4">Cargando tus cursos...</p>
    </div>

    <!-- Sin curso seleccionado -->
    <div
      v-else-if="!cursoSeleccionadoId"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <AcademicCapIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Elige un curso</p>
      <p class="text-gray-400 text-xs mt-1">Selecciona un curso para ver tus notas</p>
    </div>

    <!-- Sin cursos disponibles -->
    <div
      v-else-if="cursos.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200"
    >
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <BookOpenIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">No hay cursos disponibles</p>
      <p class="text-gray-400 text-xs mt-1">Aún no tienes cursos asignados</p>
    </div>

    <!-- Tabla de notas -->
    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div class="grid grid-cols-[auto,1fr,repeat(3,100px),100px] px-6 py-4 bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400">
        <span class="text-center">#</span>
        <span>Curso</span>
        <span class="text-center">Conocimiento</span>
        <span class="text-center">Actitud</span>
        <span class="text-center">Participación</span>
        <span class="text-center">Promedio</span>
      </div>

      <div class="divide-y divide-gray-50">
        <div class="grid grid-cols-[auto,1fr,repeat(3,100px),100px] px-6 py-5 hover:bg-gray-50/50 transition-colors items-center">
          
          <div class="flex justify-center">
            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <AcademicCapIcon class="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-800">{{ cursoActual?.l_curso }}</p>
            <p class="text-[10px] text-gray-400 truncate">{{ cursoActual?.l_desc || 'Sin descripción' }}</p>
          </div>

          <div class="flex justify-center">
            <span :class="getNotaClase(cursoActual?.notas?.conocimiento)">
              {{ formatNota(cursoActual?.notas?.conocimiento) }}
            </span>
          </div>
          <div class="flex justify-center">
            <span :class="getNotaClase(cursoActual?.notas?.actitud)">
              {{ formatNota(cursoActual?.notas?.actitud) }}
            </span>
          </div>
          <div class="flex justify-center">
            <span :class="getNotaClase(cursoActual?.notas?.participacion)">
              {{ formatNota(cursoActual?.notas?.participacion) }}
            </span>
          </div>

          <div class="flex justify-center">
            <span :class="promedioClase(promedioCursoActual)">
              {{ promedioCursoActual.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
        <p class="text-[11px] text-gray-400 text-center">
          Las notas se actualizan automáticamente cuando tu profesor las registra
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAulaStore } from '~/stores/aula'

import {
  BookOpenIcon,
  ChevronDownIcon,
  AcademicCapIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { $supabase, $swal } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()

// Estados
const cargando = ref(false)
const cursoSeleccionadoId = ref<string>('')
const cursos = ref<any[]>([])
const notasActuales = ref<any>(null)

// Computed
const c_instanceId = computed(() => authStore.perfil?.c_instanceId)

// Avatar
const inicialNombre = computed(() => {
  return authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
})

// Curso actual con sus notas
const cursoActual = computed(() => {
  if (!cursoSeleccionadoId.value) return null
  const curso = cursos.value.find(c => c.c_curso === cursoSeleccionadoId.value)
  if (!curso) return null
  
  return {
    ...curso,
    notas: notasActuales.value
  }
})

// Promedio
const promedioCursoActual = computed(() => {
  const notas = cursoActual.value?.notas
  if (!notas) return 0
  
  const valores = [
    notas.conocimiento,
    notas.actitud,
    notas.participacion
  ].filter((v): v is number => v != null && v > 0)
  
  if (valores.length === 0) return 0
  return Number((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1))
})

// Formato de notas
function formatNota(nota: number | null | undefined): string {
  const valor = nota ?? null
  return valor !== null ? valor.toFixed(1) : '—'
}

function getNotaClase(nota: number | null | undefined): string {
  const valor = nota ?? null
  if (valor === null) return 'text-sm font-bold px-3 py-1 rounded-full text-gray-300 bg-gray-50'
  if (valor >= 17) return 'text-sm font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50'
  if (valor >= 14) return 'text-sm font-bold px-3 py-1 rounded-full text-blue-700 bg-blue-50'
  if (valor >= 11) return 'text-sm font-bold px-3 py-1 rounded-full text-amber-700 bg-amber-50'
  return 'text-sm font-bold px-3 py-1 rounded-full text-red-700 bg-red-50'
}

function promedioClase(p: number): string {
  if (p === 0) return 'text-sm font-bold px-3 py-1 rounded-full text-gray-300 bg-gray-50'
  if (p >= 17) return 'text-sm font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50'
  if (p >= 14) return 'text-sm font-bold px-3 py-1 rounded-full text-blue-700 bg-blue-50'
  if (p >= 11) return 'text-sm font-bold px-3 py-1 rounded-full text-amber-700 bg-amber-50'
  return 'text-sm font-bold px-3 py-1 rounded-full text-red-700 bg-red-50'
}

// Cargar cursos del estudiante
const cargarCursos = async () => {
  console.log('🔍 Iniciando cargarCursos...')
  console.log('📌 c_instanceId:', c_instanceId.value)
  
  if (!c_instanceId.value) {
    console.log('❌ No hay c_instanceId')
    return
  }
  
  cargando.value = true
  try {
    // DEBUG: Verificar qué hay en la tabla alumno
    console.log('🔎 Buscando en core.alumno con c_usua =', c_instanceId.value)
    
    // 1. Obtener el aula del estudiante
    const { data: alumnoData, error: alumnoError } = await $supabase
      .schema('core')
      .from('alumno')
      .select('*')
      .eq('c_usua', c_instanceId.value)
      .maybeSingle()
    
    console.log('📊 alumnoData:', alumnoData)
    
    if (alumnoError) {
      console.error('❌ Error alumno:', alumnoError)
      throw alumnoError
    }
    
    if (!alumnoData?.c_aula) {
      console.log('⚠️ No se encontró aula para el estudiante')
      cursos.value = []
      return
    }
    
    console.log('✅ Aula encontrada:', alumnoData.c_aula)
    
    // 2. Obtener los cursos del aula
    const { data: cursosData, error: cursosError } = await $supabase
      .schema('core')
      .from('curso')
      .select('c_curso, l_curso, l_desc')
      .eq('c_aula', alumnoData.c_aula)
    
    console.log('📚 Cursos encontrados:', cursosData)
    
    if (cursosError) throw cursosError
    
    cursos.value = cursosData || []
    
    if (cursos.value.length > 0 && !cursoSeleccionadoId.value) {
      cursoSeleccionadoId.value = cursos.value[0].c_curso
      console.log('🎯 Curso seleccionado:', cursoSeleccionadoId.value)
    }
    
  } catch (error: any) {
    console.error('❌ Error cargando cursos:', error)
    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudieron cargar tus cursos',
      icon: 'error'
    })
  } finally {
    cargando.value = false
  }
}

// Cargar notas del estudiante
const cargarNotas = async () => {
  console.log('🔍 cargarNotas - curso:', cursoSeleccionadoId.value, 'c_instanceId:', c_instanceId.value)
  
  if (!cursoSeleccionadoId.value || !c_instanceId.value) {
    notasActuales.value = null
    return
  }
  
  try {
    const { data: atributosData, error: atributosError } = await $supabase
      .schema('core')
      .from('atributos')
      .select('n_con, n_act, n_par')
      .eq('c_cur', cursoSeleccionadoId.value)
      .eq('c_usua', c_instanceId.value)
      .maybeSingle()
    
    console.log('📝 Notas encontradas:', atributosData)
    
    if (atributosError) {
      console.error('❌ Error atributos:', atributosError)
      notasActuales.value = null
      return
    }
    
    if (atributosData) {
      notasActuales.value = {
        conocimiento: atributosData.n_con,
        actitud: atributosData.n_act,
        participacion: atributosData.n_par
      }
    } else {
      notasActuales.value = null
    }
    
  } catch (error: any) {
    console.error('❌ Error cargando notas:', error)
    notasActuales.value = null
  }
}

// Watch cuando cambia el curso
watch(cursoSeleccionadoId, () => {
  cargarNotas()
})

// Inicializar
onMounted(() => {
  console.log('🚀 Componente montado')
  cargarCursos()
})
</script>