import type { SupabaseClient } from '@supabase/supabase-js'
import type { Actividad, ActividadAtributo } from '~/types/actividad'

export async function listarActividades(
  supabase: SupabaseClient,
  c_curso: string
): Promise<Actividad[]> {
  const { data, error } = await supabase
    .schema('core')
    .from('actividad')
    .select('*, archivo:archivo(*)')
    .eq('c_curso', c_curso)
    .order('f_crea', { ascending: false })

  if (error) throw new Error(error.message)

  const actividades = (data ?? []) as Actividad[]

  for (const act of actividades) {
    const { data: attrs } = await supabase
      .schema('core')
      .from('actividad_atributo')
      .select('*, atributo:atributo(l_nombre, l_desc)')
      .eq('c_actividad', act.c_actividad)

    act.atributos = (attrs ?? []).map((a: any) => ({
      c_actividad_atributo: a.c_actividad_atributo,
      c_actividad: a.c_actividad,
      c_atributo: a.c_atributo,
      porcentaje: a.porcentaje,
      l_nombre_atributo: a.atributo?.l_nombre,
      l_desc_atributo: a.atributo?.l_desc,
    }))
  }

  return actividades
}
