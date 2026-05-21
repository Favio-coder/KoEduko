// Servicio para gestionar notas (listar y actualizar)
import type { SupabaseClient } from '@supabase/supabase-js'

// ============================================
// TIPOS
// ============================================
export interface NotaAlumno {
  c_usua: string
  c_atri: string | null
  nombre: string
  apellido_p: string
  apellido_m: string
  nombre_completo: string
  email: string
  f_matri: string
  notas: {
    conocimiento: number | null
    actitud: number | null
    participacion: number | null
    interes: number | null
    estrella: number | null
  } | null
}

export interface ActualizarNotaParams {
  c_curso: string
  c_usua: string
  conocimiento?: number | null
  actitud?: number | null
  participacion?: number | null
  interes?: number | null
  estrella?: number | null
}

export interface NotaResponse {
  ok: boolean
  mensaje?: string
  data?: any
}

// ============================================
// FUNCIÓN: Obtener todas las notas de un curso
// ============================================
export const listNotasByCurso = async (
  supabase: SupabaseClient,
  c_curso: string
): Promise<NotaAlumno[]> => {
  const { data, error } = await supabase
    .schema('core')
    .rpc('gestionar_atributos', {
      accion: 'obtener',
      p_c_curso: c_curso
    })

  if (error) {
    console.error('Error al obtener notas:', error)
    throw new Error(error.message)
  }

  // La función retorna { ok: true, data: [...] }
  if (!data?.ok) {
    throw new Error(data?.mensaje || 'Error al obtener notas')
  }

  return data.data || []
}

// ============================================
// FUNCIÓN: Actualizar nota de un alumno
// ============================================
export const updateNota = async (
  supabase: SupabaseClient,
  params: ActualizarNotaParams
): Promise<NotaResponse> => {
  const { data, error } = await supabase
    .schema('core')
    .rpc('gestionar_atributos', {
      accion: 'editar',
      p_c_curso: params.c_curso,
      p_c_usua: params.c_usua,
      p_n_con: params.conocimiento ?? null,
      p_n_act: params.actitud ?? null,
      p_n_par: params.participacion ?? null,
      p_n_int: params.interes ?? null,
      p_n_star: params.estrella ?? null
    })

  if (error) {
    console.error('Error al actualizar nota:', error)
    throw new Error(error.message)
  }

  return data
}

// ============================================
// FUNCIÓN: Actualizar múltiples notas (batch)
// ============================================
export const updateMultipleNotas = async (
  supabase: SupabaseClient,
  cursoId: string,
  notas: Array<{
    c_usua: string
    conocimiento?: number | null
    actitud?: number | null
    participacion?: number | null
    interes?: number | null
    estrella?: number | null
  }>
): Promise<{ success: boolean; results: NotaResponse[]; errors: number }> => {
  const results: NotaResponse[] = []
  let errors = 0

  for (const nota of notas) {
    try {
      const result = await updateNota(supabase, {
        c_curso: cursoId,
        c_usua: nota.c_usua,
        conocimiento: nota.conocimiento,
        actitud: nota.actitud,
        participacion: nota.participacion,
        interes: nota.interes,
        estrella: nota.estrella
      })
      results.push(result)
      if (!result.ok) errors++
    } catch (error) {
      errors++
      results.push({
        ok: false,
        mensaje: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  return {
    success: errors === 0,
    results,
    errors
  }
}

// ============================================
// FUNCIÓN: Calcular promedio de un alumno
// ============================================
export const calcularPromedio = (
  conocimiento: number | null,
  actitud: number | null,
  participacion: number | null
): number | null => {
  if (conocimiento === null || actitud === null || participacion === null) {
    return null
  }
  
  const suma = conocimiento + actitud + participacion
  return Math.round((suma / 3) * 100) / 100 // Redondear a 2 decimales
}

// ============================================
// FUNCIÓN: Formatear notas para UI
// ============================================
export const formatNotasForUI = (alumnos: NotaAlumno[]) => {
  return alumnos.map(alumno => ({
    id: alumno.c_usua,
    nombre: alumno.nombre_completo,
    email: alumno.email,
    conocimiento: alumno.notas?.conocimiento ?? 0,
    actitud: alumno.notas?.actitud ?? 0,
    participacion: alumno.notas?.participacion ?? 0,
    interes: alumno.notas?.interes ?? 0,
    estrella: alumno.notas?.estrella ?? 0,
    promedio: calcularPromedio(
      alumno.notas?.conocimiento ?? null,
      alumno.notas?.actitud ?? null,
      alumno.notas?.participacion ?? null
    )
  }))
}