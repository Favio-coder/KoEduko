
import type { Archivo } from "./archivo"

export interface Sesion {
  c_sesion?:             string
  l_sesion:         string
  l_desc?:    string | null
  f_Sesion:          string            // 'YYYY-MM-DD'
  f_hora?:           string | null     // 'HH:MM'
  archivos?:       Archivo[]         // archivos adjuntos (PDFs, PPTs, etc.)
  linkReunion?:    string | null
  creadoEn?:       string            // ISO date string
  actualizadoEn?: string            // ISO date string (opcional, se setea al editar)
  c_curso?: string
}
