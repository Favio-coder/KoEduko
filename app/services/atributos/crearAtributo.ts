import type { SupabaseClient } from '@supabase/supabase-js'
import type { Atributo, CrearAtributoDTO } from '~/types/atributo'

export async function crearAtributo(
  supabase: SupabaseClient,
  payload: CrearAtributoDTO
): Promise<Atributo> {
  const { data, error } = await supabase
    .schema('core')
    .from('atributo')
    .insert({
      c_curso: payload.c_curso,
      l_nombre: payload.l_nombre,
      l_desc: payload.l_desc ?? null,
      peso: payload.peso,
      tipo: payload.tipo,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
