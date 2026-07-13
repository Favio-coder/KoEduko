export interface Atributo {
  c_atributo: string
  c_curso: string
  l_nombre: string
  l_desc: string | null
  peso: number
  tipo: string
  f_crea: string
}

export interface CrearAtributoDTO {
  c_curso: string
  l_nombre: string
  l_desc?: string
  peso: number
  tipo: string
}

export interface EditarAtributoDTO {
  l_nombre?: string
  l_desc?: string
  peso?: number
  tipo?: string
  activo?: boolean
}
