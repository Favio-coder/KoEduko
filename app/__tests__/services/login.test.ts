// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabase, createMockNuxtApp } from '../mocks/supabase'

const mockSupabase = createMockSupabase()
vi.stubGlobal('useNuxtApp', () => createMockNuxtApp(mockSupabase))

function createQueryable(returnValue: any) {
  const thenFn = (resolve: Function) => resolve(returnValue)
  const obj: any = {
    eq: vi.fn(() => obj),
    single: vi.fn(() => Promise.resolve(returnValue)),
    select: vi.fn(() => obj),
    order: vi.fn(() => obj),
    limit: vi.fn(() => obj),
    then: thenFn,
    catch: () => obj,
    finally: () => obj,
  }
  return obj
}

describe('loginUsuario service', () => {
  beforeEach(() => {
    mockSupabase.resetAll()
  })

  function setupSuccessMocks() {
    mockSupabase.mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'u-1' }, session: { access_token: 'tok' } },
      error: null,
    })

    const perfilRow = {
      c_usua: 'u-1',
      c_instanceId: 'u-1',
      l_nom: 'Favio',
      l_apellp: 'Coder',
      l_apellm: '',
      c_ie: 'ie-1',
      rol: { l_rol: 'Docente' },
      instieducativo: { l_col: 'Colegio' },
    }

    let schemaCallCount = 0
    mockSupabase.mockSchema.mockReturnValue({
      from: vi.fn((table: string) => {
        schemaCallCount++
        if (schemaCallCount === 1) {
          // Validación institución: .select('c_ie').eq().eq().single()
          return createQueryable({ data: { c_ie: 'ie-1' }, error: null })
        } else if (schemaCallCount === 2) {
          // Perfil: .select(...).eq().single()
          return createQueryable({ data: perfilRow, error: null })
        } else {
          // Docente: .select('*').eq()  (no .single(), returns array)
          return createQueryable({ data: [{ c_usua: 'u-1' }], error: null })
        }
      }),
      rpc: vi.fn(() => Promise.resolve({ data: [{ exists: true }], error: null })),
    })
  }

  it('llama signInWithPassword con email y password correctos', async () => {
    setupSuccessMocks()
    const { loginUsuario } = await getLoginService()
    const result = await loginUsuario('test@test.com', 'pass123', 'ie-1')

    expect(mockSupabase.mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pass123',
    })
    expect(result.c_usua).toBe('u-1')
  })

  it('lanza error Credenciales incorrectas si signInWithPassword falla', async () => {
    mockSupabase.mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    })

    const { loginUsuario } = await getLoginService()
    await expect(loginUsuario('bad@test.com', 'wrong', 'ie-1')).rejects.toThrow('Credenciales incorrectas')
  })

  it('valida que el usuario pertenezca a la institución', async () => {
    mockSupabase.mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'u-1' }, session: {} },
      error: null,
    })

    mockSupabase.mockSchema.mockReturnValue({
      from: vi.fn(() => createQueryable({ data: null, error: null })),
      rpc: vi.fn(),
    })

    const { loginUsuario } = await getLoginService()
    await expect(loginUsuario('test@test.com', 'pass123', 'ie-1')).rejects.toThrow('No perteneces')
  })

  it('lanza error si tabla de rol no existe', async () => {
    mockSupabase.mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'u-1' }, session: {} },
      error: null,
    })

    let callCount = 0
    mockSupabase.mockSchema.mockReturnValue({
      from: vi.fn(() => {
        callCount++
        return createQueryable(
          callCount === 1
            ? { data: { c_ie: 'ie-1' }, error: null }
            : callCount === 2
              ? { data: { c_usua: 'u-1', c_instanceId: 'u-1', rol: { l_rol: 'Docente' } }, error: null }
              : { data: null, error: null }
        )
      }),
      rpc: vi.fn(() => Promise.resolve({ data: [{ exists: true }], error: null })),
    })

    const { loginUsuario } = await getLoginService()
    await expect(loginUsuario('test@test.com', 'pass123', 'ie-1')).rejects.toThrow('No registrado como docente')
  })

  it('retorna perfil con c_instanceId igual a c_usua', async () => {
    setupSuccessMocks()
    const { loginUsuario } = await getLoginService()
    const result = await loginUsuario('test@test.com', 'pass123', 'ie-1')
    expect(result.c_instanceId).toBe('u-1')
  })
})

async function getLoginService() {
  return await import('~/services/auth/login')
}
