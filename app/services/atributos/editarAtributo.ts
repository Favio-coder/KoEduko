import type { SupabaseClient } from '@supabase/supabase-js'
import type { Atributo, EditarAtributoDTO } from '~/types/atributo'

export async function editarAtributo(
  supabase: SupabaseClient,
  c_atributo: string,
  payload: EditarAtributoDTO
): Promise<Atributo> {
  const { data, error } = await supabase
    .schema('core')
    .from('atributo')
    .update(payload)
    .eq('c_atributo', c_atributo)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
