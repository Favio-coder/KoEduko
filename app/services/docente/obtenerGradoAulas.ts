interface AulaRPC {
  c_aula: string
  l_aula: string
  l_desc: string | null
  c_grad: string
  l_grad: string        
  n_anio: number        
  grado_desc: string | null  
}

export interface GradoConAulas {
  c_grad: string
  l_grad: string
  n_anio: number
  l_desc: string | null
  aulas: {
    c_aula: string
    l_aula: string
    l_desc: string | null
  }[]
}

export async function devGradosAulasporDocente(
  supabase: any,
  c_instanceId: string
): Promise<GradoConAulas[]> {
  const { data, error } = await supabase
    .schema('core')
    .rpc('get_aulas_docente', { p_c_doc: c_instanceId })

  if (error) throw new Error(error.message)

  const rows: AulaRPC[] = data ?? []  

  const mapaGrados = new Map<string, GradoConAulas>()

  for (const row of rows) {
    if (!mapaGrados.has(row.c_grad)) {
      mapaGrados.set(row.c_grad, {
        c_grad: row.c_grad,
        l_grad: row.l_grad,
        n_anio: row.n_anio,
        l_desc: row.grado_desc,
        aulas: [],
      })
    }
    mapaGrados.get(row.c_grad)!.aulas.push({
      c_aula: row.c_aula,
      l_aula: row.l_aula,
      l_desc: row.l_desc,
    })
  }

  return Array.from(mapaGrados.values())
}