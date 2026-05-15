// services/sesion/generarSala.ts

export type Plataforma = 'jitsi' | 'meet' | 'teams'

/**
 * Jitsi Meet — NO necesita API ni autenticación.
 * Cualquier nombre de sala genera una reunión real en https://meet.jit.si/
 */
export function generarLinkJitsi(nombreSesion: string): string {
  // Limpia el nombre para usarlo como room name URL-safe
  const sala = nombreSesion
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
  const sufijo = Math.random().toString(36).substring(2, 7)
  return `https://meet.jit.si/KoEduko-${sala}-${sufijo}`
}

/**
 * Google Meet — requiere Google Calendar API + OAuth 2.0
 * Docs: https://developers.google.com/calendar/api/v3/reference/events/insert
 *
 * Pasos para configurar:
 * 1. Ir a https://console.cloud.google.com/
 * 2. Crear proyecto → habilitar "Google Calendar API"
 * 3. Crear credenciales OAuth 2.0 (tipo: Web application)
 * 4. Agregar tu dominio en "Authorized redirect URIs"
 * 5. El access_token lo obtienes tras el flujo OAuth del usuario
 */
export async function crearReunionMeet(
  accessToken: string,
  nombre: string
): Promise<string> {
  const ahora = new Date()
  const en1hora = new Date(ahora.getTime() + 60 * 60 * 1000)

  const body = {
    summary: nombre,
    start: { dateTime: ahora.toISOString(), timeZone: 'America/Lima' },
    end: { dateTime: en1hora.toISOString(), timeZone: 'America/Lima' },
    conferenceData: {
      createRequest: {
        requestId: `koeduko-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  }

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )

  if (!res.ok) throw new Error(`Google Calendar API error: ${res.status}`)

  const data = await res.json()
  // hangoutLink es el link real de Meet: https://meet.google.com/xxx-yyyy-zzz
  return data.conferenceData?.entryPoints?.[0]?.uri ?? data.hangoutLink
}

/**
 * Microsoft Teams — requiere Microsoft Graph API + Azure AD OAuth 2.0
 * Docs: https://learn.microsoft.com/en-us/graph/api/application-post-onlinemeetings
 *
 * Pasos para configurar:
 * 1. Ir a https://portal.azure.com/ → Azure Active Directory → App registrations
 * 2. Crear nueva app → copiar Client ID y Tenant ID
 * 3. En "API permissions" agregar: OnlineMeetings.ReadWrite (Delegated)
 * 4. El access_token lo obtienes con MSAL.js tras login del usuario
 */
export async function crearReunionTeams(
  accessToken: string,
  nombre: string
): Promise<string> {
  const ahora = new Date()
  const en1hora = new Date(ahora.getTime() + 60 * 60 * 1000)

  const body = {
    subject: nombre,
    startDateTime: ahora.toISOString(),
    endDateTime: en1hora.toISOString()
  }

  const res = await fetch('https://graph.microsoft.com/v1.0/me/onlineMeetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error(`Graph API error: ${res.status}`)

  const data = await res.json()
  // joinWebUrl es el link real de Teams
  return data.joinWebUrl
}