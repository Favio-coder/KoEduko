// Composable para manejar notas en componentes
import { ref } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import { 
  listNotasByCurso, 
  updateNota, 
  updateMultipleNotas,
  formatNotasForUI,
  type NotaAlumno,
  type ActualizarNotaParams
} from '~/services/notas/listGrabNota'

export const useNotas = (supabase: SupabaseClient) => {
  const loading = ref(false)
  const saving = ref(false)
  const alumnos = ref<NotaAlumno[]>([])
  const error = ref<string | null>(null)

  // Cargar notas de un curso
  const loadNotas = async (cursoId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await listNotasByCurso(supabase, cursoId)
      alumnos.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar notas'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar nota de un alumno
  const saveNota = async (params: ActualizarNotaParams) => {
    saving.value = true
    error.value = null
    
    try {
      const result = await updateNota(supabase, params)
      
      // Actualizar el valor en la lista local
      if (result.ok && result.data) {
        const index = alumnos.value.findIndex(a => a.c_usua === params.c_usua)
        if (index !== -1) {
        
            if(alumnos.value[index]){
                    alumnos.value[index] = {
                        ...alumnos.value[index],
                        notas: {
                        conocimiento: result.data.conocimiento ?? alumnos.value[index].notas?.conocimiento ?? null,
                        actitud: result.data.actitud ?? alumnos.value[index].notas?.actitud ?? null,
                        participacion: result.data.participacion ?? alumnos.value[index].notas?.participacion ?? null,
                        interes: result.data.interes ?? alumnos.value[index].notas?.interes ?? null,
                        estrella: result.data.estrella ?? alumnos.value[index].notas?.estrella ?? null
                        }
                }
            }
            
          
        }
      }
      
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al guardar nota'
      throw err
    } finally {
      saving.value = false
    }
  }

  // Guardar múltiples notas
  const saveMultipleNotas = async (
    cursoId: string, 
    notas: Array<{ c_usua: string; [key: string]: any }>
  ) => {
    saving.value = true
    error.value = null
    
    try {
      const result = await updateMultipleNotas(supabase, cursoId, notas)
      if (result.success) {
        // Recargar notas para asegurar consistencia
        await loadNotas(cursoId)
      }
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al guardar notas'
      throw err
    } finally {
      saving.value = false
    }
  }

  // Alumnos formateados para UI (con promedio)
  const alumnosFormatted = computed(() => formatNotasForUI(alumnos.value))

  return {
    // Estado
    loading,
    saving,
    alumnos,
    alumnosFormatted,
    error,
    
    // Métodos
    loadNotas,
    saveNota,
    saveMultipleNotas
  }
}