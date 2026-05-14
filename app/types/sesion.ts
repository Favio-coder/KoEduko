
import type { Archivo } from "./archivo"

export interface Sesion {
  id:             string
  titulo:         string
  descripcion:    string | null
  fecha:          string            // 'YYYY-MM-DD'
  hora:           string | null     // 'HH:MM'
  materiales:     string | null     // notas de texto sobre materiales
  archivos:       Archivo[]         // archivos adjuntos (PDFs, PPTs, etc.)
  linkReunion:    string | null
  creadoEn:       string            // ISO date string
  actualizadoEn?: string            // ISO date string (opcional, se setea al editar)
}