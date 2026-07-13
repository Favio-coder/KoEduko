import type { SupabaseClient } from '@supabase/supabase-js'

export async function eliminarAtributo(
  supabase: SupabaseClient,
  c_atributo: string
): Promise<void> {
  const { error: errValores } = await supabase
    .schema('core')
    .from('valor_atributo')
    .delete()
    .eq('c_atri', c_atributo)

  if (errValores) throw new Error(errValores.message)

  const { error } = await supabase
    .schema('core')
    .from('atributo')
    .delete()
    .eq('c_atributo', c_atributo)

  if (error) throw new Error(error.message)
}
