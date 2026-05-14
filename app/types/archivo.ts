export type TipoArchivo = 'pdf' | 'pptx' | 'docx' | 'xlsx' | 'imagen' | 'video' | 'zip' | 'otro'

export interface Archivo {
  id:        string
  nombre:    string
  tipo:      TipoArchivo
  tamano:    number
  cargando:  boolean
  progreso:  number
  url?:      string        // S3 URL (disponible tras subida exitosa)
}