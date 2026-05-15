export interface Room {
  id: number
  nombre: string
  plataforma: 'jitsi' | 'meet' | 'teams'
  link: string
  creadoEn: string
}