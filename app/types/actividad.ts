export interface Actividad {
  c_actividad: string
  c_curso: string
  c_archivo: string | null
  l_nombre: string
  l_desc: string | null
  puntaje_max: number
  f_inicio: string | null
  f_fin: string | null
  estado: string
  f_crea: string
  archivo?: {
    c_archivo: string
    l_nombre: string
    l_tip: string
    l_url: string
  } | null
  atributos?: ActividadAtributo[]
}

export interface ActividadAtributo {
  c_actividad_atributo: string
  c_actividad: string
  c_atributo: string
  porcentaje: number
  l_nombre_atributo?: string
  l_desc_atributo?: string | null
}

export interface ActividadCalificacion {
  c_calificacion: string
  c_actividad: string
  c_usua: string
  nota: number
  observacion: string | null
  f_calificado: string | null
  f_crea: string
  nombre_completo?: string
  email?: string | null
}

export interface ActividadEntrega {
  c_entrega: string
  c_actividad: string
  c_usua: string
  l_desc: string | null
  l_url: string | null
  l_nombre_archivo: string | null
  f_entrega: string
}

export interface CrearActividadDTO {
  l_nombre: string
  l_desc?: string | null
  puntaje_max?: number
  f_inicio?: string | null
  f_fin?: string | null
  atributos: { c_atributo: string; porcentaje: number }[]
  archivo?: File | null
}

export interface CalificarDTO {
  c_actividad: string
  c_usua: string
  nota: number
  observacion?: string | null
}
