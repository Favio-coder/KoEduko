<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="bg-white rounded-2xl shadow-sm p-4 lg:p-6 flex items-center gap-3 lg:gap-4">
      <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#2f4f4f] flex items-center justify-center shrink-0">
        <span class="text-white text-xl lg:text-2xl font-bold">{{ inicialNombre }}</span>
      </div>
      <div class="min-w-0">
        <h1 class="text-lg lg:text-xl font-bold text-[#264e49] truncate flex items-center gap-2">
          <ClipboardDocumentListIcon class="w-5 h-5 text-[#264e49]/60" />
          {{ esDocente ? 'Actividades' : 'Mis Actividades' }}
        </h1>
        <p class="text-xs lg:text-sm text-gray-500 truncate">{{ authStore.perfil?.instieducativo?.l_col }}</p>
        <p class="text-[10px] lg:text-xs text-gray-400 mt-0.5 truncate">{{ aulaStore.contextoActual || 'Selecciona un aula' }}</p>
      </div>
    </div>

    <!-- Selector de curso -->
    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div class="relative w-full sm:w-80">
        <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <BookOpenIcon class="w-4 h-4 text-gray-400" />
        </div>
        <select
          v-model="cursoSeleccionadoId"
          class="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition cursor-pointer"
        >
          <option value="">Selecciona un curso</option>
          <option v-for="curso in cursos" :key="curso.c_curso" :value="curso.c_curso">
            {{ curso.l_curso }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      <button
        v-if="esDocente && cursoSeleccionadoId"
        @click="mostrarCrearActividad"
        class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition"
      >
        <PlusIcon class="w-4 h-4" />
        Nueva Actividad
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && actividades.length === 0" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p class="text-sm text-gray-500 mt-4">Cargando actividades...</p>
    </div>

    <!-- Sin curso -->
    <div v-else-if="!cursoSeleccionadoId" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <ClipboardDocumentListIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Selecciona un curso</p>
      <p class="text-gray-400 text-xs mt-1">Elige un curso para ver sus actividades</p>
    </div>

    <!-- Sin actividades -->
    <div v-else-if="actividades.length === 0 && !loading" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <ClipboardDocumentListIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">Sin actividades</p>
      <p class="text-gray-400 text-xs mt-1">Este curso aún no tiene actividades creadas</p>
    </div>

    <!-- VISTA DOCENTE -->
    <template v-else-if="esDocente">
      <!-- KPIs -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <ClipboardDocumentListIcon class="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actividades</p>
            <p class="text-lg font-bold text-gray-800">{{ actividades.length }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <CheckCircleIcon class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Abiertas</p>
            <p class="text-lg font-bold text-gray-800">{{ actividades.filter(a => a.estado === 'abierta').length }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <AcademicCapIcon class="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Entregas</p>
            <p class="text-lg font-bold text-gray-800">{{ totalEntregas }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <ChartBarSquareIcon class="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Promedio</p>
            <p class="text-lg font-bold text-gray-800">{{ promedioGeneral ?? '—' }}</p>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Lista de actividades -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <ClipboardDocumentListIcon class="w-4 h-4 text-gray-500" />
              Actividades del curso
            </h3>
          </div>
          <div class="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            <div
              v-for="act in actividades"
              :key="act.c_actividad"
              @click="actividadSeleccionada = act"
              :class="[
                'p-4 cursor-pointer transition-colors',
                actividadSeleccionada?.c_actividad === act.c_actividad ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ act.l_nombre }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    <span class="inline-flex items-center gap-1">
                      <span :class="['w-2 h-2 rounded-full', act.estado === 'abierta' ? 'bg-emerald-500' : 'bg-red-500']" />
                      {{ act.estado === 'abierta' ? 'Abierta' : 'Cerrada' }}
                    </span>
                    · {{ act.puntaje_max }} pts
                    · {{ act.atributos?.length ?? 0 }} atributo(s)
                  </p>
                  <p v-if="act.f_fin" class="text-xs text-gray-400 flex items-center gap-1">
                    <CalendarDaysIcon class="w-3 h-3" />
                    Entrega: {{ formatDate(act.f_fin) }}
                  </p>
                </div>
                <div class="flex items-center gap-1 shrink-0 ml-2">
                  <button @click.stop="mostrarEditarActividad(act)" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click.stop="confirmarEliminar(act)" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalle y calificación -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div v-if="!actividadSeleccionada" class="flex flex-col items-center justify-center py-20 text-gray-400">
            <ClipboardDocumentListIcon class="w-12 h-12 mb-3" />
            <p class="text-sm">Selecciona una actividad para calificar</p>
          </div>
          <template v-else>
            <div class="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-gray-700 truncate">{{ actividadSeleccionada.l_nombre }}</h3>
                <p class="text-xs text-gray-400 mt-0.5 truncate">{{ actividadSeleccionada.l_desc }}</p>
                <div class="flex gap-2 mt-1 flex-wrap">
                  <span
                    v-for="atr in actividadSeleccionada.atributos"
                    :key="atr.c_atributo"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium"
                  >
                    {{ atr.l_nombre_atributo ?? atr.c_atributo }} {{ atr.porcentaje }}%
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-if="tieneEntregas"
                  @click="descargarTodas"
                  title="Descargar todas las entregas"
                  class="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >
                  <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                  Todo
                </button>
                <button
                  @click="toggleEstadoActividad"
                  :class="[
                    'text-xs font-semibold px-3 py-1.5 rounded-lg transition',
                    actividadSeleccionada.estado === 'abierta'
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  ]"
                >
                  {{ actividadSeleccionada.estado === 'abierta' ? 'Cerrar' : 'Abrir' }}
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th class="text-left px-4 py-3 font-semibold">Estudiante</th>
                    <th class="text-center px-4 py-3 font-semibold">Entrega</th>
                    <th class="text-center px-4 py-3 font-semibold w-24">Nota</th>
                    <th class="text-left px-4 py-3 font-semibold">Observación</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="est in estudiantes" :key="est.c_usua">
                    <td class="px-4 py-3 text-gray-700 font-medium">{{ est.nombre_completo }}</td>
                    <td class="px-4 py-3 text-center">
                      <template v-if="entregasMap.has(est.c_usua)">
                        <button
                          @click="descargarArchivo(entregasMap.get(est.c_usua)?.l_url, entregasMap.get(est.c_usua)?.l_nombre_archivo)"
                          class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          :title="entregasMap.get(est.c_usua)?.l_nombre_archivo"
                        >
                          <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                          {{ entregasMap.get(est.c_usua)?.l_nombre_archivo?.slice(0, 20) ?? 'Descargar' }}
                        </button>
                      </template>
                      <span v-else class="text-xs text-gray-400">—</span>
                    </td>
                    <td class="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        :max="actividadSeleccionada.puntaje_max"
                        step="0.5"
                        :value="notasMap.get(est.c_usua) ?? ''"
                        @change="onNotaChange(est.c_usua, ($event.target as HTMLInputElement).value)"
                        placeholder="—"
                        class="w-20 text-center text-sm px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                      />
                    </td>
                    <td class="px-4 py-3">
                      <input
                        type="text"
                        :value="obsMap.get(est.c_usua) ?? ''"
                        @change="onObsChange(est.c_usua, ($event.target as HTMLInputElement).value)"
                        placeholder="Observación"
                        class="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- VISTA ESTUDIANTE -->
    <template v-else>
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Lista de actividades -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <ClipboardDocumentListIcon class="w-4 h-4 text-gray-500" />
              Mis Actividades
            </h3>
          </div>
          <div class="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            <div
              v-for="act in actividades"
              :key="act.c_actividad"
              @click="actividadSeleccionada = act"
              :class="[
                'p-4 cursor-pointer transition-colors',
                actividadSeleccionada?.c_actividad === act.c_actividad ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ act.l_nombre }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    <span class="inline-flex items-center gap-1">
                      <span :class="['w-2 h-2 rounded-full', act.estado === 'abierta' ? 'bg-emerald-500' : 'bg-red-500']" />
                      {{ act.estado === 'abierta' ? 'Abierta' : 'Cerrada' }}
                    </span>
                    · {{ act.puntaje_max }} pts
                  </p>
                  <p v-if="act.f_fin" class="text-xs text-gray-400 flex items-center gap-1">
                    <CalendarDaysIcon class="w-3 h-3" />
                    Entrega: {{ formatDate(act.f_fin) }}
                  </p>
                  <p class="text-xs mt-1">
                    <span v-if="misEntregasMap.has(act.c_actividad)" class="text-emerald-600 font-medium inline-flex items-center gap-1">
                      <CheckCircleIcon class="w-3.5 h-3.5" />
                      Entregado
                    </span>
                    <span v-else-if="act.estado === 'abierta'" class="text-amber-600 font-medium inline-flex items-center gap-1">
                      <ClockIcon class="w-3.5 h-3.5" />
                      Pendiente
                    </span>
                    <span v-else class="text-red-500 font-medium inline-flex items-center gap-1">
                      <XMarkIcon class="w-3.5 h-3.5" />
                      No entregado
                    </span>
                    <span v-if="misNotasMap.has(act.c_actividad)" class="ml-2 text-gray-600">
                      · Nota: <strong>{{ misNotasMap.get(act.c_actividad) }}</strong>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalle y entrega -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div v-if="!actividadSeleccionada" class="flex flex-col items-center justify-center py-20 text-gray-400">
            <ClipboardDocumentListIcon class="w-12 h-12 mb-3" />
            <p class="text-sm">Selecciona una actividad</p>
          </div>
          <template v-else>
            <div class="px-5 py-4 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-700">{{ actividadSeleccionada.l_nombre }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ actividadSeleccionada.l_desc || 'Sin descripción' }}</p>
              <p class="text-xs text-gray-400 mt-1">Puntaje máximo: {{ actividadSeleccionada.puntaje_max }} pts</p>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <span :class="['w-2 h-2 rounded-full', actividadSeleccionada.estado === 'abierta' ? 'bg-emerald-500' : 'bg-red-500']" />
                {{ actividadSeleccionada.estado === 'abierta' ? 'Abierta' : 'Cerrada' }}
              </p>
              <p v-if="actividadSeleccionada.f_fin" class="text-xs text-gray-400">Fecha límite: {{ formatDate(actividadSeleccionada.f_fin) }}</p>
              <div class="flex gap-2 mt-2 flex-wrap">
                <span
                  v-for="atr in actividadSeleccionada.atributos"
                  :key="atr.c_atributo"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium"
                >
                  {{ atr.l_nombre_atributo ?? atr.c_atributo }} {{ atr.porcentaje }}%
                </span>
              </div>
              <button
                v-if="actividadSeleccionada.archivo?.l_url"
                @click="descargarArchivo(actividadSeleccionada.archivo?.l_url ?? '', actividadSeleccionada.archivo?.l_nombre)"
                class="inline-flex items-center gap-1 mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                Descargar archivo adjunto
              </button>
            </div>

            <div class="p-5">
              <div v-if="actividadSeleccionada.estado === 'cerrada'" class="text-center py-8 text-gray-400">
                <LockClosedIcon class="w-10 h-10 mx-auto mb-2" />
                <p class="text-sm">Esta actividad está cerrada</p>
                <p v-if="notaEstudiante != null" class="mt-2 text-lg font-bold" :class="notaEstudiante >= 11 ? 'text-emerald-600' : 'text-red-500'">
                  Nota: {{ notaEstudiante.toFixed(1) }} / {{ actividadSeleccionada.puntaje_max }}
                </p>
              </div>

              <div v-else-if="misEntregasMap.has(actividadSeleccionada.c_actividad)" class="text-center py-6">
                <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <CheckIcon class="w-7 h-7 text-emerald-600" />
                </div>
                <p class="text-sm font-semibold text-gray-700">¡Actividad entregada!</p>
                <p class="text-xs text-gray-400 mt-1">
                  Archivo: {{ misEntregasMap.get(actividadSeleccionada.c_actividad)?.l_nombre_archivo }}
                </p>
                <button
                  v-if="misEntregasMap.get(actividadSeleccionada.c_actividad)?.l_url"
                  @click="descargarArchivo(
                    misEntregasMap.get(actividadSeleccionada.c_actividad)?.l_url,
                    misEntregasMap.get(actividadSeleccionada.c_actividad)?.l_nombre_archivo
                  )"
                  class="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                  Descargar mi entrega
                </button>
                <p v-if="notaEstudiante != null" class="mt-3 text-lg font-bold" :class="notaEstudiante >= 11 ? 'text-emerald-600' : 'text-red-500'">
                  Nota: {{ notaEstudiante.toFixed(1) }} / {{ actividadSeleccionada.puntaje_max }}
                </p>
              </div>

              <div v-else class="space-y-4">
                <p class="text-sm font-semibold text-gray-700">Entregar actividad</p>
                <div>
                  <label class="text-xs text-gray-500 font-medium block mb-1">Descripción (opcional)</label>
                  <textarea
                    v-model="entregaDesc"
                    rows="2"
                    placeholder="Agrega un comentario a tu entrega..."
                    class="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 font-medium block mb-1">Archivo</label>
                  <input
                    type="file"
                    @change="onFileSelected"
                    class="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
                <button
                  @click="entregarAct"
                  :disabled="!archivoSeleccionado || subiendo"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
                >
                  <ArrowUpTrayIcon v-if="!subiendo" class="w-4 h-4" />
                  <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {{ subiendo ? 'Subiendo...' : 'Entregar Actividad' }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Resumen de notas del estudiante -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <AcademicCapIcon class="w-4 h-4 text-gray-500" />
            Mis calificaciones
          </h3>
        </div>
        <div class="p-4">
          <div v-if="actividades.length === 0" class="text-center py-6 text-sm text-gray-400">
            No hay actividades calificadas aún
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="act in actividades"
              :key="act.c_actividad"
              class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition"
            >
              <span class="text-sm text-gray-700 truncate mr-2">{{ act.l_nombre }}</span>
              <span
                v-if="misNotasMap.has(act.c_actividad)"
                class="text-sm font-bold shrink-0"
                :class="(misNotasMap.get(act.c_actividad) ?? 0) >= (act.puntaje_max * 0.6) ? 'text-emerald-600' : 'text-red-500'"
              >
                {{ misNotasMap.get(act.c_actividad)?.toFixed(1) }} / {{ act.puntaje_max }}
              </span>
              <span v-else class="text-xs text-gray-400 shrink-0">—</span>
            </div>
          </div>
          <div v-if="promedioAtributos.length > 0" class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs font-semibold text-gray-600 mb-2">Promedio por atributo</p>
            <div
              v-for="atr in promedioAtributos"
              :key="atr.c_atributo"
              class="flex items-center justify-between py-1.5 px-3"
            >
              <span class="text-xs text-gray-600">{{ atr.l_nombre }}</span>
              <span
                class="text-xs font-bold"
                :class="(atr.valor ?? 0) >= 11 ? 'text-emerald-600' : 'text-red-500'"
              >
                {{ atr.valor != null ? atr.valor.toFixed(1) : '—' }} / 20
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '#imports'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useListCursos } from '~/composable/curso/useListCursos'
import { withLoading } from '~/utils/withLoading'
import { useActividades } from '~/composable/actividades/useActividades'
import type { Actividad } from '~/types/actividad'
import { listarAtributos } from '~/services/atributos/listarAtributos'

import {
  BookOpenIcon, ChevronDownIcon,
  ClipboardDocumentListIcon,
  PlusIcon, PencilIcon, TrashIcon,
  ArrowDownTrayIcon, ArrowUpTrayIcon,
  LockClosedIcon, CheckIcon, CheckCircleIcon,
  XMarkIcon, ClockIcon, CalendarDaysIcon,
  AcademicCapIcon, ChartBarSquareIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { $supabase, $swal } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()
const cursoStore = useCursoStore()
const { listCursos } = useListCursos()
const { actividades, estudiantes, calificaciones, loading, loadActividades, loadEstudiantes, loadCalificaciones, create, update, remove, calificar, entregar } = useActividades()

const esDocente = computed(() => authStore.perfil?.rol?.l_rol === 'Docente')
const cursos = computed(() => cursoStore.cursos)

const cursoSeleccionadoId = ref('')
const actividadSeleccionada = ref<Actividad | null>(null)
const entregaDesc = ref('')
const archivoSeleccionado = ref<File | null>(null)
const subiendo = ref(false)

const inicialNombre = computed(() => {
  const nom = authStore.perfil?.l_nom ?? ''
  return nom.charAt(0).toUpperCase()
})

const notasMap = computed(() => {
  const m = new Map<string, number>()
  for (const c of calificaciones.value) {
    m.set(c.c_usua, c.nota)
  }
  return m
})

const obsMap = computed(() => {
  const m = new Map<string, string>()
  for (const c of calificaciones.value) {
    if (c.observacion) m.set(c.c_usua, c.observacion)
  }
  return m
})

const entregasMap = ref<Map<string, any>>(new Map())
const misEntregasMap = ref<Map<string, any>>(new Map())
const misNotasMap = ref<Map<string, number>>(new Map())

const tieneEntregas = computed(() => {
  if (!actividadSeleccionada.value) return false
  return estudiantes.value.some(e => entregasMap.value.has(e.c_usua))
})

const totalEntregas = computed(() => {
  if (!actividadSeleccionada.value) return 0
  return estudiantes.value.filter(e => entregasMap.value.has(e.c_usua)).length
})

const promedioGeneral = computed(() => {
  if (calificaciones.value.length === 0) return '—'
  const suma = calificaciones.value.reduce((s, c) => s + c.nota, 0)
  return (suma / calificaciones.value.length).toFixed(1)
})

const promedioAtributos = ref<{ c_atributo: string; l_nombre: string; valor: number | null }[]>([])

const notaEstudiante = computed(() => {
  if (!actividadSeleccionada.value) return null
  const c_usua = authStore.perfil?.c_instanceId
  if (!c_usua) return null
  const cal = calificaciones.value.find(
    c => c.c_actividad === actividadSeleccionada.value!.c_actividad && c.c_usua === c_usua
  )
  return cal?.nota ?? null
})

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function cargarEntregas() {
  if (!cursoSeleccionadoId.value) return
  const { data } = await $supabase
    .schema('core')
    .from('actividad_entrega')
    .select('*')
    .in('c_actividad', actividades.value.map(a => a.c_actividad))

  if (!data) return

  const m = new Map<string, any>()
  for (const e of data) {
    m.set(e.c_usua, e)
  }
  entregasMap.value = m

  if (!esDocente.value) {
    const c_usua = authStore.perfil?.c_instanceId
    const mm = new Map<string, any>()
    for (const e of data) {
      if (e.c_usua === c_usua) {
        mm.set(e.c_actividad, e)
      }
    }
    misEntregasMap.value = mm
  }
}

async function cargarNotasEstudiante() {
  if (esDocente.value) return
  if (!cursoSeleccionadoId.value) return
  const c_usua = authStore.perfil?.c_instanceId
  if (!c_usua) return

  const { data: acts } = await $supabase
    .schema('core')
    .from('actividad')
    .select('c_actividad')
    .eq('c_curso', cursoSeleccionadoId.value)

  if (!acts) return

  const { data: cal } = await $supabase
    .schema('core')
    .from('actividad_calificacion')
    .select('c_actividad, nota')
    .eq('c_usua', c_usua)
    .in('c_actividad', acts.map(a => a.c_actividad))

  if (cal) {
    const m = new Map<string, number>()
    for (const c of cal) {
      m.set(c.c_actividad, c.nota)
    }
    misNotasMap.value = m
  }

  const { data: atributosCurso } = await $supabase
    .schema('core')
    .from('atributo')
    .select('c_atributo, l_nombre')
    .eq('c_curso', cursoSeleccionadoId.value)

  if (atributosCurso) {
    const cAtributos = atributosCurso.map(a => a.c_atributo)
    const { data: valores } = await $supabase
      .schema('core')
      .from('valor_atributo')
      .select('c_atri, valor')
      .eq('c_usua', c_usua)
      .in('c_atri', cAtributos)

    const valorMap = new Map((valores ?? []).map(v => [v.c_atri, v.valor]))
    promedioAtributos.value = atributosCurso.map(a => ({
      c_atributo: a.c_atributo,
      l_nombre: a.l_nombre,
      valor: valorMap.get(a.c_atributo) ?? null,
    }))
  }
}

async function init(cursoId: string) {
  await loadActividades(cursoId)
  await loadEstudiantes(cursoId)
  await cargarEntregas()
  await cargarNotasEstudiante()
  if (actividades.value.length > 0) {
    actividadSeleccionada.value = actividades.value[0]
  }
}

watch(cursoSeleccionadoId, async (val) => {
  actividadSeleccionada.value = null
  if (val) {
    await init(val)
  }
})

watch(actividadSeleccionada, async (act) => {
  if (act && esDocente.value) {
    await loadCalificaciones(act.c_actividad)
  } else if (act && !esDocente.value) {
    await loadCalificaciones(act.c_actividad)
  }
})

function attrListHtml(
  atributos: any[],
  selected: { c_atributo: string; porcentaje: number }[] = []
): string {
  const usedIds = new Set(selected.map(s => s.c_atributo))
  const rows = selected.map((s, i) => `
    <div class="attr-row flex items-center gap-2 mb-2">
      <select class="attr-sel flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
        ${atributos.map(a => `<option value="${a.c_atributo}" ${a.c_atributo === s.c_atributo ? 'selected' : ''}>${a.l_nombre}</option>`).join('')}
      </select>
      <input type="number" class="attr-pct w-20 text-center border border-gray-300 rounded-lg px-1 py-1.5 text-sm" value="${s.porcentaje}" min="0" max="100" placeholder="%" />
      <button type="button" class="attr-remove text-red-500 hover:text-red-700 font-bold text-lg leading-none px-1">&times;</button>
    </div>
  `).join('')

  const selectOptions = atributos.map(a =>
    `<option value="${a.c_atributo}" ${usedIds.has(a.c_atributo) ? 'disabled' : ''}>${a.l_nombre}</option>`
  ).join('')

  return `
    <div id="attr-list">
      ${rows || '<p class="text-xs text-gray-400 mb-2">Aún no has agregado atributos</p>'}
    </div>
    <div class="flex items-center gap-2 mb-2">
      <select id="attr-new-sel" class="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
        ${selectOptions}
      </select>
      <button type="button" id="attr-add-btn" class="px-3 py-1.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition">+</button>
    </div>
    <p id="suma-pct" class="text-xs font-medium mt-1">Total: <span id="suma-valor">${selected.reduce((s, a) => s + a.porcentaje, 0)}</span>%</p>
  `
}

function initAttrEvents(onSuma?: (suma: number, totalOk: boolean) => void) {
  const container = document.getElementById('swal2-html-container') || document.body

  function reindexarOpciones() {
    const rows = container.querySelectorAll('.attr-row')
    const usedIds = new Set<string>()
    rows.forEach(row => {
      const sel = row.querySelector('.attr-sel') as HTMLSelectElement
      if (sel) usedIds.add(sel.value)
    })
    const mainSel = document.getElementById('attr-new-sel') as HTMLSelectElement
    if (!mainSel) return
    const currentMainVal = mainSel.value
    const allOpts = mainSel.querySelectorAll('option')
    let suma = 0
    allOpts.forEach(opt => {
      const val = opt.value
      if (val && usedIds.has(val)) {
        opt.disabled = true
      } else {
        opt.disabled = false
      }
    })
    if (mainSel.querySelector('option:not(:disabled)')) {
      if (mainSel.querySelector('option[value="' + currentMainVal + '"]:not(:disabled)')) {
        mainSel.value = currentMainVal
      } else {
        const firstAvail = mainSel.querySelector('option:not(:disabled)') as HTMLOptionElement
        if (firstAvail) mainSel.value = firstAvail.value
      }
    }
    rows.forEach(row => {
      const pct = parseFloat((row.querySelector('.attr-pct') as HTMLInputElement)?.value || '0')
      suma += pct
    })
    const sumaEl = document.getElementById('suma-valor')
    if (sumaEl) sumaEl.textContent = String(suma)
    const pctEl = document.getElementById('suma-pct')
    if (pctEl) {
      if (Math.abs(suma - 100) > 0.01) {
        pctEl.className = 'text-xs font-medium mt-1 text-red-500'
      } else {
        pctEl.className = 'text-xs font-medium mt-1 text-emerald-600'
      }
    }
    if (onSuma) onSuma(suma, Math.abs(suma - 100) <= 0.01)
  }

  const list = document.getElementById('attr-list')
  const addBtn = document.getElementById('attr-add-btn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const sel = document.getElementById('attr-new-sel') as HTMLSelectElement
      if (!sel || !sel.value) return
      const opt = sel.options[sel.selectedIndex]
      if (!opt || opt.disabled) return
      const newRow = document.createElement('div')
      newRow.className = 'attr-row flex items-center gap-2 mb-2'
      newRow.innerHTML = `
        <select class="attr-sel flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
          ${(document.getElementById('attr-new-sel') as HTMLSelectElement)?.innerHTML ?? ''}
        </select>
        <input type="number" class="attr-pct w-20 text-center border border-gray-300 rounded-lg px-1 py-1.5 text-sm" value="" min="0" max="100" placeholder="%" />
        <button type="button" class="attr-remove text-red-500 hover:text-red-700 font-bold text-lg leading-none px-1">&times;</button>
      `
      const nSel = newRow.querySelector('.attr-sel') as HTMLSelectElement
      nSel.value = sel.value
      reindexarOpciones()
      const emptyMsg = list?.querySelector('p.text-xs.text-gray-400')
      if (emptyMsg) emptyMsg.remove()
      newRow.querySelector('.attr-remove')?.addEventListener('click', () => {
        newRow.remove()
        reindexarOpciones()
      })
      newRow.querySelector('.attr-sel')?.addEventListener('change', () => reindexarOpciones())
      newRow.querySelector('.attr-pct')?.addEventListener('input', () => reindexarOpciones())
      list?.appendChild(newRow)
      reindexarOpciones()
    })
  }

  container.querySelectorAll('.attr-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = (btn as HTMLElement).closest('.attr-row')
      if (row) { row.remove(); reindexarOpciones() }
    })
  })
  container.querySelectorAll('.attr-sel').forEach(sel => {
    sel.addEventListener('change', () => reindexarOpciones())
  })
  container.querySelectorAll('.attr-pct').forEach(inp => {
    inp.addEventListener('input', () => reindexarOpciones())
  })

  reindexarOpciones()
}

function collectAttrData(): { c_atributo: string; porcentaje: number }[] {
  const container = document.getElementById('swal2-html-container') || document.body
  const rows = container.querySelectorAll('.attr-row')
  const result: { c_atributo: string; porcentaje: number }[] = []
  let suma = 0
  rows.forEach(row => {
    const sel = row.querySelector('.attr-sel') as HTMLSelectElement
    const pct = parseFloat((row.querySelector('.attr-pct') as HTMLInputElement)?.value || '0')
    if (sel && sel.value && pct > 0) {
      result.push({ c_atributo: sel.value, porcentaje: pct })
      suma += pct
    }
  })
  return result
}

function abrirModalActividad(
  titulo: string,
  btnTexto: string,
  prefill?: {
    l_nombre?: string
    l_desc?: string | null
    puntaje_max?: number
    f_inicio?: string | null
    f_fin?: string | null
    atributos?: { c_atributo: string; porcentaje: number }[]
  }
): Promise<{ nombre: string; desc: string | null; inicio: string | null; fin: string | null; puntaje: number; atributos: { c_atributo: string; porcentaje: number }[]; archivo: File | null } | null> {
  return new Promise(async (resolve) => {
    const atributos = await listarAtributos($supabase, cursoSeleccionadoId.value)
    if (atributos.length === 0) {
      await $swal.fire({ title: 'Sin atributos', text: 'Primero crea atributos de evaluación en "Atributos"', icon: 'warning' })
      resolve(null)
      return
    }

    const html = `
      <div class="space-y-3 text-left" style="max-height:70vh;overflow-y:auto;padding-right:4px">
        <div>
          <label class="text-xs font-medium text-gray-600">Nombre</label>
          <input id="act-nombre" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" placeholder="Ej: Quiz 1" value="${prefill?.l_nombre?.replace(/"/g, '&quot;') ?? ''}" />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">Descripción</label>
          <textarea id="act-desc" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" placeholder="Descripción" rows="2">${prefill?.l_desc?.replace(/"/g, '&quot;') ?? ''}</textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-medium text-gray-600">Fecha inicio</label>
            <input id="act-inicio" type="datetime-local" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" value="${prefill?.f_inicio ?? ''}" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Fecha fin</label>
            <input id="act-fin" type="datetime-local" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" value="${prefill?.f_fin ?? ''}" />
          </div>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">Puntaje máximo</label>
          <input id="act-puntaje" type="number" value="${prefill?.puntaje_max ?? 20}" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">Archivo adjunto (opcional)</label>
          <input id="act-archivo" type="file" class="w-full text-sm mt-1" />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 mb-1 block">Atributos a evaluar (debe sumar 100%)</label>
          <p class="text-[10px] text-gray-400 mb-2">Usa el botón <strong>+</strong> para agregar atributos.</p>
          <div class="border border-gray-200 rounded-lg p-3">
            ${attrListHtml(atributos, prefill?.atributos)}
          </div>
        </div>
      </div>
    `

    const { value: formValues, isDismissed } = await $swal.fire({
      title: titulo,
      html,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: btnTexto,
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        initAttrEvents()
      },
      preConfirm: () => {
        const nombre = (document.getElementById('act-nombre') as HTMLInputElement)?.value.trim()
        if (!nombre) { $swal.showValidationMessage('El nombre es obligatorio'); return false }

        const atributosSel = collectAttrData()
        if (atributosSel.length === 0) { $swal.showValidationMessage('Agrega al menos un atributo con %'); return false }
        const suma = atributosSel.reduce((s, a) => s + a.porcentaje, 0)
        if (Math.abs(suma - 100) > 0.01) { $swal.showValidationMessage(`Los porcentajes suman ${suma}%, debe ser 100%`); return false }

        return { nombre, atributos: atributosSel, valid: true }
      }
    })

    if (!formValues || isDismissed) { resolve(null); return }

    resolve({
      nombre: formValues.nombre,
      desc: (document.getElementById('act-desc') as HTMLTextAreaElement)?.value || null,
      inicio: (document.getElementById('act-inicio') as HTMLInputElement)?.value || null,
      fin: (document.getElementById('act-fin') as HTMLInputElement)?.value || null,
      puntaje: parseFloat((document.getElementById('act-puntaje') as HTMLInputElement)?.value || '20'),
      atributos: formValues.atributos,
      archivo: (document.getElementById('act-archivo') as HTMLInputElement)?.files?.[0] ?? null,
    })
  })
}

async function mostrarCrearActividad() {
  const data = await abrirModalActividad('Nueva Actividad', 'Crear')
  if (!data) return
  try {
    await create(cursoSeleccionadoId.value, {
      l_nombre: data.nombre,
      l_desc: data.desc,
      puntaje_max: data.puntaje,
      f_inicio: data.inicio,
      f_fin: data.fin,
      atributos: data.atributos,
      archivo: data.archivo,
    })
    await $swal.fire({ title: 'Creada', text: 'Actividad creada correctamente', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message, icon: 'error' })
  }
}

async function mostrarEditarActividad(act: Actividad) {
  const data = await abrirModalActividad('Editar Actividad', 'Guardar', {
    l_nombre: act.l_nombre,
    l_desc: act.l_desc,
    puntaje_max: act.puntaje_max,
    f_inicio: act.f_inicio,
    f_fin: act.f_fin,
    atributos: act.atributos?.map(a => ({ c_atributo: a.c_atributo, porcentaje: a.porcentaje })),
  })
  if (!data) return
  try {
    await update(act.c_actividad, {
      l_nombre: data.nombre,
      l_desc: data.desc,
      puntaje_max: data.puntaje,
      f_inicio: data.inicio,
      f_fin: data.fin,
      atributos: data.atributos,
      archivo: data.archivo,
    })
    await $swal.fire({ title: 'Actualizada', text: 'Actividad actualizada correctamente', icon: 'success', timer: 1500, showConfirmButton: false })
    await init(cursoSeleccionadoId.value)
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message, icon: 'error' })
  }
}

async function confirmarEliminar(act: Actividad) {
  const { isConfirmed } = await $swal.fire({
    title: '¿Eliminar actividad?',
    text: `Se eliminará "${act.l_nombre}" y todas sus calificaciones`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })
  if (isConfirmed) {
    try {
      await remove(act.c_actividad)
      if (actividadSeleccionada.value?.c_actividad === act.c_actividad) {
        actividadSeleccionada.value = actividades.value[0] ?? null
      }
      await $swal.fire({ title: 'Eliminada', icon: 'success', timer: 1500, showConfirmButton: false })
    } catch (e: any) {
      await $swal.fire({ title: 'Error', text: e.message, icon: 'error' })
    }
  }
}

async function toggleEstadoActividad() {
  if (!actividadSeleccionada.value) return
  const act = actividadSeleccionada.value
  const nuevoEstado = act.estado === 'abierta' ? 'cerrada' : 'abierta'
  try {
    await update(act.c_actividad, { l_nombre: act.l_nombre })
    const { error } = await $supabase
      .schema('core')
      .from('actividad')
      .update({ estado: nuevoEstado })
      .eq('c_actividad', act.c_actividad)
    if (error) throw new Error(error.message)
    act.estado = nuevoEstado
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message, icon: 'error' })
  }
}

let timeoutId: ReturnType<typeof setTimeout> | null = null

async function onNotaChange(c_usua: string, value: string) {
  if (!actividadSeleccionada.value) return
  const nota = parseFloat(value)
  if (isNaN(nota)) return

  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(async () => {
    try {
      await calificar({
        c_actividad: actividadSeleccionada.value!.c_actividad,
        c_usua,
        nota,
      })
    } catch (e: any) {
      await $swal.fire({ title: 'Error', text: e.message, icon: 'error' })
    }
  }, 500)
}

async function onObsChange(c_usua: string, value: string) {
  if (!actividadSeleccionada.value) return
  try {
    const nota = notasMap.value.get(c_usua)
    if (nota == null) return
    await calificar({
      c_actividad: actividadSeleccionada.value.c_actividad,
      c_usua,
      nota,
      observacion: value || null,
    })
  } catch (e: any) {
    console.error(e)
  }
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  archivoSeleccionado.value = input.files?.[0] ?? null
}

async function entregarAct() {
  if (!actividadSeleccionada.value || !archivoSeleccionado.value) return
  subiendo.value = true
  try {
    await entregar(actividadSeleccionada.value.c_actividad, archivoSeleccionado.value, entregaDesc.value || null)
    await $swal.fire({ title: '¡Entregado!', text: 'Tu actividad ha sido subida correctamente', icon: 'success', timer: 1500, showConfirmButton: false })
    await cargarEntregas()
    archivoSeleccionado.value = null
    entregaDesc.value = ''
  } catch (e: any) {
    await $swal.fire({ title: 'Error', text: e.message, icon: 'error' })
  } finally {
    subiendo.value = false
  }
}

async function descargarArchivo(url: string, filename?: string) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename || 'descarga'
    a.click()
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

async function descargarTodas() {
  if (!actividadSeleccionada.value) return
  for (const est of estudiantes.value) {
    const entrega = entregasMap.value.get(est.c_usua)
    if (entrega?.l_url) {
      await descargarArchivo(entrega.l_url, `${est.nombre_completo}_${entrega.l_nombre_archivo}`)
      await new Promise(r => setTimeout(r, 500))
    }
  }
}

onMounted(async () => {
  try {
    await withLoading(() => listCursos())
    if (cursos.value.length > 0 && cursos.value[0]) {
      cursoSeleccionadoId.value = cursos.value[0].c_curso
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
