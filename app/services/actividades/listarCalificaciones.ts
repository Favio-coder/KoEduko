import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActividadCalificacion } from '~/types/actividad'

export async function listarCalificaciones(
  supabase: SupabaseClient,
  c_actividad: string
): Promise<ActividadCalificacion[]> {
  const { data, error } = await supabase
    .schema('core')
    .from('actividad_calificacion')
    .select('*')
    .eq('c_actividad', c_actividad)

  if (error) throw new Error(error.message)
  return data ?? []
}
