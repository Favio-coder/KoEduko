import type { Sesion } from './sesion'

export type ColorCurso = 'emerald' | 'blue' | 'violet' | 'rose' | 'amber' | 'cyan' | 'slate'

export interface Curso {
  c_curso:           string
  l_curso:       string
  l_desc:  string | null
  l_color:        ColorCurso
  sesiones:     Sesion[]
  linkReunion?: string | null   // link de reunión general del curso (tab Reunión)
  notas?:       string | null   // notas generales del curso (tab Reunión)
  f_crea:     string          // ISO date string
}