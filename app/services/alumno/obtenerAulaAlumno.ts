export interface AulaAlumno {
  c_aula: string
  l_aula: string
  l_desc: string | null
  c_grad: string
  l_grad: string
  n_anio: number
  grado_desc: string | null
}
 
export async function devAulaDeAlumno(
  supabase: any,
  c_usua: string
): Promise<AulaAlumno | null> {
  const { data, error } = await supabase
    .schema('core')
    .rpc('get_aula_alumno', { p_c_usua: c_usua })
 
  if (error) throw new Error(error.message)
 
  const rows: AulaAlumno[] = data ?? []
  return rows[0] ?? null
}
