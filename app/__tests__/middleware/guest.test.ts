import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const mockGetSession = vi.fn()
const mockSupabase = { auth: { getSession: mockGetSession } }

vi.stubGlobal('useNuxtApp', () => ({ $supabase: mockSupabase }))

const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

const guestFn: Function = (async () => {
  if (process.server) return

  const authStore = useAuthStore()
  if (authStore.user || authStore.perfil) {
    return navigateTo('/principal')
  }

  const { $supabase } = useNuxtApp()
  await new Promise(resolve => setTimeout(resolve, 100))
  const { data: { session } } = await $supabase.auth.getSession()

  if (session) {
    return navigateTo('/principal')
  }
})

describe('Guest middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('redirige a /principal si store tiene user', async () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1', nombre: 'Test', rol: 'Docente' })
    await guestFn()
    expect(mockNavigateTo).toHaveBeenCalledWith('/principal')
  })

  it('redirige a /principal si store tiene perfil aunque no user', async () => {
    const store = useAuthStore()
    store.setPerfil({ l_nom: 'Test' })
    await guestFn()
    expect(mockNavigateTo).toHaveBeenCalledWith('/principal')
  })

  it('redirige a /principal si hay sesión Supabase activa', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u-1' } } }, error: null })
    vi.useFakeTimers()
    const promise = guestFn()
    await vi.advanceTimersByTimeAsync(100)
    await promise
    expect(mockNavigateTo).toHaveBeenCalledWith('/principal')
    vi.useRealTimers()
  })

  it('no redirige si no hay sesión ni store', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
    vi.useFakeTimers()
    const promise = guestFn()
    await vi.advanceTimersByTimeAsync(100)
    await promise
    expect(mockNavigateTo).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
