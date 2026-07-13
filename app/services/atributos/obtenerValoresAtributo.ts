import type { SupabaseClient } from '@supabase/supabase-js'

export interface ValorAtributoRow {
  c_valor_atri: string
  c_atri: string
  c_usua: string
  valor: number | null
}

export async function obtenerValoresAtributo(
  supabase: SupabaseClient,
  c_atributos: string[]
): Promise<ValorAtributoRow[]> {
  if (c_atributos.length === 0) return []

  const { data, error } = await supabase
    .schema('core')
    .from('valor_atributo')
    .select('*')
    .in('c_atri', c_atributos)

  if (error) throw new Error(error.message)
  return data ?? []
}
