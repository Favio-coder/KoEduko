import { vi } from 'vitest'

export function createMockSupabase() {
  const mockSelect = vi.fn()
  const mockEq = vi.fn()
  const mockSingle = vi.fn()
  const mockOrder = vi.fn()
  const mockFrom = vi.fn(() => ({ select: mockSelect, eq: mockEq, single: mockSingle, order: mockOrder }))
  const mockRpc = vi.fn()
  const mockSchema = vi.fn(() => ({ from: mockFrom, rpc: mockRpc }))
  const mockSignInWithPassword = vi.fn()
  const mockSignUp = vi.fn()
  const mockSignOut = vi.fn()
  const mockGetSession = vi.fn()
  const mockResetPasswordForEmail = vi.fn()
  const mockUpdateUser = vi.fn()
  const mockGetUser = vi.fn()
  const mockResend = vi.fn()
  const mockSignInWithOtp = vi.fn()

  const supabase = {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getSession: mockGetSession,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
      getUser: mockGetUser,
      resend: mockResend,
      signInWithOtp: mockSignInWithOtp,
    },
    schema: mockSchema,
    from: mockFrom,
    rpc: mockRpc,
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
  }

  function resetAll() {
    vi.clearAllMocks()
  }

  function setupDefaultSession(userId = 'user-123') {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: userId, email: 'test@test.com' } } },
      error: null,
    })
  }

  function setupNoSession() {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
  }

  return {
    supabase,
    mockSignInWithPassword,
    mockSignUp,
    mockSignOut,
    mockGetSession,
    mockResetPasswordForEmail,
    mockUpdateUser,
    mockGetUser,
    mockResend,
    mockSignInWithOtp,
    mockFrom,
    mockSelect,
    mockEq,
    mockSingle,
    mockOrder,
    mockRpc,
    mockSchema,
    resetAll,
    setupDefaultSession,
    setupNoSession,
  }
}

export function createMockNuxtApp(supabaseMock: ReturnType<typeof createMockSupabase>) {
  return {
    $supabase: supabaseMock.supabase,
    $swal: {
      fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
      showLoading: vi.fn(),
      close: vi.fn(),
    },
    provide: {
      supabase: supabaseMock.supabase,
      swal: {
        fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
        showLoading: vi.fn(),
        close: vi.fn(),
      },
    },
  }
}
