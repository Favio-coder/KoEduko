function sanitizarNombre(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'N')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Actividad, CrearActividadDTO } from '~/types/actividad'

export async function crearActividad(
  supabase: SupabaseClient,
  c_curso: string,
  dto: CrearActividadDTO
): Promise<Actividad> {
  let c_archivo: string | null = null

  if (dto.archivo) {
    const nombreSeguro = sanitizarNombre(dto.archivo.name)
    const { data: archivoDB, error: errArchivo } = await supabase
      .schema('core')
      .from('archivo')
      .insert({
        l_nombre: dto.archivo.name,
        l_tip: dto.archivo.name.split('.').pop()?.toLowerCase() ?? 'otro',
        l_url: '',
      })
      .select()
      .single()

    if (errArchivo) throw new Error(errArchivo.message)

    const path = `${archivoDB.c_archivo}/${Date.now()}-${nombreSeguro}`
    const { error: uploadError } = await supabase.storage
      .from('actividades')
      .upload(path, dto.archivo)

    if (uploadError) throw new Error(uploadError.message)

    const { data: urlData } = supabase.storage
      .from('actividades')
      .getPublicUrl(path)

    const { error: errUrl } = await supabase
      .schema('core')
      .from('archivo')
      .update({ l_url: urlData.publicUrl })
      .eq('c_archivo', archivoDB.c_archivo)

    if (errUrl) throw new Error(errUrl.message)

    c_archivo = archivoDB.c_archivo
  }

  const { data: actividad, error: errAct } = await supabase
    .schema('core')
    .from('actividad')
    .insert({
      c_curso,
      c_archivo,
      l_nombre: dto.l_nombre,
      l_desc: dto.l_desc ?? null,
      puntaje_max: dto.puntaje_max ?? 20,
      f_inicio: dto.f_inicio ?? null,
      f_fin: dto.f_fin ?? null,
    })
    .select()
    .single()

  if (errAct) throw new Error(errAct.message)

  if (dto.atributos.length > 0) {
    const { error: errAttr } = await supabase
      .schema('core')
      .from('actividad_atributo')
      .insert(
        dto.atributos.map(a => ({
          c_actividad: actividad.c_actividad,
          c_atributo: a.c_atributo,
          porcentaje: a.porcentaje,
        }))
      )

    if (errAttr) throw new Error(errAttr.message)
  }

  return actividad
}
