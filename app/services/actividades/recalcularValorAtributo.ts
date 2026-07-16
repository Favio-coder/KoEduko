import type { SupabaseClient } from '@supabase/supabase-js'
import { guardarValorAtributo } from '~/services/atributos/guardarValorAtributo'
import { obtenerValoresAtributo } from '~/services/atributos/obtenerValoresAtributo'

export async function recalcularValorAtributo(
  supabase: SupabaseClient,
  c_usua: string,
  c_curso: string
): Promise<void> {
  const { data: actividades } = await supabase
    .schema('core')
    .from('actividad')
    .select('c_actividad')
    .eq('c_curso', c_curso)

  if (!actividades || actividades.length === 0) return

  const cActividades = actividades.map(a => a.c_actividad)

  const { data: atributosActividad } = await supabase
    .schema('core')
    .from('actividad_atributo')
    .select('c_atributo, porcentaje, c_actividad')
    .in('c_actividad', cActividades)

  if (!atributosActividad || atributosActividad.length === 0) return

  const { data: calificaciones } = await supabase
    .schema('core')
    .from('actividad_calificacion')
    .select('c_actividad, nota')
    .eq('c_usua', c_usua)
    .in('c_actividad', cActividades)

  if (!calificaciones || calificaciones.length === 0) return

  const notaMap = new Map<string, number>()
  for (const c of calificaciones) {
    notaMap.set(c.c_actividad, c.nota)
  }

  const contribuciones = new Map<string, number[]>()
  for (const aa of atributosActividad) {
    const nota = notaMap.get(aa.c_actividad)
    if (nota == null) continue
    if (!contribuciones.has(aa.c_atributo)) {
      contribuciones.set(aa.c_atributo, [])
    }
    contribuciones.get(aa.c_atributo)!.push(nota * (aa.porcentaje / 100))
  }

  for (const [c_atri, valores] of contribuciones) {
    if (valores.length === 0) continue
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length
    const redondeado = Math.round(promedio * 100) / 100

    await guardarValorAtributo(supabase, {
      c_atri,
      c_usua,
      valor: redondeado,
    })
  }
}
