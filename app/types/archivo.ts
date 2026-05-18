export type TipoArchivo = 'pdf' | 'pptx' | 'docx' | 'xlsx' | 'imagen' | 'video' | 'zip' | 'otro'

export interface Archivo {
  c_archivo?:        string
  l_nombre:    string
  tipo:      TipoArchivo
  tamano:    number
  cargando:  boolean
  progreso:  number
  l_url?:      string        // S3 URL (disponible tras subida exitosa)
}

export interface ArchivoUpload {
  file: File

  tipo: TipoArchivo

  cargando: boolean

  progreso: number
}