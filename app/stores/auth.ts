import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    perfil: null as any,
  }),

  persist: true,

  actions: {
    setUser(user: any) {
      this.user = user
    },
    setPerfil(perfil: any) {
      this.perfil = perfil
    },
    clearSession() {
      this.user = null
      this.perfil = null
    }
  }
})