import type { SupabaseClient } from '@supabase/supabase-js'

export async function eliminarActividad(
  supabase: SupabaseClient,
  c_actividad: string
): Promise<void> {
  const { data: act } = await supabase
    .schema('core')
    .from('actividad')
    .select('c_archivo')
    .eq('c_actividad', c_actividad)
    .single()

  const { error } = await supabase
    .schema('core')
    .from('actividad')
    .delete()
    .eq('c_actividad', c_actividad)

  if (error) throw new Error(error.message)

  if (act?.c_archivo) {
    await supabase
      .schema('core')
      .from('archivo')
      .delete()
      .eq('c_archivo', act.c_archivo)
  }
}
