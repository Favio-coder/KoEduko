// composable/room/Usegooglecalendartoken.ts

export function useGoogleCalendarToken() {
  const config = useRuntimeConfig()

  // Guardamos resolve/reject fuera de la Promise para poder llamar
  // requestAccessToken() sincrónicamente ANTES de crear la Promise
  let _resolve: ((token: string) => void) | null = null
  let _reject: ((err: Error) => void) | null = null
  let _tokenClient: any = null

  function _inicializarCliente() {
    const google = (window as any).google

    if (!google?.accounts?.oauth2) {
      throw new Error('Google Identity Services no está cargado')
    }

    _tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: config.public.googleid,
      scope: 'https://www.googleapis.com/auth/calendar.events',

      callback: (response: any) => {
        if (response.error) {
          _reject?.(new Error(response.error))
        } else {
          _resolve?.(response.access_token)
        }
        _resolve = null
        _reject = null
      },

      error_callback: (error: any) => {
        if (error?.type === 'popup_closed' || error?.type === 'access_denied') {
          _reject?.(new Error('Autorización cancelada o denegada'))
        } else {
          _reject?.(new Error(error?.message ?? 'Error desconocido en Google OAuth'))
        }
        _resolve = null
        _reject = null
      }
    })
  }

  /**
   * Retorna { abrirPopup, token }
   *
   * IMPORTANTE: llama abrirPopup() SINCRÓNICAMENTE en el handler del click,
   * ANTES de cualquier await. Luego await token para obtener el access_token.
   *
   * Ejemplo de uso correcto:
   *
   *   async function confirmar() {
   *     const { abrirPopup, token } = prepararToken()
   *     abrirPopup()                        // ← síncrono, va primero
   *     const accessToken = await token     // ← async, después
   *   }
   */
  function prepararToken(): { abrirPopup: () => void; token: Promise<string> } {
    if (!_tokenClient) {
      _inicializarCliente()
    }

    const token = new Promise<string>((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    const abrirPopup = () => {
      // prompt: 'consent' → siempre muestra pantalla de permisos (útil en dev)
      // prompt: ''        → no pregunta si ya fue aprobado antes
      _tokenClient.requestAccessToken({ prompt: 'consent' })
    }

    return { abrirPopup, token }
  }

  return { prepararToken }
}