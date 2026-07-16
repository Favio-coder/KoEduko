import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabase, createMockNuxtApp } from '../mocks/supabase'

const mockSupabase = createMockSupabase()
vi.stubGlobal('useNuxtApp', () => createMockNuxtApp(mockSupabase))

const makeChain = (result: any) => {
  const chain: any = {
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve(result)),
    select: vi.fn(() => chain),
    order: vi.fn(() => chain),
    update: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    or: vi.fn(() => chain),
    in: vi.fn(() => chain),
    limit: vi.fn(() => chain),
  }
  return chain
}

const defaultPayload = {
  email: 'test@test.com',
  password: 'F@vio2005Ast',
  nombre: 'Test',
  apellp: 'User',
  apellm: '',
  instanceid: 'inst-1',
  rol: 'Docente',
  fecha_nac: '2000-01-01',
}

describe('registrarUsuario service', () => {
  beforeEach(() => {
    mockSupabase.resetAll()
    vi.clearAllMocks()
  })

  it('llama signUp con email y password', async () => {
    mockSupabase.mockSignUp.mockResolvedValue({
      data: { user: { id: 'u-new' }, session: null },
      error: null,
    })
    mockSupabase.mockGetUser.mockResolvedValue({
      data: { user: { id: 'u-new' } },
      error: null,
    })
    mockSupabase.mockFrom.mockReturnValue(makeChain({ data: { c_instanceId: 'inst-1', c_ie: 'ie-1' }, error: null }))
    mockSupabase.mockSchema.mockReturnValue({
      from: vi.fn(() => makeChain({ data: { c_instanceId: 'inst-1', c_ie: 'ie-1' }, error: null })),
      rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })

    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { registrarUsuario } = await import('~/services/auth/register')
    const promise = registrarUsuario(defaultPayload)
    await vi.advanceTimersByTimeAsync(5000)
    const result = await promise
    vi.useRealTimers()

    expect(mockSupabase.mockSignUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'F@vio2005Ast',
    })
    expect(result.success).toBe(true)
    expect(result.user_id).toBe('u-new')
  })

  it('lanza error si signUp falla', async () => {
    mockSupabase.mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'User already registered' },
    })

    const { registrarUsuario } = await import('~/services/auth/register')
    await expect(registrarUsuario(defaultPayload)).rejects.toThrow('User already registered')
  })

  it('lanza error si signUp no retorna user', async () => {
    mockSupabase.mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    })
    mockSupabase.mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { registrarUsuario } = await import('~/services/auth/register')
    await expect(registrarUsuario(defaultPayload)).rejects.toThrow('No se pudo crear usuario')
  })

  it('asigna aula automática para rol Alumno', async () => {
    mockSupabase.mockSignUp.mockResolvedValue({
      data: { user: { id: 'u-alumno' }, session: null },
      error: null,
    })
    mockSupabase.mockGetUser.mockResolvedValue({
      data: { user: { id: 'u-alumno' } },
      error: null,
    })

    mockSupabase.mockSchema.mockReturnValue({
      from: vi.fn(() => makeChain({ data: { c_instanceId: 'inst-1', c_ie: 'ie-1' }, error: null })),
      rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })
    mockSupabase.mockFrom.mockReturnValue(makeChain({ data: { c_instanceId: 'inst-1', c_ie: 'ie-1' }, error: null }))

    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { registrarUsuario } = await import('~/services/auth/register')
    const promise = registrarUsuario({ ...defaultPayload, rol: 'Alumno' })
    await vi.advanceTimersByTimeAsync(5000)
    const result = await promise
    vi.useRealTimers()

    expect(result.success).toBe(true)
    expect(result.c_instance_id).toBe('inst-1')
  })
})
