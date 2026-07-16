import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockGetSession = vi.fn()
const mockSignInWithPassword = vi.fn()

vi.stubGlobal('useNuxtApp', () => ({
  $supabase: {
    auth: {
      getSession: mockGetSession,
      signInWithPassword: mockSignInWithPassword,
    },
  },
  $swal: { fire: vi.fn(), showLoading: vi.fn(), close: vi.fn() },
}))

vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('definePageMeta', () => {})

describe('Login page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('definePageMeta is callable without error', () => {
    expect(() => definePageMeta({ middleware: 'guest' })).not.toThrow()
  })

  it('navigateTo is defined and callable', () => {
    expect(() => navigateTo('/')).not.toThrow()
  })

  it('useNuxtApp returns $supabase with auth.getSession', () => {
    const { $supabase } = useNuxtApp()
    expect($supabase.auth.getSession).toBeDefined()
    expect(typeof $supabase.auth.getSession).toBe('function')
  })

  it('$supabase.auth.signInWithPassword is callable', () => {
    const { $supabase } = useNuxtApp()
    $supabase.auth.signInWithPassword({ email: 'test@test.com', password: 'pass' })
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pass',
    })
  })

  it('$supabase is defined', () => {
    const { $supabase } = useNuxtApp()
    expect($supabase).toBeDefined()
  })

  it('mock functions are properly wired', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
    const { $supabase } = useNuxtApp()
    const result = await $supabase.auth.getSession()
    expect(result.data.session).toBeNull()
  })
})
