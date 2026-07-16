import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const mockGetSession = vi.fn()
const mockSupabase = { auth: { getSession: mockGetSession } }

vi.stubGlobal('useNuxtApp', () => ({
  $supabase: mockSupabase,
}))

const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

const middlewareFn: Function = (async () => {
  if (process.server) return

  const authStore = useAuthStore()
  if (!authStore.user && !authStore.perfil) {
    return navigateTo('/')
  }

  const { $supabase } = useNuxtApp()
  await new Promise(resolve => setTimeout(resolve, 150))
  const { data: { session } } = await $supabase.auth.getSession()

  if (!session) {
    authStore.clearSession()
    return navigateTo('/')
  }

  if (!authStore.user) {
    authStore.setUser(session.user)
  }
})

describe('Auth middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('redirige a / si store no tiene user ni perfil', async () => {
    vi.useFakeTimers()
    const promise = middlewareFn()
    await vi.advanceTimersByTimeAsync(150)
    await promise
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
    vi.useRealTimers()
  })

  it('no redirige si store tiene user', async () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1', nombre: 'Test', rol: 'Docente' })

    vi.useFakeTimers()
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u-1' } } }, error: null })
    const promise = middlewareFn()
    await vi.advanceTimersByTimeAsync(150)
    await promise
    expect(mockNavigateTo).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('redirige a / si getSession retorna null aunque store tenga algo', async () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1', nombre: 'Test', rol: 'Docente' })
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })

    vi.useFakeTimers()
    const promise = middlewareFn()
    await vi.advanceTimersByTimeAsync(150)
    await promise
    expect(mockNavigateTo).toHaveBeenCalledWith('/')
    vi.useRealTimers()
  })

  it('sincroniza session.user al store si store.user es null', async () => {
    const store = useAuthStore()
    store.user = null
    store.perfil = { l_nom: 'Test' }
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u-sync' } } }, error: null })

    vi.useFakeTimers()
    const promise = middlewareFn()
    await vi.advanceTimersByTimeAsync(150)
    await promise
    expect(store.user?.id).toBe('u-sync')
    vi.useRealTimers()
  })

  it('salta si process.server es true', async () => {
    const origServer = process.server
    ;(process as any).server = true

    await middlewareFn()
    expect(mockNavigateTo).not.toHaveBeenCalled()
    ;(process as any).server = origServer
  })

  it('limpia store si sesión no existe', async () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1', nombre: 'Test', rol: 'Docente' })
    store.setPerfil({ l_nom: 'Test' })
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })

    const clearSpy = vi.spyOn(store, 'clearSession')

    vi.useFakeTimers()
    const promise = middlewareFn()
    await vi.advanceTimersByTimeAsync(150)
    await promise
    expect(clearSpy).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
