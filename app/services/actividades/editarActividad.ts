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

export async function editarActividad(
  supabase: SupabaseClient,
  c_actividad: string,
  dto: Partial<CrearActividadDTO>
): Promise<Actividad> {
  const updates: Record<string, any> = {}

  if (dto.l_nombre !== undefined) updates.l_nombre = dto.l_nombre
  if (dto.l_desc !== undefined) updates.l_desc = dto.l_desc
  if (dto.puntaje_max !== undefined) updates.puntaje_max = dto.puntaje_max
  if (dto.f_inicio !== undefined) updates.f_inicio = dto.f_inicio
  if (dto.f_fin !== undefined) updates.f_fin = dto.f_fin

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .schema('core')
      .from('actividad')
      .update(updates)
      .eq('c_actividad', c_actividad)

    if (error) throw new Error(error.message)
  }

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

    await supabase
      .schema('core')
      .from('archivo')
      .update({ l_url: urlData.publicUrl })
      .eq('c_archivo', archivoDB.c_archivo)

    await supabase
      .schema('core')
      .from('actividad')
      .update({ c_archivo: archivoDB.c_archivo })
      .eq('c_actividad', c_actividad)
  }

  if (dto.atributos) {
    const { error: errDel } = await supabase
      .schema('core')
      .from('actividad_atributo')
      .delete()
      .eq('c_actividad', c_actividad)

    if (errDel) throw new Error(errDel.message)

    if (dto.atributos.length > 0) {
      const { error: errIns } = await supabase
        .schema('core')
        .from('actividad_atributo')
        .insert(
          dto.atributos.map(a => ({
            c_actividad,
            c_atributo: a.c_atributo,
            porcentaje: a.porcentaje,
          }))
        )

      if (errIns) throw new Error(errIns.message)
    }
  }

  const { data: actividad, error } = await supabase
    .schema('core')
    .from('actividad')
    .select('*, archivo:archivo(*)')
    .eq('c_actividad', c_actividad)
    .single()

  if (error) throw new Error(error.message)

  return actividad
}
