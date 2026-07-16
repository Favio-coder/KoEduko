import type { Actividad, CrearActividadDTO, CalificarDTO, ActividadCalificacion } from '~/types/actividad'
import { listarActividades } from '~/services/actividades/listarActividades'
import { crearActividad } from '~/services/actividades/crearActividad'
import { editarActividad } from '~/services/actividades/editarActividad'
import { eliminarActividad } from '~/services/actividades/eliminarActividad'
import { listarCalificaciones } from '~/services/actividades/listarCalificaciones'
import { guardarCalificacion } from '~/services/actividades/guardarCalificacion'
import { entregarActividad } from '~/services/actividades/entregarActividad'
import { recalcularValorAtributo } from '~/services/actividades/recalcularValorAtributo'
import { obtenerEstudiantesAula } from '~/services/estudiantes/obtenerEstudiantesAula'
import type { Estudiante } from '~/services/estudiantes/obtenerEstudiantesAula'
import { useAuthStore } from '~/stores/auth'

export function useActividades() {
  const { $supabase } = useNuxtApp()
  const authStore = useAuthStore()

  const actividades = ref<Actividad[]>([])
  const estudiantes = ref<Estudiante[]>([])
  const calificaciones = ref<ActividadCalificacion[]>([])
  const loading = ref(false)
  const saving = ref(false)

  async function loadActividades(c_curso: string): Promise<Actividad[]> {
    loading.value = true
    try {
      const data = await listarActividades($supabase, c_curso)
      actividades.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function loadEstudiantes(c_curso: string): Promise<Estudiante[]> {
    const data = await obtenerEstudiantesAula($supabase, c_curso)
    estudiantes.value = data
    return data
  }

  async function loadCalificaciones(c_actividad: string): Promise<ActividadCalificacion[]> {
    const data = await listarCalificaciones($supabase, c_actividad)
    const estudianteMap = new Map(estudiantes.value.map(e => [e.c_usua, e]))
    calificaciones.value = data.map(c => ({
      ...c,
      nombre_completo: estudianteMap.get(c.c_usua)?.nombre_completo ?? '',
      email: estudianteMap.get(c.c_usua)?.email ?? null,
    }))
    return calificaciones.value
  }

  async function create(c_curso: string, dto: CrearActividadDTO): Promise<Actividad> {
    saving.value = true
    try {
      const created = await crearActividad($supabase, c_curso, dto)
      actividades.value.unshift(created)
      return created
    } finally {
      saving.value = false
    }
  }

  async function update(c_actividad: string, dto: Partial<CrearActividadDTO>): Promise<Actividad> {
    saving.value = true
    try {
      const updated = await editarActividad($supabase, c_actividad, dto)
      const idx = actividades.value.findIndex(a => a.c_actividad === c_actividad)
      if (idx !== -1) actividades.value[idx] = updated
      return updated
    } finally {
      saving.value = false
    }
  }

  async function remove(c_actividad: string): Promise<void> {
    saving.value = true
    try {
      await eliminarActividad($supabase, c_actividad)
      actividades.value = actividades.value.filter(a => a.c_actividad !== c_actividad)
    } finally {
      saving.value = false
    }
  }

  async function calificar(payload: CalificarDTO): Promise<void> {
    saving.value = true
    try {
      await guardarCalificacion($supabase, payload)

      const act = actividades.value.find(a => a.c_actividad === payload.c_actividad)
      if (act) {
        await recalcularValorAtributo($supabase, payload.c_usua, act.c_curso)
      }

      const idx = calificaciones.value.findIndex(
        c => c.c_actividad === payload.c_actividad && c.c_usua === payload.c_usua
      )
      if (idx !== -1) {
        calificaciones.value[idx]!.nota = payload.nota
        calificaciones.value[idx]!.observacion = payload.observacion ?? null
        calificaciones.value[idx]!.f_calificado = new Date().toISOString()
      } else {
        calificaciones.value.push({
          c_calificacion: '',
          c_actividad: payload.c_actividad,
          c_usua: payload.c_usua,
          nota: payload.nota,
          observacion: payload.observacion ?? null,
          f_calificado: new Date().toISOString(),
          f_crea: new Date().toISOString(),
        })
      }
    } finally {
      saving.value = false
    }
  }

  async function entregar(c_actividad: string, file: File, desc?: string | null): Promise<void> {
    saving.value = true
    try {
      const c_usua = authStore.perfil?.c_instanceId
      if (!c_usua) throw new Error('Usuario no autenticado')
      await entregarActividad($supabase, c_actividad, c_usua, file, desc)
    } finally {
      saving.value = false
    }
  }

  return {
    actividades,
    estudiantes,
    calificaciones,
    loading,
    saving,
    loadActividades,
    loadEstudiantes,
    loadCalificaciones,
    create,
    update,
    remove,
    calificar,
    entregar,
  }
}
