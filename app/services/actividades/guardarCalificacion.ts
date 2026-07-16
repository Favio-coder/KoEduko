import type { SupabaseClient } from '@supabase/supabase-js'
import type { CalificarDTO } from '~/types/actividad'

export async function guardarCalificacion(
  supabase: SupabaseClient,
  payload: CalificarDTO
): Promise<void> {
  const { error } = await supabase
    .schema('core')
    .from('actividad_calificacion')
    .upsert(
      {
        c_actividad: payload.c_actividad,
        c_usua: payload.c_usua,
        nota: payload.nota,
        observacion: payload.observacion ?? null,
        f_calificado: new Date().toISOString(),
      },
      { onConflict: 'c_actividad,c_usua' }
    )

  if (error) throw new Error(error.message)
}
