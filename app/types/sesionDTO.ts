import type { ArchivoUpload } from "./archivo";

export interface CrearSesionDTO {
  l_sesion: string

  l_desc?: string | null

  f_sesion: string

  f_hora?: string | null

  l_reu?: string | null

  archivos?: ArchivoUpload[]
}