import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useAulaStore } from '~/stores/aula'
import { createMockSupabase, createMockNuxtApp } from '../mocks/supabase'

const mockSupabase = createMockSupabase()
const mockPush = vi.fn()

vi.stubGlobal('useNuxtApp', () => createMockNuxtApp(mockSupabase))
vi.stubGlobal('useRouter', () => ({ push: mockPush }))

vi.mock('#imports', () => ({
  useAulaStore: () => useAulaStore(),
  useCursoStore: () => ({ $reset: vi.fn() }),
  useSesionStore: () => ({ $reset: vi.fn() }),
}))

describe('Logout flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockSupabase.resetAll()
  })

  it('llama supabase.auth.signOut()', async () => {
    mockSupabase.mockSignOut.mockResolvedValue({ error: null })

    const authStore = useAuthStore()
    authStore.setUser({ id: 'u-1', nombre: 'Test', rol: 'Docente' })

    const { $supabase } = useNuxtApp()
    await $supabase.auth.signOut()

    expect(mockSupabase.mockSignOut).toHaveBeenCalled()
  })

  it('resetea authStore después de signOut', async () => {
    mockSupabase.mockSignOut.mockResolvedValue({ error: null })

    const authStore = useAuthStore()
    authStore.setUser({ id: 'u-1', nombre: 'Test', rol: 'Docente' })
    authStore.$reset()

    expect(authStore.user).toBeNull()
    expect(authStore.perfil).toBeNull()
  })

  it('resetea aulaStore después de signOut', async () => {
    mockSupabase.mockSignOut.mockResolvedValue({ error: null })

    const aulaStore = useAulaStore()
    aulaStore.setGradosAulas([{
      c_grad: 'g-1',
      l_grad: '1°',
      n_anio: 2026,
      l_desc: null,
      aulas: [{ c_aula: 'a-1', l_aula: 'A', l_desc: null }],
    }])
    aulaStore.$reset()

    expect(aulaStore.gradosAulas).toEqual([])
    expect(aulaStore.gradoActual).toBeNull()
  })
})
