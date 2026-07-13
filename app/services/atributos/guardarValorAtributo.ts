import type { SupabaseClient } from '@supabase/supabase-js'

export interface GuardarValorPayload {
  c_atri: string
  c_usua: string
  valor: number
}

export async function guardarValorAtributo(
  supabase: SupabaseClient,
  payload: GuardarValorPayload
): Promise<void> {
  const { error } = await supabase
    .schema('core')
    .from('valor_atributo')
    .upsert(payload, {
      onConflict: 'c_atri,c_usua',
    })

  if (error) throw new Error(error.message)
}
