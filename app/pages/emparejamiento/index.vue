<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-800">🤝 Emparejamiento Inteligente</h1>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ aulaStore.contextoActual || 'Selecciona un aula en Principal' }}
        </p>
      </div>
    </div>

    <!-- CONTROLES -->
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

      <!-- Botones de acción -->
      <div class="flex gap-3 flex-wrap">
        <button
          @click="entrenarModelo"
          :disabled="!cursoSeleccionadoId || entrenando"
          class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
        >
          <CpuChipIcon v-if="entrenando" class="w-4 h-4 animate-spin" />
          <AcademicCapIcon v-else class="w-4 h-4" />
          {{ entrenando ? 'Entrenando IA...' : 'Entrenar IA' }}
        </button>

        <button
          @click="generarEmparejamientos"
          :disabled="!modeloListo || generando"
          class="flex items-center gap-2 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
        >
          <ArrowPathIcon v-if="generando" class="w-4 h-4 animate-spin" />
          <UsersIcon v-else class="w-4 h-4" />
          {{ generando ? 'Generando...' : 'Generar Emparejamientos' }}
        </button>

        <button
          v-if="emparejamientos.length > 0"
          @click="exportarPDF"
          class="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition"
        >
          <DocumentArrowDownIcon class="w-4 h-4" />
          Exportar Reporte
        </button>
      </div>

    </div>

    <!-- Estado del modelo -->
    <div v-if="cursoSeleccionadoId && modeloStatus" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div 
        :class="[
          'w-2 h-2 rounded-full',
          modeloStatus.status === 'trained' ? 'bg-emerald-500' : 'bg-amber-500'
        ]"
      ></div>
      <span class="text-xs text-gray-600">
        {{ modeloStatus.status === 'trained' ? '✅ Modelo entrenado' : '⚠️ Modelo no entrenado' }}
        <span v-if="modeloStatus.n_estudiantes">
          · {{ modeloStatus.n_estudiantes }} estudiantes
        </span>
      </span>
    </div>

    <!-- Loading state -->
    <div v-if="cargando" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-4">Cargando estudiantes...</p>
    </div>

    <!-- Contenido principal: Gráfo y resultados -->
    <div v-else-if="cursoSeleccionadoId && estudiantes.length > 0" class="grid lg:grid-cols-2 gap-6">

      <!-- Panel izquierdo: Gráfo de estudiantes -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700">🎨 Mapa de Compatibilidad</h3>
          <p class="text-xs text-gray-400 mt-0.5">Círculo más grande = mejor promedio · Pasa el mouse sobre los círculos para ver detalles</p>
        </div>
        <div class="p-4 h-125 relative">
          <canvas ref="grafoCanvas" class="w-full h-full" @mousemove="handleCanvasMouseMove" @mouseleave="tooltipInfo = null"></canvas>
          <!-- Tooltip flotante -->
          <div v-if="tooltipInfo" class="fixed bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none z-50 shadow-lg" :style="{ top: tooltipInfo.y + 'px', left: tooltipInfo.x + 'px' }">
            <p class="font-semibold">{{ tooltipInfo.nombre }}</p>
            <p class="text-gray-300">Promedio: {{ tooltipInfo.promedio.toFixed(1) }}</p>
          </div>
        </div>
      </div>

      <!-- Panel derecho: Resultados de emparejamientos -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-sm font-semibold text-gray-700">📋 Emparejamientos Sugeridos</h3>
          <span class="text-xs text-gray-400">{{ emparejamientos.length }} pareja(s)</span>
        </div>
        
        <div class="divide-y divide-gray-100 max-h-125 overflow-y-auto">
          <!-- Sin emparejamientos -->
          <div v-if="emparejamientos.length === 0 && !generando" class="py-12 text-center">
            <UsersIcon class="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p class="text-sm text-gray-400">Genera emparejamientos para ver resultados</p>
          </div>

          <!-- Lista de emparejamientos -->
          <div
            v-for="(par, index) in emparejamientos"
            :key="index"
            class="p-4 hover:bg-gray-50/50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-gray-800">🎓 {{ par.tutor_nombre || par.tutor_id }}</span>
                      <span class="text-xs text-gray-400">(Tutor)</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm text-gray-600">📖 {{ par.alumno_nombre || par.alumno_id }}</span>
                      <span class="text-xs text-gray-400">(Alumno)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div 
                  :class="[
                    'text-sm font-bold px-3 py-1 rounded-full',
                    par.score > 0.7 ? 'bg-emerald-100 text-emerald-700' :
                    par.score > 0.4 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  ]"
                >
                  {{ (par.score * 100).toFixed(0) }}% compatibilidad
                </div>
              </div>
            </div>
            <!-- Barra de compatibilidad -->
            <div class="mt-2 w-full bg-gray-100 rounded-full h-1.5">
              <div 
                class="h-1.5 rounded-full transition-all duration-500"
                :class="par.score > 0.7 ? 'bg-emerald-500' : par.score > 0.4 ? 'bg-amber-500' : 'bg-gray-400'"
                :style="{ width: `${par.score * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- EMPTY STATES -->
    <div v-else-if="!cursoSeleccionadoId" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <AcademicCapIcon class="w-7 h-7 text-emerald-300" />
      </div>
      <p class="text-gray-600 font-semibold text-sm">Elige un curso</p>
      <p class="text-gray-400 text-xs mt-1">Selecciona un curso para empezar</p>
    </div>

    <div v-else-if="estudiantes.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <UsersIcon class="w-7 h-7 text-gray-300" />
      </div>
      <p class="text-gray-500 font-semibold text-sm">Sin estudiantes</p>
      <p class="text-gray-400 text-xs mt-1">Este curso aún no tiene estudiantes registrados</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '#imports'
import { useAulaStore } from '~/stores/aula'
import { useCursoStore } from '#imports'
import { useListCursos } from '~/composable/curso/useListCursos'
import { withLoading } from '~/utils/withLoading'
import { gestionarAtributos, type NotaAlumno } from '~/services/notas/gestionarAtributos'

import {
  BookOpenIcon, ChevronDownIcon,
  AcademicCapIcon, UsersIcon, ArrowPathIcon, CpuChipIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { $swal, $supabase, $config } = useNuxtApp()
const authStore = useAuthStore()
const aulaStore = useAulaStore()
const cursoStore = useCursoStore()
const { listCursos } = useListCursos()

// Estado
const cursoSeleccionadoId = ref<string>('')
const estudiantes = ref<NotaAlumno[]>([])
const cargando = ref(false)
const entrenando = ref(false)
const generando = ref(false)
const modeloListo = ref(false)
const emparejamientos = ref<any[]>([])
const modeloStatus = ref<any>(null)
const tooltipInfo = ref<{ x: number; y: number; nombre: string; promedio: number } | null>(null)
const posicionesCanvas = ref<{ x: number; y: number; estudiante: NotaAlumno; promedio: number; radius: number }[]>([])

const cursos = computed(() => cursoStore.cursos)

// Configuración del servidor
const urlServer = $config.public.URL_SERVER || 'http://localhost:8000'

// Canvas para el gráfo
const grafoCanvas = ref<HTMLCanvasElement | null>(null)
let resizeObserver: ResizeObserver | null = null

// Calcular promedio
function promedio(est: NotaAlumno): number {
  const n = est.notas
  if (!n) return 0
  const valores = [n.conocimiento, n.actitud, n.participacion]
    .filter((v): v is number => v != null && v > 0)
  if (valores.length === 0) return 0
  return Number((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1))
}

// Dibujar gráfo de estudiantes
function dibujarGrafo() {
  if (!grafoCanvas.value || estudiantes.value.length === 0) return
  
  const canvas = grafoCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Obtener tamaño real del canvas
  const rect = canvas.parentElement?.getBoundingClientRect()
  if (!rect) return
  
  // Configurar dimensiones del canvas
  canvas.width = rect.width
  canvas.height = rect.height
  
  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35
  
  const n = estudiantes.value.length
  const angles = Array.from({ length: n }, (_, i) => (i * 2 * Math.PI) / n)
  
  // Guardar posiciones para tooltips
  posicionesCanvas.value = []
  
  angles.forEach((angle, i) => {
    const estudiante = estudiantes.value[i]
    if (estudiante) {
      const prom = promedio(estudiante)
      const circleRadius = 20 + (prom / 20) * 20
      posicionesCanvas.value.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        estudiante,
        promedio: prom,
        radius: circleRadius
      })
    }
  })
  
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height)
  
  // Dibujar conexiones
  ctx.beginPath()
  for (let i = 0; i < posicionesCanvas.value.length; i++) {
    for (let j = i + 1; j < posicionesCanvas.value.length; j++) {
      const posA = posicionesCanvas.value[i]
      const posB = posicionesCanvas.value[j]
      if (posA && posB) {
        ctx.beginPath()
        ctx.moveTo(posA.x, posA.y)
        ctx.lineTo(posB.x, posB.y)
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }
  
  // Dibujar círculos
  for (const pos of posicionesCanvas.value) {
    ctx.shadowBlur = 8
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, pos.radius, 0, 2 * Math.PI)
    
    if (pos.promedio >= 17) {
      ctx.fillStyle = '#10b981'
    } else if (pos.promedio >= 14) {
      ctx.fillStyle = '#3b82f6'
    } else if (pos.promedio >= 11) {
      ctx.fillStyle = '#f59e0b'
    } else {
      ctx.fillStyle = '#ef4444'
    }
    ctx.fill()
    
    ctx.shadowBlur = 0
    
    ctx.fillStyle = 'white'
    ctx.font = `bold ${Math.min(14, pos.radius - 6)}px system-ui`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const iniciales = pos.estudiante.nombre_completo
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    ctx.fillText(iniciales, pos.x, pos.y)
  }
}

// Manejar mouse move para tooltips
function handleCanvasMouseMove(event: MouseEvent) {
  if (!grafoCanvas.value) return
  
  const canvas = grafoCanvas.value
  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  let found = null
  for (const pos of posicionesCanvas.value) {
    const dx = mouseX - pos.x
    const dy = mouseY - pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= pos.radius) {
      found = pos
      break
    }
  }
  
  if (found) {
    tooltipInfo.value = {
      x: event.clientX + 15,
      y: event.clientY - 30,
      nombre: found.estudiante.nombre_completo,
      promedio: found.promedio
    }
  } else {
    tooltipInfo.value = null
  }
}

// Cargar estudiantes del curso
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
      await verificarEstadoModelo()
      await nextTick()
      setTimeout(() => {
        dibujarGrafo()
      }, 100)
    } else {
      estudiantes.value = []
    }
  } catch (error: any) {
    console.error('Error cargando estudiantes:', error)
  } finally {
    cargando.value = false
  }
}

// Verificar estado del modelo IA
async function verificarEstadoModelo() {
  if (!cursoSeleccionadoId.value) return
  
  try {
    const response = await fetch(`${urlServer}/api/ia/status/${cursoSeleccionadoId.value}`)
    if (response.ok) {
      modeloStatus.value = await response.json()
      modeloListo.value = modeloStatus.value?.status === 'trained'
    } else {
      modeloListo.value = false
    }
  } catch (error) {
    console.error('Error verificando modelo:', error)
    modeloListo.value = false
  }
}

// Entrenar modelo IA
async function entrenarModelo() {
  if (!cursoSeleccionadoId.value || estudiantes.value.length === 0) {
    await $swal.fire({
      title: 'Error',
      text: 'No hay estudiantes para entrenar el modelo',
      icon: 'error'
    })
    return
  }

  entrenando.value = true
  
  try {
    const alumnosData = estudiantes.value.map(est => ({
      c_usua: est.c_usua,
      nombre_completo: est.nombre_completo,
      email: est.email,
      notas: est.notas || {
        conocimiento: 0,
        actitud: 0,
        participacion: 0,
        interes: 0,
        estrella: 0
      }
    }))

    const response = await fetch(`${urlServer}/api/ia/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        curso_id: cursoSeleccionadoId.value,
        alumnos: alumnosData,
        iterations: 200
      })
    })

    const result = await response.json()
    
    if (result.status === 'success') {
      modeloListo.value = true
      await verificarEstadoModelo()
      await $swal.fire({
        title: '¡Éxito!',
        text: `Modelo entrenado con ${result.n_estudiantes} estudiantes`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      throw new Error(result.message)
    }
  } catch (error: any) {
    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo entrenar el modelo',
      icon: 'error'
    })
  } finally {
    entrenando.value = false
  }
}

// Generar emparejamientos
async function generarEmparejamientos() {
  if (!modeloListo.value) {
    await $swal.fire({
      title: 'Modelo no entrenado',
      text: 'Primero debes entrenar el modelo de IA',
      icon: 'warning'
    })
    return
  }

  generando.value = true
  
  try {
    const response = await fetch(`${urlServer}/api/ia/matches/${cursoSeleccionadoId.value}`)
    const result = await response.json()
    
    if (result.status === 'success') {
      emparejamientos.value = result.emparejamientos || []
      await $swal.fire({
        title: '¡Listo!',
        text: `Se generaron ${emparejamientos.value.length} emparejamientos`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      throw new Error(result.message)
    }
  } catch (error: any) {
    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudieron generar emparejamientos',
      icon: 'error'
    })
  } finally {
    generando.value = false
  }
}

// Exportar a PDF
async function exportarPDF() {
  if (emparejamientos.value.length === 0) return
  
  const cursoNombre = cursos.value.find(c => c.c_curso === cursoSeleccionadoId.value)?.l_curso || 'Curso'
  const fecha = new Date().toLocaleDateString('es-PE')
  const hora = new Date().toLocaleTimeString('es-PE')
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Emparejamientos - ${cursoNombre}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #10b981;
          padding-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
        }
        .subtitle {
          font-size: 14px;
          color: #666;
        }
        .info-curso {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #10b981;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .badge-alta { background: #d1fae5; color: #065f46; }
        .badge-media { background: #fed7aa; color: #92400e; }
        .badge-baja { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">KoEduko - Peer Tutoring</div>
        <div class="subtitle">Sistema de Emparejamiento Inteligente</div>
        <div class="subtitle">Ministerio de Educación del Perú - Modelo de Aprendizaje Colaborativo</div>
      </div>
      
      <div class="info-curso">
        <strong>Curso:</strong> ${cursoNombre}<br>
        <strong>Fecha de generación:</strong> ${fecha} - ${hora}<br>
        <strong>Total de parejas sugeridas:</strong> ${emparejamientos.value.length}<br>
        <strong>Método:</strong> Red Neuronal Ligera con optimización de pesos
      </div>
      
      <h3>Tabla de Emparejamientos Tutor-Alumno</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tutor</th>
            <th>Alumno</th>
            <th>Score Compatibilidad</th>
            <th>Nivel</th>
          </tr>
        </thead>
        <tbody>
  `
  
  emparejamientos.value.forEach((par, index) => {
    const score = (par.score * 100).toFixed(0)
    const nivel = par.score > 0.7 ? 'Alta' : par.score > 0.4 ? 'Media' : 'Baja'
    const badgeClass = par.score > 0.7 ? 'badge-alta' : par.score > 0.4 ? 'badge-media' : 'badge-baja'
    
    htmlContent += `
      <tr>
        <td>${index + 1}</td>
        <td>${par.tutor_nombre || par.tutor_id}</td>
        <td>${par.alumno_nombre || par.alumno_id}</td>
        <td>${score}%</td>
        <td><span class="badge ${badgeClass}">${nivel}</span></td>
      </tr>
    `
  })
  
  htmlContent += `
        </tbody>
      </table>
      
      <div class="info-curso" style="margin-top: 30px; background: #ecfdf5;">
        <strong>Resumen Estadístico:</strong><br>
        • Promedio de compatibilidad: ${(emparejamientos.value.reduce((sum, p) => sum + p.score, 0) / emparejamientos.value.length * 100).toFixed(1)}%<br>
        • Parejas de alta compatibilidad (>70%): ${emparejamientos.value.filter(p => p.score > 0.7).length}<br>
        • Parejas de media compatibilidad (40-70%): ${emparejamientos.value.filter(p => p.score > 0.4 && p.score <= 0.7).length}<br>
        • Parejas de baja compatibilidad (<40%): ${emparejamientos.value.filter(p => p.score <= 0.4).length}
      </div>
      
      <div class="footer">
        <p>Documento generado automáticamente por KoEduko - Sistema de Gestión Educativa</p>
        <p>Este reporte es válido como documento de planificación de tutoría entre pares según directiva MINEDU</p>
        <p>Fecha de emisión: ${fecha}</p>
      </div>
    </body>
    </html>
  `
  
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) {
    win.focus()
    setTimeout(() => {
      win.print()
    }, 500)
  }
}

function handleResize() {
  dibujarGrafo()
}

// Configurar ResizeObserver para detectar cambios de tamaño
function setupResizeObserver() {
  if (!grafoCanvas.value) return
  
  const container = grafoCanvas.value.parentElement
  if (!container) return
  
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  
  resizeObserver = new ResizeObserver(() => {
    dibujarGrafo()
  })
  
  resizeObserver.observe(container)
}

// Watchers
watch(cursoSeleccionadoId, async () => {
  emparejamientos.value = []
  modeloListo.value = false
  modeloStatus.value = null
  await cargarEstudiantes()
})

watch(estudiantes, () => {
  nextTick(() => {
    setTimeout(() => {
      dibujarGrafo()
      setupResizeObserver()
    }, 200)
  })
})

// Lifecycle
onMounted(async () => {
  try {
    await withLoading(() => listCursos())
    if (cursos.value.length > 0 && cursos.value[0]) {
      cursoSeleccionadoId.value = cursos.value[0].c_curso 
    }
    window.addEventListener('resize', handleResize)
    await nextTick()
    setTimeout(() => {
      dibujarGrafo()
      setupResizeObserver()
    }, 500)
  } catch (e) { 
    console.error(e) 
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
canvas {
  display: block;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>