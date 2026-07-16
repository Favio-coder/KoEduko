import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia con user null y perfil null', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.perfil).toBeNull()
  })

  it('setUser() actualiza el estado user', () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1', nombre: 'Favio Test', rol: 'Docente' })
    expect(store.user).toEqual({ id: 'u-1', nombre: 'Favio Test', rol: 'Docente' })
  })

  it('setUser() con objeto vacío no lanza error', () => {
    const store = useAuthStore()
    expect(() => store.setUser({})).not.toThrow()
    expect(store.user).toEqual({})
  })

  it('setPerfil() actualiza el estado perfil', () => {
    const store = useAuthStore()
    const perfil = { l_nom: 'Favio', l_apellp: 'Coder', rol: { l_rol: 'Docente' } }
    store.setPerfil(perfil)
    expect(store.perfil).toEqual(perfil)
  })

  it('setPerfil() con null no lanza error', () => {
    const store = useAuthStore()
    expect(() => store.setPerfil(null)).not.toThrow()
    expect(store.perfil).toBeNull()
  })

  it('clearSession() resetea user y perfil a null', () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1', nombre: 'Test' })
    store.setPerfil({ l_nom: 'Test' })
    store.clearSession()
    expect(store.user).toBeNull()
    expect(store.perfil).toBeNull()
  })

  it('$reset() resetea todo el estado a valores iniciales', () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1' })
    store.setPerfil({ l_nom: 'X' })
    store.$reset()
    expect(store.user).toBeNull()
    expect(store.perfil).toBeNull()
  })

  it('múltiples setUser() consecutivos solo conserva el último', () => {
    const store = useAuthStore()
    store.setUser({ id: 'u-1' })
    store.setUser({ id: 'u-2' })
    store.setUser({ id: 'u-3' })
    expect(store.user?.id).toBe('u-3')
  })
})
