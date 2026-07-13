<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span class="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-2 rounded-xl shadow-md inline-flex">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </span>
          SIAGIE — Generación de Calificativos
        </h1>
        <p class="text-gray-500 mt-1 ml-12">Asigna calificativos (AD/A/B/C) y genera conclusiones descriptivas usando IA basada en el Currículo Nacional del Perú.</p>
      </div>

      <!-- Step 1: Curso -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">1</span>
          <h2 class="text-lg font-semibold text-gray-800">Seleccionar Curso</h2>
        </div>
        <select v-model="cursoId" @change="onCursoChange" class="w-full max-w-md rounded-xl border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">— Selecciona un curso —</option>
          <option v-for="c in cursos" :key="c.c_curso" :value="c.c_curso">{{ c.l_curso }}</option>
        </select>
      </div>

      <template v-if="cursoId">
        <!-- Step 2: Nivel educativo -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">2</span>
            <h2 class="text-lg font-semibold text-gray-800">Nivel Educativo</h2>
          </div>
          <div class="flex gap-3 items-center flex-wrap">
            <button v-for="n in niveles" :key="n" @click="nivelSeleccionado = n; areaSeleccionada = ''; competenciasSeleccionadas = []; resultadosPorCompetencia = {}; atributosSeleccionados = {}; evidencias = {}"
              :class="['px-5 py-2.5 rounded-xl border text-sm font-medium transition-all', nivelSeleccionado === n ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50']">
              {{ n }}
            </button>
            <div class="ml-4 flex items-center gap-2">
              <label class="text-sm text-gray-500">Grado <span class="text-red-500">*</span>:</label>
              <input v-model="gradoText" placeholder="ej. 1°" required @input="gradoError = false"
                class="w-20 rounded-lg border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="{ 'border-red-400 bg-red-50': gradoError }" />
              <span v-if="gradoError" class="text-xs text-red-500 font-medium">Requerido</span>
            </div>
          </div>
        </div>

        <template v-if="nivelSeleccionado">
          <!-- Step 3: Área -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">3</span>
              <h2 class="text-lg font-semibold text-gray-800">Seleccionar Área Curricular</h2>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <button v-for="area in areas" :key="area" @click="onSelectArea(area)"
                :class="['px-4 py-3 rounded-xl border text-sm font-medium transition-all', areaSeleccionada === area ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50']">
                {{ area }}
              </button>
            </div>
          </div>

          <template v-if="areaSeleccionada">
            <!-- Step 4: Competencias -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
              <div class="flex items-center gap-2 mb-4">
                <span class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                <h2 class="text-lg font-semibold text-gray-800">Competencias a Evaluar</h2>
              </div>
              <div v-if="competencias.length === 0" class="text-sm text-gray-400 italic">No hay competencias definidas para esta área.</div>
              <div class="space-y-3" v-else>
                <label v-for="(comp, i) in competencias" :key="i" class="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 cursor-pointer transition-all"
                  :class="competenciasSeleccionadas.includes(i) ? 'bg-green-50 border-green-400' : ''">
                  <input type="checkbox" :checked="competenciasSeleccionadas.includes(i)" @change="toggleCompetencia(i)" class="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ comp.nombre }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ comp.descripcion }}</p>
                  </div>
                </label>
              </div>
            </div>

            <template v-if="competenciasSeleccionadas.length > 0">
              <!-- Step 5: Evidencias / Atributos por competencia -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
              <div class="flex items-center gap-2 mb-4">
                <span class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">5</span>
                <h2 class="text-lg font-semibold text-gray-800">Evidencias por Estudiante</h2>
              </div>

              <div v-if="estudiantes.length === 0" class="text-sm text-gray-400 italic mb-4">
                No hay estudiantes en este curso.
              </div>

              <div v-for="(comp, ci) in competenciasSeleccionadas" :key="ci" class="mb-6 last:mb-0">
                <h3 class="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">{{ ci + 1 }}</span>
                  {{ competencias[comp]?.nombre }}
                </h3>

                <!-- Atributos predefinidos -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <button v-for="(attr, ai) in atributosDisponibles" :key="ai"
                    @click="comp !== undefined && toggleAtributo(comp, attr)"
                    :class="['px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', atrSeleccionado(comp, attr) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300']">
                    {{ attr }}
                  </button>
                </div>

                <!-- Tabla estudiantes -->
                <div class="overflow-x-auto rounded-xl border border-gray-200">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-gray-50">
                        <th class="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Estudiante</th>
                        <th v-for="(attr, ai) in atributosSeleccionados[comp] || []" :key="ai" class="px-2 py-2 font-medium text-gray-600 text-center whitespace-nowrap">{{ attr }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(est, ei) in estudiantes" :key="ei" class="border-t border-gray-100 hover:bg-gray-50">
                        <td class="px-3 py-2 text-gray-800 font-medium whitespace-nowrap">{{ est.nombre_completo }}</td>
                        <td v-for="(attr, ai) in atributosSeleccionados[comp] || []" :key="ai" class="px-2 py-2 text-center">
                          <input type="checkbox"
                            :checked="getEvidencia(est.c_usua, comp, attr)"
                            @change="toggleEvidencia(est.c_usua, comp, attr)"
                            class="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Botón generar -->
              <div class="mt-6 flex justify-end">
                <button @click="generarCalificativos" :disabled="generando"
                  class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <svg v-if="generando" class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  {{ generando ? 'Generando...' : 'Generar Calificativos con IA' }}
                </button>
              </div>
            </div>
          </template>
        </template>
      </template>
    </template>

      <!-- Step 6: Resultados -->
      <template v-if="Object.keys(resultadosPorCompetencia).length > 0">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">6</span>
            <h2 class="text-lg font-semibold text-gray-800">Resultados</h2>
            <span class="ml-auto text-xs text-gray-400">{{ cursoSeleccionado?.l_curso }} — {{ areaSeleccionada }}</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">Nombres y apellidos</th>
                  <template v-for="(comp, ci) in competenciasSeleccionadas" :key="ci">
                    <th class="px-2 py-2 font-medium text-gray-600 text-center w-16">NL</th>
                    <th class="px-2 py-2 font-medium text-gray-600 text-left min-w-[280px]">Conclusión Descriptiva de la competencia</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(est, ei) in estudiantes" :key="ei" class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-3 py-2 text-gray-800 font-medium whitespace-nowrap">{{ est.nombre_completo }}</td>
                  <template v-for="(comp, ci) in competenciasSeleccionadas" :key="ci">
                    <td class="px-2 py-2 text-center">
                      <span v-if="getResultado(est, comp)" :class="getClaseCalificativo(getResultado(est, comp)!.calificativo)" class="inline-block px-2 py-0.5 rounded-lg text-xs font-bold">
                        {{ getResultado(est, comp)!.calificativo }}
                      </span>
                    </td>
                    <td class="px-2 py-2 text-gray-600 text-xs leading-relaxed">
                      {{ getResultado(est, comp)?.conclusionDescriptiva || '—' }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex gap-4 text-xs">
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-yellow-200 border border-yellow-400"></span> AD: Logro destacado</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-200 border border-green-400"></span> A: Logro esperado</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-200 border border-blue-400"></span> B: En proceso</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-200 border border-red-400"></span> C: En inicio</span>
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { obtenerAreas, obtenerCompetencias } from '~/services/gemini/generarCalificativo'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const authStore = useAuthStore()
const { $supabase, $swal } = useNuxtApp()

interface Estudiante {
  c_usua: string
  nombre_completo: string
}

interface Resultado {
  estudiante: string
  calificativo: 'AD' | 'A' | 'B' | 'C'
  conclusionDescriptiva: string
}

interface Evidencias {
  [compIndex: number]: {
    [c_usua: string]: {
      [atributo: string]: boolean
    }
  }
}

const cursos = ref<any[]>([])
const cursoId = ref('')
const niveles = ['Inicial', 'Primaria', 'Secundaria']
const nivelSeleccionado = ref('')
const gradoText = ref('')
const areaSeleccionada = ref('')
const competenciasSeleccionadas = ref<number[]>([])
const estudiantes = ref<Estudiante[]>([])
const resultadosPorCompetencia = ref<{ [compIndex: number]: Resultado[] }>({})
const generando = ref(false)
const gradoError = ref(false)

const atributosDisponibles = [
  'Resolvió correctamente',
  'Explicó el procedimiento',
  'Ayudó a otros compañeros',
  'Aplicó otra estrategia',
  'Necesitó apoyo',
  'No terminó',
  'Superó el nivel esperado',
  'Argumentó sus respuestas',
  'Usó vocabulario preciso',
  'Trabajó en equipo',
  'Fue creativo',
  'Mostró iniciativa',
]

const atributosSeleccionados = ref<{ [compIndex: number]: string[] }>({})
const evidencias = ref<Evidencias>({})

const areas = computed(() => {
  return obtenerAreas(nivelSeleccionado.value)
})

const competencias = computed(() => {
  return obtenerCompetencias(nivelSeleccionado.value, areaSeleccionada.value)
})

const cursoSeleccionado = computed(() => cursos.value.find((c: any) => c.c_curso === cursoId.value))

onMounted(async () => {
  const { data, error } = await $supabase
    .schema('core')
    .from('curso')
    .select('c_curso, l_curso, l_desc, c_aula')
    .order('l_curso', { ascending: true })
  if (!error && data) cursos.value = data
})

function onCursoChange() {
  nivelSeleccionado.value = ''
  areaSeleccionada.value = ''
  competenciasSeleccionadas.value = []
  estudiantes.value = []
  resultadosPorCompetencia.value = {}
  atributosSeleccionados.value = {}
  evidencias.value = {}
}

function onSelectArea(area: string) {
  areaSeleccionada.value = area
  competenciasSeleccionadas.value = []
  resultadosPorCompetencia.value = {}
  atributosSeleccionados.value = {}
  evidencias.value = {}
  cargarEstudiantes()
}

async function cargarEstudiantes() {
  const curso = cursoSeleccionado.value
  if (!curso?.c_curso) return
  const { data, error } = await $supabase
    .schema('core')
    .rpc('gestionar_atributos', { accion: 'obtener', p_c_curso: curso.c_curso })
  if (!error && data?.ok && data?.data) {
    const map = new Map<string, Estudiante>()
    for (const row of data.data) {
      const key = row.c_usua
      const nombre = row.nombre_completo
      if (key && !map.has(key)) {
        map.set(key, { c_usua: key, nombre_completo: (nombre || '').replace(/\s+/g, ' ').trim() })
      }
    }
    estudiantes.value = Array.from(map.values())
  }
}

function toggleCompetencia(i: number) {
  const idx = competenciasSeleccionadas.value.indexOf(i)
  if (idx === -1) {
    competenciasSeleccionadas.value.push(i)
    atributosSeleccionados.value[i] = []
    evidencias.value[i] = {}
  } else {
    competenciasSeleccionadas.value.splice(idx, 1)
    delete atributosSeleccionados.value[i]
    delete evidencias.value[i]
  }
}

function atrSeleccionado(comp: number, attr: string) {
  return (atributosSeleccionados.value[comp] || []).includes(attr)
}

function toggleAtributo(comp: number, attr: string) {
  if (!atributosSeleccionados.value[comp]) atributosSeleccionados.value[comp] = []
  const idx = atributosSeleccionados.value[comp].indexOf(attr)
  if (idx === -1) {
    atributosSeleccionados.value[comp].push(attr)
  } else {
    atributosSeleccionados.value[comp].splice(idx, 1)
  }
}

function getEvidencia(c_usua: string, comp: number, attr: string): boolean {
  return evidencias.value[comp]?.[c_usua]?.[attr] ?? false
}

function toggleEvidencia(c_usua: string, comp: number, attr: string) {
  if (!evidencias.value[comp]) evidencias.value[comp] = {}
  if (!evidencias.value[comp][c_usua]) evidencias.value[comp][c_usua] = {}
  evidencias.value[comp][c_usua][attr] = !evidencias.value[comp][c_usua][attr]
}

function getResultado(est: Estudiante, comp: number): Resultado | undefined {
  return resultadosPorCompetencia.value[comp]?.find(r => r.estudiante === est.nombre_completo)
}

function getClaseCalificativo(cal: string): string {
  const map: Record<string, string> = {
    AD: 'bg-yellow-100 text-yellow-800',
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-red-100 text-red-800',
  }
  return map[cal] || ''
}

async function generarCalificativos() {
  gradoError.value = !gradoText.value.trim()
  if (gradoError.value) {
    await $swal.fire({ title: 'Campo requerido', text: 'Debe ingresar el grado para generar el reporte (ej. 1°, 2°, etc.)', icon: 'warning' })
    return
  }

  if (estudiantes.value.length === 0) {
    await $swal.fire({ title: 'Sin estudiantes', text: 'No hay estudiantes cargados para este curso. Verifique que el curso tenga estudiantes asignados.', icon: 'warning' })
    return
  }

  const tieneEvidencias = competenciasSeleccionadas.value.some(ci =>
    Object.values(evidencias.value[ci] || {}).some(e => Object.values(e).some(v => v))
  )
  if (!tieneEvidencias) {
    await $swal.fire({ title: 'Sin evidencias', text: 'Debe marcar al menos una evidencia por competencia para generar los calificativos.', icon: 'warning' })
    return
  }

  generando.value = true
  resultadosPorCompetencia.value = {}

  const nivel = nivelSeleccionado.value
  const grado = gradoText.value.trim()

  for (const ci of competenciasSeleccionadas.value) {
    const comp = competencias.value[ci]
    if (!comp) continue
    const atributos = atributosSeleccionados.value[ci] || []

    const estudiantesData = estudiantes.value.map(est => ({
      nombre: est.nombre_completo,
      atributos: atributos.map(attr => ({
        nombre: attr,
        cumplido: evidencias.value[ci]?.[est.c_usua]?.[attr] ?? false,
      })),
    }))

    try {
      const estudiantesTexto = estudiantesData.map(e => {
        const atrs = e.atributos.map(a => `${a.nombre}: ${a.cumplido ? 'Sí' : 'No'}`).join('\n')
        return `Estudiante: ${e.nombre}\n${atrs}`
      }).join('\n---\n')

      const prompt = `Eres un docente peruano experto en evaluación formativa según el Currículo Nacional de Educación Básica (CNEB).

Contexto:
- Nivel: ${nivel}
- Grado: ${grado}
- Área curricular: ${areaSeleccionada.value}
- Competencia: ${comp.nombre}
- Descripción de la competencia: ${comp.descripcion}

Escala de calificación SIAGIE:
- AD (Logro destacado): El estudiante evidencia un nivel superior a lo esperado respecto a la competencia.
- A (Logro esperado): El estudiante cumple con lo esperado respecto a la competencia.
- B (En proceso): El estudiante está en camino de lograr la competencia, pero requiere acompañamiento.
- C (En inicio): El estudiante muestra un progreso mínimo en la competencia según el nivel esperado.

Para cada estudiante, analiza las evidencias marcadas y asigna:
1. Un calificativo (AD, A, B o C) siguiendo estrictamente los criterios del CNEB.
2. Una conclusión descriptiva (máximo 3 oraciones) explicando el nivel de logro, lo que el estudiante logró y lo que necesita mejorar.

Responde SOLO con un JSON array válido, sin markdown ni explicaciones adicionales:
[
  {
    "estudiante": "Nombre del estudiante",
    "calificativo": "AD|A|B|C",
    "conclusionDescriptiva": "Texto de la conclusión..."
  }
]

Estudiantes y evidencias:
${estudiantesTexto}`

      const text = await $fetch('/api/siagie/generar', {
        method: 'POST',
        body: { prompt },
        timeout: 60000,
      })
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const firstBracket = clean.indexOf('[')
      const lastBracket = clean.lastIndexOf(']')
      const jsonStr = firstBracket !== -1 && lastBracket > firstBracket ? clean.slice(firstBracket, lastBracket + 1) : clean
      const parsed: Resultado[] = JSON.parse(jsonStr)
      resultadosPorCompetencia.value[ci] = parsed
    } catch (e: any) {
      console.error('Error generando para competencia', comp.nombre, e)
      await $swal.fire({ title: `Error en "${comp.nombre}"`, text: `No se pudo generar: ${e.message || e.cause || 'Error de conexión con la IA'}. Verifique que los estudiantes tengan evidencias marcadas.`, icon: 'error' })
    }
  }

  const total = Object.values(resultadosPorCompetencia.value).reduce((sum, arr) => sum + arr.length, 0)
  if (total > 0) {
    await $swal.fire({ title: '¡Completado!', text: `Se generaron ${total} calificativos`, icon: 'success', timer: 2000, showConfirmButton: false })
  }
  generando.value = false
}
</script>
