import { useNotificacionesStore, type Notificacion } from '~/stores/notificaciones'
import { useAuthStore } from '~/stores/auth'

type TipoNotif = Notificacion['tipo']

function tipoPorAccion(accion: string): TipoNotif {
  if (accion.includes('Cread') || accion.includes('Sub') || accion.includes('Gener')) return 'success'
  if (accion.includes('Elimin') || accion.includes('Error')) return 'error'
  if (accion.includes('Edit') || accion.includes('Actualiz')) return 'info'
  return 'info'
}

export function useNotificaciones() {
  const store = useNotificacionesStore()
  const authStore = useAuthStore()

  function notificar(titulo: string, descripcion: string, tipo?: TipoNotif) {
    const esDocente = authStore.user?.rol === 'Docente'
    if (!esDocente) return

    store.agregar({
      titulo,
      descripcion,
      tipo: tipo ?? tipoPorAccion(titulo)
    })
  }

  function notificarCursoCreado(nombreCurso: string) {
    notificar('Curso creado', `Se creó el curso "${nombreCurso}" correctamente`, 'success')
  }

  function notificarCursoEditado(nombreCurso: string) {
    notificar('Curso actualizado', `Se editó el curso "${nombreCurso}"`, 'info')
  }

  function notificarCursoEliminado(nombreCurso: string) {
    notificar('Curso eliminado', `Se eliminó el curso "${nombreCurso}"`, 'error')
  }

  function notificarSesionCreada(nombreSesion: string, nombreCurso: string) {
    notificar('Sesión creada', `Se agregó "${nombreSesion}" al curso "${nombreCurso}"`, 'success')
  }

  function notificarSesionEditada(nombreSesion: string) {
    notificar('Sesión actualizada', `Se editó la sesión "${nombreSesion}"`, 'info')
  }

  function notificarSesionEliminada(nombreSesion: string) {
    notificar('Sesión eliminada', `Se eliminó la sesión "${nombreSesion}"`, 'error')
  }

  function notificarNotasActualizadas(cursoNombre: string, cantidad: number) {
    notificar(
      'Calificaciones actualizadas',
      `Se ${cantidad > 1 ? 'actualizaron' : 'actualizó'} ${cantidad} ${cantidad > 1 ? 'calificaciones' : 'calificación'} del curso "${cursoNombre}"`,
      'success'
    )
  }

  function notificarNotasSubidas(cursoNombre: string) {
    notificar('Calificativos subidos', `Se registraron calificativos en "${cursoNombre}"`, 'success')
  }

  return {
    store,
    notificar,
    notificarCursoCreado,
    notificarCursoEditado,
    notificarCursoEliminado,
    notificarSesionCreada,
    notificarSesionEditada,
    notificarSesionEliminada,
    notificarNotasActualizadas,
    notificarNotasSubidas
  }
}
