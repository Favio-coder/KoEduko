import type { SupabaseClient } from '@supabase/supabase-js'
import type { Atributo } from '~/types/atributo'

export async function listarAtributos(
  supabase: SupabaseClient,
  c_curso: string
): Promise<Atributo[]> {
  const { data, error } = await supabase
    .schema('core')
    .from('atributo')
    .select('*')
    .eq('c_curso', c_curso)
    .order('f_crea', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
