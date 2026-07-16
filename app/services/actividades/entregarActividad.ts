function sanitizarNombre(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'N')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActividadEntrega } from '~/types/actividad'

export async function entregarActividad(
  supabase: SupabaseClient,
  c_actividad: string,
  c_usua: string,
  file: File,
  l_desc?: string | null
): Promise<ActividadEntrega> {
  const nombreSeguro = sanitizarNombre(file.name)
  const path = `entregas/${c_actividad}/${c_usua}/${Date.now()}-${nombreSeguro}`
  const { error: uploadError } = await supabase.storage
    .from('actividades')
    .upload(path, file)

  if (uploadError) throw new Error(uploadError.message)

  const { data: urlData } = supabase.storage
    .from('actividades')
    .getPublicUrl(path)

  const { data, error } = await supabase
    .schema('core')
    .from('actividad_entrega')
    .upsert(
      {
        c_actividad,
        c_usua,
        l_desc: l_desc ?? null,
        l_url: urlData.publicUrl,
        l_nombre_archivo: file.name,
        f_entrega: new Date().toISOString(),
      },
      { onConflict: 'c_actividad,c_usua' }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
