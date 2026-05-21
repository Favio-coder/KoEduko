import type { SupabaseClient } from '@supabase/supabase-js'

export interface NotaAlumno {
  c_usua: string
  c_atri: string | null
  nombre: string
  apellido_p: string
  apellido_m: string
  nombre_completo: string
  email: string
  f_matri: string
  notas: {
    conocimiento: number | null
    actitud: number | null
    participacion: number | null
    interes: number | null
    estrella: number | null
  } | null
}

export interface GestionarAtributosParams {
  accion: 'obtener' | 'editar'
  p_c_curso: string
  p_c_usua?: string
  p_n_con?: number | null
  p_n_act?: number | null
  p_n_par?: number | null
  p_n_int?: number | null
  p_n_star?: number | null
}

export interface GestionarAtributosResponse {
  ok: boolean
  mensaje?: string
  data?: NotaAlumno[] | any
}

export const gestionarAtributos = async (
  supabase: SupabaseClient,
  params: GestionarAtributosParams
): Promise<GestionarAtributosResponse> => {
  const { data, error } = await supabase
    .schema('core')
    .rpc('gestionar_atributos', params)

  if (error) {
    console.error('Error en gestionar_atributos:', error)
    throw new Error(error.message)
  }

  return data
}