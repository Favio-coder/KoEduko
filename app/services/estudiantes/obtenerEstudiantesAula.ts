import type { SupabaseClient } from '@supabase/supabase-js'

export interface Estudiante {
  c_usua: string
  nombre: string
  apellido_p: string
  apellido_m: string
  nombre_completo: string
  email: string | null
}

export async function obtenerEstudiantesAula(
  supabase: SupabaseClient,
  c_curso: string,
): Promise<Estudiante[]> {
  const { data, error } = await supabase
    .schema('core')
    .rpc('gestionar_atributos', {
      accion: 'obtener',
      p_c_curso: c_curso,
    })

  if (error) throw new Error(error.message)

  const result: any = data
  if (!result?.ok || !result?.data) return []

  return (result.data as any[]).map((a: any) => ({
    c_usua: a.c_usua,
    nombre: a.nombre ?? '',
    apellido_p: a.apellido_p ?? '',
    apellido_m: a.apellido_m ?? '',
    nombre_completo: a.nombre_completo ?? '',
    email: a.email ?? null,
  }))
}
