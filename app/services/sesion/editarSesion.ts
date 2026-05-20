import type { SupabaseClient } from '@supabase/supabase-js'

import type { CrearSesionDTO } from '~/types/sesionDTO'
import type { Sesion } from '~/types/sesion'
import type { TipoArchivo } from '~/types/archivo'

function detectarTipoArchivo(nombre: string): TipoArchivo {

  const extension = nombre.split('.').pop()?.toLowerCase()

  switch (extension) {

    case 'pdf':
      return 'pdf'

    case 'ppt':
    case 'pptx':
      return 'pptx'

    case 'doc':
    case 'docx':
      return 'docx'

    case 'xls':
    case 'xlsx':
      return 'xlsx'

    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'imagen'

    case 'mp4':
    case 'mov':
    case 'avi':
      return 'video'

    case 'zip':
    case 'rar':
      return 'zip'

    default:
      return 'otro'
  }
}

export async function editSesion(
  supabase: SupabaseClient,
  sesion: CrearSesionDTO,
  c_sesion: string
): Promise<Sesion> {

  const { data: sesionDB, error: errorSesion } = await supabase
    .schema('core')
    .from('sesion')
    .update({

      l_sesion: sesion.l_sesion,

      l_desc: sesion.l_desc,

      f_sesion: sesion.f_sesion,

      f_hora: sesion.f_hora,

      l_reu: sesion.l_reu

    })
    .eq('c_sesion', c_sesion)
    .select()
    .single()

  if (errorSesion) {

    throw errorSesion
  }



  const { data: archivosActuales } = await supabase
    .schema('core')
    .from('archivo')
    .select('*')
    .eq('c_sesion', c_sesion)

  const archivosGuardados = archivosActuales ?? []


  if (!sesion.archivos || sesion.archivos.length === 0) {

    return {

      ...sesionDB,

      archivos: archivosGuardados
    }
  }


  for (const archivo of sesion.archivos) {

    const file = archivo.file

    const nombreArchivo = `${Date.now()}-${file.name}`

    const path = `${c_sesion}/${nombreArchivo}`

    // Upload storage
    const { error: uploadError } = await supabase
      .storage
      .from('sesiones')
      .upload(path, file)

    if (uploadError) {

      throw uploadError
    }

    // URL pública
    const { data: urlData } = supabase
      .storage
      .from('sesiones')
      .getPublicUrl(path)

    // Guardar DB
    const { data: archivoDB, error: archivoError } = await supabase
      .schema('core')
      .from('archivo')
      .insert({

        l_nombre: file.name,

        l_tip: detectarTipoArchivo(file.name),

        l_url: urlData.publicUrl,

        c_sesion

      })
      .select()
      .single()

    if (archivoError) {

      throw archivoError
    }

    archivosGuardados.push(archivoDB)
  }


  return {

    ...sesionDB,

    archivos: archivosGuardados
  }
}