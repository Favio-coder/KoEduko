<template>
  <div class="space-y-6">


    <!-- Tarjeta de bienvenida -->
    <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      
      <!-- Avatar con inicial -->
      <div class="w-16 h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-2xl font-bold">
        {{ inicialNombre }}
      </div>

      <!-- Info -->
      <div>
        <h1 class="text-2xl font-bold text-[#264e49]">
          Bienvenido, {{ authStore.user?.nombre }} 👋
        </h1>
        <p class="text-sm text-gray-500">{{ authStore.perfil?.instieducativo?.l_col }}</p>
      </div>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Nombre completo</p>
        <p class="text-gray-800 font-semibold text-sm">
          {{ authStore.perfil?.l_nom }}
          {{ authStore.perfil?.l_apellp }}
          {{ authStore.perfil?.l_apellm }}
        </p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Rol</p>
        <span
          :class="[
            'inline-block text-xs font-semibold px-3 py-1 rounded-full',
            esDocente
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ authStore.perfil?.rol?.l_rol }}
        </span>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Institución</p>
        <p class="text-gray-800 font-semibold text-sm">
          {{ authStore.perfil?.instieducativo?.l_col }}
        </p>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         DOCENTE: Selector de grado / aula
    ══════════════════════════════════════════════════════════════ -->
    <div v-if="esDocente" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <AcademicCapIcon class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-gray-800">Selecciona tu espacio</h2>
          <p class="text-xs text-gray-400">Elige el grado y el salón en el que estás trabajando hoy</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingDocente" class="flex items-center gap-3 py-6 justify-center text-gray-400 text-sm">
        <ArrowPathIcon class="w-5 h-5 animate-spin" />
        Cargando grados y aulas…
      </div>

      <!-- Error -->
      <div v-else-if="errorDocente" class="flex items-center gap-3 py-4 bg-red-50 rounded-xl px-4 text-red-600 text-sm">
        <ExclamationTriangleIcon class="w-5 h-5 shrink-0" />
        {{ errorDocente }}
        <button @click="cargarGradosAulas" class="ml-auto underline text-xs">Reintentar</button>
      </div>

      <!-- Sin datos -->
      <div v-else-if="gradosAulas.length === 0" class="py-8 text-center text-gray-400 text-sm">
        <AcademicCapIcon class="w-10 h-10 mx-auto mb-2 opacity-30" />
        No tienes grados asignados aún.
      </div>

      <div v-else class="space-y-5">
        <template v-if="tieneOpciones">

          <!-- PASO 1: Grados -->
          <div v-if="gradosAulas.length > 1">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">1</span>
              Grado
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="g in gradosAulas"
                :key="g.c_grad"
                @click="seleccionarGrado(g)"
                :class="[
                  'flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 min-w-30',
                  gradoActual?.c_grad === g.c_grad
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-gray-600'
                ]"
              >
                <span class="font-bold text-sm">{{ g.l_grad }}</span>
                <span class="text-[10px] text-gray-400 mt-0.5">
                  {{ g.aulas.length }} aula{{ g.aulas.length !== 1 ? 's' : '' }}
                </span>
              </button>
            </div>
          </div>

          <!-- PASO 2: Aulas -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="gradoActual !== null && gradoActual.aulas.length > 1">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {{ gradosAulas.length > 1 ? '2' : '1' }}
                </span>
                Salón — {{ gradoActual.l_grad }}
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="a in aulasDelGrado"
                  :key="a.c_aula"
                  @click="seleccionarAula(a)"
                  :class="[
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-150',
                    aulaActual?.c_aula === a.c_aula
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-gray-600'
                  ]"
                >
                  <HomeIcon class="w-4 h-4 shrink-0" />
                  <span class="font-semibold text-sm">{{ a.l_aula }}</span>
                  <span
                    v-if="a.l_desc"
                    :class="['text-[10px] truncate max-w-20', aulaActual?.c_aula === a.c_aula ? 'text-white/70' : 'text-gray-400']"
                  >
                    {{ a.l_desc }}
                  </span>
                </button>
              </div>
            </div>
          </Transition>

        </template>

        <!-- Confirmación docente -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-if="aulaStore.seleccionCompleta"
            class="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
          >
            <CheckCircleIcon class="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <h1 class="text-xs font-bold text-emerald-600">{{ aulaStore.contextoActual }}</h1>
            </div>
            <button
              v-if="tieneOpciones"
              @click="resetearSeleccion"
              class="ml-auto text-[10px] text-emerald-500 hover:text-emerald-700 underline transition"
            >
              Cambiar
            </button>
          </div>
        </Transition>
      </div>
    </div>


    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <BookOpenIcon class="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-gray-800">Tu aula asignada</h2>
          <p class="text-xs text-gray-400">Este es tu espacio de aprendizaje</p>
        </div>
      </div>

      <!-- Loading alumno -->
      <div v-if="loadingAlumno" class="flex items-center gap-3 py-6 justify-center text-gray-400 text-sm">
        <ArrowPathIcon class="w-5 h-5 animate-spin" />
        Cargando tu información…
      </div>

      <!-- Error alumno -->
      <div v-else-if="errorAlumno" class="flex items-center gap-3 py-4 bg-red-50 rounded-xl px-4 text-red-600 text-sm">
        <ExclamationTriangleIcon class="w-5 h-5 shrink-0" />
        {{ errorAlumno }}
        <button @click="cargarAulaAlumno" class="ml-auto underline text-xs">Reintentar</button>
      </div>

      <!-- Sin aula -->
      <div v-else-if="!aulaStore.seleccionCompleta" class="py-8 text-center text-gray-400 text-sm">
        <BookOpenIcon class="w-10 h-10 mx-auto mb-2 opacity-30" />
        Aún no tienes un aula asignada.
      </div>

      <!-- Info del aula (solo lectura) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Grado -->
        <div class="flex items-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow">
            <AcademicCapIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-blue-400 uppercase tracking-widest font-semibold mb-0.5">Grado</p>
            <p class="text-sm font-bold text-blue-800">{{ aulaStore.gradoActual?.l_grad }}</p>
            <p v-if="aulaStore.gradoActual?.l_desc" class="text-xs text-blue-400 mt-0.5">
              {{ aulaStore.gradoActual.l_desc }}
            </p>
          </div>
        </div>

        <!-- Salón -->
        <div class="flex items-center gap-4 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0 shadow">
            <HomeIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold mb-0.5">Salón</p>
            <p class="text-sm font-bold text-indigo-800">{{ aulaStore.aulaActual?.l_aula }}</p>
            <p v-if="aulaStore.aulaActual?.l_desc" class="text-xs text-indigo-400 mt-0.5">
              {{ aulaStore.aulaActual.l_desc }}
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAulaStore } from '~/stores/aula'
import { useGradosAulas } from '~/composable/docente/useGradosAulas'
import { useAulaAlumno } from '~/composable/alumno/useAulaAlumno'
import type { GradoConAulas } from '~/services/docente/obtenerGradoAulas'

import {
  AcademicCapIcon,
  HomeIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const authStore = useAuthStore()
const aulaStore  = useAulaStore()

// Rol 
const esDocente = computed(() => authStore.perfil?.rol?.l_rol === 'Docente')

// Composable Docente 
const {
  gradosAulas,
  gradoActual,
  aulaActual,
  aulasDelGrado,
  loading:   loadingDocente,
  error:     errorDocente,
  cargarGradosAulas,
  seleccionarGrado,
  seleccionarAula,
} = useGradosAulas()

// Composable Alumno 
const {
  loading: loadingAlumno,
  error:   errorAlumno,
  cargarAulaAlumno,
} = useAulaAlumno()

// Avatar 
const inicialNombre = computed(() =>
  authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
)

// Opciones docente 
const tieneOpciones = computed((): boolean => {
  const lista = gradosAulas.value
  if (lista.length > 1) return true
  if (lista.length === 1 && (lista[0] as GradoConAulas).aulas.length > 1) return true
  return false
})

watch(gradosAulas, (lista: GradoConAulas[]) => {
  if (lista.length === 1 && lista.length > 0) {
    const grado = lista[0] as GradoConAulas
    if (grado.aulas.length === 1) {
      const aula = grado.aulas[0] as { c_aula: string; l_aula: string; l_desc: string | null }
      seleccionarGrado(grado)
      seleccionarAula(aula)
    }
  }
}, { immediate: true })

function resetearSeleccion(): void {
  const gradoActivo: GradoConAulas | null = aulaStore.gradoActual
  if (gradoActivo) {
    aulaStore.seleccionarGrado(gradoActivo)
  }
}

//  Carga según rol 
onMounted(() => {
  if (esDocente.value) {
    cargarGradosAulas()
  } else {
    cargarAulaAlumno()
  }
})
</script>