// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

vi.mock('~/services/auth/login', () => ({
  loginUsuario: vi.fn(),
}))

import { loginUsuario } from '~/services/auth/login'

const mockUseNuxtApp = vi.fn()
vi.stubGlobal('useNuxtApp', mockUseNuxtApp)

describe('useAuth composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockUseNuxtApp.mockReturnValue({
      $supabase: {},
      $swal: { fire: vi.fn(), showLoading: vi.fn(), close: vi.fn() },
    })
  })

  it('login() llama a loginUsuario con email, password y codInstitucion', async () => {
    const authStore = useAuthStore()
    const perfilMock = {
      c_usua: 'u-1',
      l_nom: 'Favio',
      l_apellp: 'Coder',
      l_apellm: 'T',
      rol: { l_rol: 'Docente' },
      instieducativo: { l_col: 'Colegio Test' },
    }
    vi.mocked(loginUsuario).mockResolvedValue(perfilMock)

    const { useAuth } = await import('~/composable/auth/useAuth')
    const { login } = useAuth()

    await login({ email: 'test@test.com', password: 'pass123', codInstitucion: 'inst-1' })

    expect(loginUsuario).toHaveBeenCalledWith('test@test.com', 'pass123', 'inst-1')
  })

  it('login() actualiza el store con perfil y user tras éxito', async () => {
    const authStore = useAuthStore()
    const perfilMock = {
      c_usua: 'u-1',
      l_nom: 'Favio',
      l_apellp: 'Coder',
      l_apellm: 'T',
      rol: { l_rol: 'Docente' },
      instieducativo: { l_col: 'Colegio' },
    }
    vi.mocked(loginUsuario).mockResolvedValue(perfilMock)

    const { useAuth } = await import('~/composable/auth/useAuth')
    const { login } = useAuth()

    await login({ email: 'test@test.com', password: 'pass123', codInstitucion: 'inst-1' })

    expect(authStore.perfil).toEqual(perfilMock)
    expect(authStore.user?.nombre).toBe('Favio Coder')
    expect(authStore.user?.rol).toBe('Docente')
  })

  it('login() propaga error cuando loginUsuario falla', async () => {
    vi.mocked(loginUsuario).mockRejectedValue(new Error('Credenciales incorrectas'))

    const { useAuth } = await import('~/composable/auth/useAuth')
    const { login } = useAuth()

    await expect(login({ email: 'bad@test.com', password: 'wrong', codInstitucion: 'inst-1' })).rejects.toThrow('Credenciales incorrectas')
  })

  it('login() maneja perfil sin rol', async () => {
    const authStore = useAuthStore()
    const perfilMock = {
      c_usua: 'u-1',
      l_nom: 'Sin',
      l_apellp: 'Rol',
      l_apellm: '',
      instieducativo: { l_col: 'Colegio' },
    }
    vi.mocked(loginUsuario).mockResolvedValue(perfilMock)

    const { useAuth } = await import('~/composable/auth/useAuth')
    const { login } = useAuth()

    await login({ email: 'test@test.com', password: 'pass123', codInstitucion: 'inst-1' })

    expect(authStore.user?.rol).toBeUndefined()
  })

  it('retorna función login al llamar useAuth()', async () => {
    const { useAuth } = await import('~/composable/auth/useAuth')
    const auth = useAuth()
    expect(auth).toHaveProperty('login')
    expect(typeof auth.login).toBe('function')
  })
})
