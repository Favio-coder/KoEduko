<template>
  <div class="space-y-6">

    <!-- ══════════════════════════════════════════ -->
    <!-- BIENVENIDA                                -->
    <!-- ══════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl shadow p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 lg:gap-4">
        <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-xl lg:text-2xl font-bold shrink-0">
          {{ inicialNombre }}
        </div>
        <div class="min-w-0">
          <h1 class="text-lg lg:text-2xl font-bold text-[#264e49] truncate">
            Bienvenido, {{ authStore.user?.nombre }}
          </h1>
          <p class="text-xs lg:text-sm text-gray-500 truncate">{{ authStore.perfil?.instieducativo?.l_col }}</p>
        </div>
      </div>

      <div v-if="esDocente" class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button @click="abrirEmparejamiento"
          class="group relative flex-1 sm:flex-none px-4 lg:px-5 py-2 lg:py-2.5 bg-linear-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-semibold text-xs lg:text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div class="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div class="relative flex items-center gap-1.5 lg:gap-2 justify-center">
            <SparklesIcon class="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Herramienta IA</span>
          </div>
        </button>

        <button @click="refreshData"
          class="group relative flex-1 sm:flex-none px-4 lg:px-5 py-2 lg:py-2.5 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl text-white font-semibold text-xs lg:text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div class="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div class="relative flex items-center gap-1.5 lg:gap-2 justify-center">
            <ArrowPathIcon class="w-4 h-4 lg:w-5 lg:h-5" :class="{ 'animate-spin': cargandoBI }" />
            <span>Actualizar</span>
          </div>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- INFO PERSONAL                             -->
    <!-- ══════════════════════════════════════════ -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Nombre completo</p>
        <p class="text-gray-800 font-semibold text-xs lg:text-sm truncate">
          {{ authStore.perfil?.l_nom }} {{ authStore.perfil?.l_apellp }} {{ authStore.perfil?.l_apellm }}
        </p>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Rol</p>
        <span :class="['inline-block text-xs font-semibold px-3 py-1 rounded-full', esDocente ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700']">
          {{ authStore.perfil?.rol?.l_rol }}
        </span>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Institución</p>
        <p class="text-gray-800 font-semibold text-xs lg:text-sm truncate">{{ authStore.perfil?.instieducativo?.l_col }}</p>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- VISTA ESTUDIANTE                          -->
    <!-- ══════════════════════════════════════════ -->
    <div v-if="!esDocente" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <BookOpenIcon class="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-gray-800">Tu aula asignada</h2>
          <p class="text-xs text-gray-400">Este es tu espacio de aprendizaje</p>
        </div>
      </div>

      <div v-if="loadingAlumno" class="flex items-center gap-3 py-6 justify-center text-gray-400 text-sm">
        <ArrowPathIcon class="w-5 h-5 animate-spin" /> Cargando tu información…
      </div>

      <div v-else-if="errorAlumno" class="flex items-center gap-3 py-4 bg-red-50 rounded-xl px-4 text-red-600 text-sm">
        <ExclamationTriangleIcon class="w-5 h-5 shrink-0" /> {{ errorAlumno }}
        <button @click="cargarAulaAlumno" class="ml-auto underline text-xs">Reintentar</button>
      </div>

      <div v-else-if="!aulaStore.seleccionCompleta" class="py-8 text-center text-gray-400 text-sm">
        <BookOpenIcon class="w-10 h-10 mx-auto mb-2 opacity-30" /> Aún no tienes un aula asignada.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex items-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow">
            <AcademicCapIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-blue-400 uppercase tracking-widest font-semibold mb-0.5">Grado</p>
            <p class="text-sm font-bold text-blue-800">{{ aulaStore.gradoActual?.l_grad }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <div class="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0 shadow">
            <HomeIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold mb-0.5">Salón</p>
            <p class="text-sm font-bold text-indigo-800">{{ aulaStore.aulaActual?.l_aula }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- VISTA DOCENTE: SELECTOR GRADO/AULA         -->
    <!-- ══════════════════════════════════════════ -->
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

      <div v-if="loadingDocente" class="flex items-center gap-3 py-6 justify-center text-gray-400 text-sm">
        <ArrowPathIcon class="w-5 h-5 animate-spin" /> Cargando grados y aulas…
      </div>

      <div v-else-if="errorDocente" class="flex items-center gap-3 py-4 bg-red-50 rounded-xl px-4 text-red-600 text-sm">
        <ExclamationTriangleIcon class="w-5 h-5 shrink-0" /> {{ errorDocente }}
        <button @click="cargarGradosAulas" class="ml-auto underline text-xs">Reintentar</button>
      </div>

      <div v-else-if="gradosAulas.length === 0" class="py-8 text-center text-gray-400 text-sm">
        <AcademicCapIcon class="w-10 h-10 mx-auto mb-2 opacity-30" /> No tienes grados asignados aún.
      </div>

      <div v-else class="space-y-5">
        <template v-if="tieneOpciones">
          <div v-if="gradosAulas.length > 1">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">1</span>
              Grado
            </p>
            <div class="flex flex-wrap gap-2">
              <button v-for="g in gradosAulas" :key="g.c_grad" @click="seleccionarGrado(g)"
                :class="['flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 min-w-30',
                  gradoActual?.c_grad === g.c_grad
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-gray-600']">
                <span class="font-bold text-sm">{{ g.l_grad }}</span>
                <span class="text-[10px] text-gray-400 mt-0.5">{{ g.aulas.length }} aula{{ g.aulas.length !== 1 ? 's' : '' }}</span>
              </button>
            </div>
          </div>

          <div v-if="gradoActual !== null && gradoActual.aulas.length > 1">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                {{ gradosAulas.length > 1 ? '2' : '1' }}
              </span>
              Salón — {{ gradoActual.l_grad }}
            </p>
            <div class="flex flex-wrap gap-2">
              <button v-for="a in aulasDelGrado" :key="a.c_aula" @click="seleccionarAula(a)"
                :class="['flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-150',
                  aulaActual?.c_aula === a.c_aula
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-gray-600']">
                <HomeIcon class="w-4 h-4 shrink-0" />
                <span class="font-semibold text-sm">{{ a.l_aula }}</span>
              </button>
            </div>
          </div>
        </template>

        <div v-if="aulaStore.seleccionCompleta"
          class="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircleIcon class="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <h1 class="text-xs font-bold text-emerald-600">{{ aulaStore.contextoActual }}</h1>
          </div>
          <button v-if="tieneOpciones" @click="resetearSeleccion"
            class="ml-auto text-[10px] text-emerald-500 hover:text-emerald-700 underline transition">Cambiar</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- MÉTRICAS RÁPIDAS (DOCENTE, AULA SELEC.)   -->
    <!-- ══════════════════════════════════════════ -->
    <div v-if="esDocente && aulaStore.seleccionCompleta">

      <!-- Quick actions -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NuxtLink to="/estudiantes"
          class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
            <UsersIcon class="w-5 h-5 text-blue-500" />
          </div>
          <span class="text-xs font-semibold text-gray-600 group-hover:text-gray-800">Estudiantes</span>
          <span class="text-[10px] text-gray-400 -mt-1">Gestionar notas</span>
        </NuxtLink>
        <NuxtLink to="/curso"
          class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
            <BookOpenIcon class="w-5 h-5 text-emerald-500" />
          </div>
          <span class="text-xs font-semibold text-gray-600 group-hover:text-gray-800">Cursos</span>
          <span class="text-[10px] text-gray-400 -mt-1">Crear sesiones</span>
        </NuxtLink>
        <NuxtLink to="/salas"
          class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
          <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition">
            <VideoCameraIcon class="w-5 h-5 text-violet-500" />
          </div>
          <span class="text-xs font-semibold text-gray-600 group-hover:text-gray-800">Salas</span>
          <span class="text-[10px] text-gray-400 -mt-1">Reuniones virtuales</span>
        </NuxtLink>
        <NuxtLink to="/emparejamiento"
          class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition">
            <BoltIcon class="w-5 h-5 text-amber-500" />
          </div>
          <span class="text-xs font-semibold text-gray-600 group-hover:text-gray-800">IA</span>
          <span class="text-[10px] text-gray-400 -mt-1">Emparejar alumnos</span>
        </NuxtLink>
      </div>

      <!-- ── KPI CARDS ── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-xs uppercase tracking-wider">Total Alumnos</p>
              <p class="text-3xl font-bold mt-1">{{ metricasBI.totalAlumnos }}</p>
            </div>
            <AcademicCapIcon class="w-10 h-10 text-blue-200 opacity-75" />
          </div>
        </div>

        <div class="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-100 text-xs uppercase tracking-wider">Promedio General</p>
              <p class="text-3xl font-bold mt-1">{{ metricasBI.promedioGeneral }}</p>
            </div>
            <ChartBarIcon class="w-10 h-10 text-emerald-200 opacity-75" />
          </div>
        </div>

        <div class="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-xs uppercase tracking-wider">Tasa Aprobación</p>
              <p class="text-3xl font-bold mt-1">{{ metricasBI.tasaAprobacion }}%</p>
            </div>
            <svg class="w-10 h-10 text-orange-200 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <div class="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-xs uppercase tracking-wider">Mejor Estudiante</p>
              <p class="text-sm font-bold mt-1 truncate">{{ metricasBI.mejorRendimiento }}</p>
            </div>
            <SparklesIcon class="w-10 h-10 text-purple-200 opacity-75" />
          </div>
        </div>
      </div>

      <!-- ── CHARTS GRID ── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
            <ChartBarIcon class="w-4 h-4 text-emerald-500" /> Rendimiento por Alumno
          </h3>
          <canvas ref="rendimientoChartRef"></canvas>
          <div v-if="metricasBI.datosRendimiento.length === 0 && !cargandoBI"
            class="text-center text-gray-400 text-xs py-6">Sin datos de rendimiento aún.</div>
        </div>

        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
            <ChartBarIcon class="w-4 h-4 text-orange-500" /> Distribución de Notas
          </h3>
          <canvas ref="distribucionChartRef"></canvas>
          <div v-if="metricasBI.distribucionNotas.every(v => v === 0) && !cargandoBI"
            class="text-center text-gray-400 text-xs py-6">Sin notas registradas aún.</div>
        </div>

        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
            <ChartBarIcon class="w-4 h-4 text-blue-500" /> Promedios por Curso
          </h3>
          <canvas ref="cursosChartRef"></canvas>
          <div v-if="metricasBI.promediosCursos.length === 0 && !cargandoBI"
            class="text-center text-gray-400 text-xs py-6">Sin datos de cursos aún.</div>
        </div>

        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
            <ChartBarIcon class="w-4 h-4 text-purple-500" /> Resumen General
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-50 rounded-xl p-3 text-center">
              <p class="text-lg sm:text-xl font-bold text-blue-600">{{ metricasBI.totalAlumnos }}</p>
              <p class="text-[10px] text-gray-500">Alumnos</p>
            </div>
            <div class="bg-emerald-50 rounded-xl p-3 text-center">
              <p class="text-lg sm:text-xl font-bold text-emerald-600">{{ metricasBI.promedioGeneral }}</p>
              <p class="text-[10px] text-gray-500">Promedio</p>
            </div>
            <div class="bg-orange-50 rounded-xl p-3 text-center">
              <p class="text-lg sm:text-xl font-bold text-orange-600">{{ metricasBI.tasaAprobacion }}%</p>
              <p class="text-[10px] text-gray-500">Aprobación</p>
            </div>
            <div class="bg-purple-50 rounded-xl p-3 text-center">
              <p class="text-xs sm:text-sm font-bold text-purple-600 truncate">{{ metricasBI.mejorRendimiento }}</p>
              <p class="text-[10px] text-gray-500">Mejor</p>
            </div>
          </div>
          <div class="mt-4 overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 text-left text-xs font-semibold text-gray-600">Métrica</th>
                  <th class="p-2 text-right text-xs font-semibold text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td class="p-2 text-xs text-gray-600">Total Alumnos</td>
                  <td class="p-2 text-right font-semibold text-xs">{{ metricasBI.totalAlumnos }}</td>
                </tr>
                <tr class="border-b">
                  <td class="p-2 text-xs text-gray-600">Promedio General</td>
                  <td class="p-2 text-right font-semibold text-xs">{{ metricasBI.promedioGeneral }}</td>
                </tr>
                <tr class="border-b">
                  <td class="p-2 text-xs text-gray-600">Tasa de Aprobación</td>
                  <td class="p-2 text-right font-semibold text-xs">{{ metricasBI.tasaAprobacion }}%</td>
                </tr>
                <tr>
                  <td class="p-2 text-xs text-gray-600">Mejor Rendimiento</td>
                  <td class="p-2 text-right font-semibold text-xs text-green-600">{{ metricasBI.mejorRendimiento }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── ACTIVIDAD RECIENTE + CURSOS DESTACADOS ── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <ClockIcon class="w-5 h-5 text-gray-400" />
              <h2 class="font-semibold text-gray-700">Actividad Reciente</h2>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">{{ metricasBI.totalAlumnos }} alumnos en el aula</p>
                <p class="text-xs text-gray-400">Ahora</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">Promedio general: {{ metricasBI.promedioGeneral }}</p>
                <p class="text-xs text-gray-400">Ahora</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">Mejor rendimiento: {{ metricasBI.mejorRendimiento }}</p>
                <p class="text-xs text-gray-400">Ahora</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BookOpenIcon class="w-5 h-5 text-emerald-500" />
            Cursos Destacados
          </h2>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="curso in cursosDestacados" :key="curso.nombre"
              class="bg-linear-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-gray-800">{{ curso.nombre }}</h3>
                <span class="text-xs px-2 py-1 rounded-full"
                  :class="curso.promedio >= 14 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  Prom: {{ curso.promedio }}
                </span>
              </div>
              <p class="text-xs text-gray-400">{{ curso.alumnos }} alumnos</p>
              <div class="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500 transition-all"
                  :style="{ width: `${(curso.promedio / 20) * 100}%` }"></div>
              </div>
            </div>
            <div v-if="cursosDestacados.length === 0" class="text-center text-gray-400 text-sm py-4">
              <BookOpenIcon class="w-8 h-8 mx-auto mb-2 opacity-30" /> Sin cursos destacados.
            </div>
          </div>
        </div>
      </div>

      <!-- ── FOOTER METRICS BAR ── -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>{{ metricasBI.totalAlumnos }} alumnos · Prom {{ metricasBI.promedioGeneral }} · {{ metricasBI.tasaAprobacion }}% aprobación</span>
        <span class="text-[10px] text-gray-400">Actualizado: {{ ultimaActualizacion }}</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
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
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  VideoCameraIcon,
  BoltIcon,
} from '@heroicons/vue/24/outline'

import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const authStore = useAuthStore()
const aulaStore = useAulaStore()
const router = useRouter()

const cargandoBI = ref(false)
const ultimaActualizacion = ref('—')

const rendimientoChartRef = ref<HTMLCanvasElement | null>(null)
const distribucionChartRef = ref<HTMLCanvasElement | null>(null)
const cursosChartRef = ref<HTMLCanvasElement | null>(null)

let rendimientoChart: Chart | null = null
let distribucionChart: Chart | null = null
let cursosChart: Chart | null = null

const metricasBI = ref({
  totalAlumnos: 0,
  promedioGeneral: 0,
  tasaAprobacion: 0,
  mejorRendimiento: '',
  datosRendimiento: [] as { nombre: string; promedio: number }[],
  distribucionNotas: [0, 0, 0, 0] as number[],
  promediosCursos: [] as { curso: string; promedio: number; alumnos: number }[]
})

const cursosDestacados = computed(() => {
  const cursos = metricasBI.value.promediosCursos || []
  return cursos
    .map(curso => ({ nombre: curso.curso, promedio: curso.promedio, alumnos: curso.alumnos || metricasBI.value.totalAlumnos }))
    .sort((a, b) => b.promedio - a.promedio)
    .slice(0, 2)
})

const esDocente = computed(() => authStore.perfil?.rol?.l_rol === 'Docente')

const {
  gradosAulas, gradoActual, aulaActual, aulasDelGrado,
  loading: loadingDocente, error: errorDocente,
  cargarGradosAulas, seleccionarGrado, seleccionarAula,
} = useGradosAulas()

const {
  loading: loadingAlumno, error: errorAlumno, cargarAulaAlumno,
} = useAulaAlumno()

const inicialNombre = computed(() =>
  authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
)

const tieneOpciones = computed((): boolean => {
  const lista = gradosAulas.value
  if (lista.length > 1) return true
  if (lista.length === 1 && (lista[0] as GradoConAulas).aulas.length > 1) return true
  return false
})

const abrirEmparejamiento = () => {
  if (esDocente.value) router.push('/emparejamiento')
}

const refreshData = () => cargarMetricasBI()

const renderizarGraficos = () => {
  if (rendimientoChart) { rendimientoChart.destroy(); rendimientoChart = null }
  if (distribucionChart) { distribucionChart.destroy(); distribucionChart = null }
  if (cursosChart) { cursosChart.destroy(); cursosChart = null }

  if (rendimientoChartRef.value && metricasBI.value.datosRendimiento?.length) {
    rendimientoChart = new Chart(rendimientoChartRef.value, {
      type: 'bar',
      data: {
        labels: metricasBI.value.datosRendimiento.map((d: any) => d.nombre),
        datasets: [{
          label: 'Promedio',
          data: metricasBI.value.datosRendimiento.map((d: any) => d.promedio),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    })
  }

  if (distribucionChartRef.value && metricasBI.value.distribucionNotas?.length) {
    const total = metricasBI.value.distribucionNotas.reduce((a: number, b: number) => a + b, 0)
    distribucionChart = new Chart(distribucionChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['Excelente (18-20)', 'Bueno (14-17)', 'Regular (11-13)', 'Bajo (0-10)'],
        datasets: [{
          data: total > 0 ? metricasBI.value.distribucionNotas : [1],
          backgroundColor: total > 0 ? ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'] : ['#e5e7eb']
        }]
      },
      options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 10 } } } } }
    })
  }

  if (cursosChartRef.value && metricasBI.value.promediosCursos?.length) {
    cursosChart = new Chart(cursosChartRef.value, {
      type: 'line',
      data: {
        labels: metricasBI.value.promediosCursos.map((c: any) => c.curso),
        datasets: [{
          label: 'Promedio',
          data: metricasBI.value.promediosCursos.map((c: any) => c.promedio),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    })
  }
}

const cargarMetricasBI = async () => {
  cargandoBI.value = true
  try {
    const { $supabase } = useNuxtApp()

    if (!esDocente.value || !aulaStore.aulaActual?.c_aula) {
      cargandoBI.value = false
      return
    }

    const { data: cursosAula, error: errCursos } = await $supabase
      .schema('core')
      .from('curso')
      .select('c_curso, l_curso')
      .eq('c_aula', aulaStore.aulaActual.c_aula)

    if (errCursos) {
      console.error('Error fetching cursos:', errCursos)
      cargandoBI.value = false
      return
    }
    const cursos = cursosAula ?? []

    let totalAlumnos = 0
    let sumaPromedios = 0
    let totalAprobados = 0
    let totalEvaluados = 0
    let mejorEstudiante = ''
    let mejorPromedio = 0
    const datosRendimiento: { nombre: string; promedio: number }[] = []
    const distribucionNotas = [0, 0, 0, 0]
    const promediosCursos: { curso: string; promedio: number; alumnos: number }[] = []

    for (const curso of cursos) {
      try {
        const resultado = await $supabase
          .schema('core')
          .rpc('gestionar_atributos', { accion: 'obtener', p_c_curso: curso.c_curso })

        const rpcData: any = resultado.data
        if (!rpcData?.ok || !rpcData?.data) {
          console.warn(`gestionar_atributos for ${curso.l_curso} returned:`, rpcData)
          continue
        }

        const estudiantesCurso = rpcData.data as any[]
        let sumaCurso = 0
        let countCurso = 0

        for (const est of estudiantesCurso) {
          totalAlumnos++

          const notas = est.notas as Record<string, number | null> | null
          if (notas) {
            const valores = Object.values(notas).filter((v): v is number => v != null)
            if (valores.length > 0) {
              const prom = valores.reduce((a, b) => a + b, 0) / valores.length
              const redondeado = Math.round(prom * 10) / 10

              sumaCurso += redondeado
              countCurso++

              datosRendimiento.push({ nombre: est.nombre_completo ?? est.c_usua, promedio: redondeado })

              if (redondeado >= 18) distribucionNotas[0]++
              else if (redondeado >= 14) distribucionNotas[1]++
              else if (redondeado >= 11) distribucionNotas[2]++
              else distribucionNotas[3]++

              if (redondeado >= 11) totalAprobados++
              totalEvaluados++

              if (redondeado > mejorPromedio) {
                mejorPromedio = redondeado
                mejorEstudiante = est.nombre_completo ?? ''
              }
            }
          }
        }

        if (countCurso > 0) {
          const promCurso = Math.round((sumaCurso / countCurso) * 10) / 10
          sumaPromedios += promCurso
          promediosCursos.push({
            curso: curso.l_curso,
            promedio: promCurso,
            alumnos: countCurso,
          })
        }
      } catch (e) {
        console.error(`Error processing curso ${curso.l_curso}:`, e)
      }
    }

    const promedioGeneralVal = totalAlumnos > 0
      ? Math.round((sumaPromedios / Math.max(promediosCursos.length, 1)) * 10) / 10
      : 0

    metricasBI.value = {
      totalAlumnos,
      promedioGeneral: promedioGeneralVal,
      tasaAprobacion: totalEvaluados > 0 ? Math.round((totalAprobados / totalEvaluados) * 100) : 0,
      mejorRendimiento: mejorEstudiante || '—',
      datosRendimiento,
      distribucionNotas: distribucionNotas as [number, number, number, number],
      promediosCursos,
    }

    ultimaActualizacion.value = new Date().toLocaleTimeString()
    await nextTick()
    renderizarGraficos()
  } catch (error) {
    console.error("Error cargando métricas BI:", error)
  } finally {
    cargandoBI.value = false
  }
}

watch(gradosAulas, (lista: GradoConAulas[]) => {
  if (lista && lista.length === 1 && lista[0]) {
    const grado = lista[0]
    if (grado.aulas && grado.aulas.length === 1 && grado.aulas[0]) {
      seleccionarGrado(grado)
      seleccionarAula(grado.aulas[0])
    }
  }
}, { immediate: true })

watch(aulaActual, (nuevoAula) => {
  if (nuevoAula && nuevoAula.c_aula) {
    cargarMetricasBI()
  }
})

function resetearSeleccion(): void {
  const gradoActivo: GradoConAulas | null = aulaStore.gradoActual
  if (gradoActivo) aulaStore.seleccionarGrado(gradoActivo)
}

onMounted(() => {
  if (esDocente.value) {
    cargarGradosAulas()
  } else {
    cargarAulaAlumno()
  }
  if (aulaActual.value?.c_aula) {
    cargarMetricasBI()
  }
})
</script>
