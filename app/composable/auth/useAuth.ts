import { loginUsuario } from "~/services/auth/login"
import { useAuthStore } from "~/stores/auth"

interface UserPerfil {
  c_usua: string
  l_nom: string
  l_apellp: string
  l_apellm: string
  c_ie: string
  rol: { l_rol: string }[]
  instieducativo: { l_col: string }[]
}

interface LoginForm {
  email: string
  password: string
  codInstitucion: string
}

export const useAuth = () => {

  const login = async (form: LoginForm) => {
    const perfil = await loginUsuario(
      form.email,
      form.password,
      form.codInstitucion
    )

    // Guardamos en el store aquí
    const authStore = useAuthStore()
    authStore.setPerfil(perfil)
    authStore.setUser({
      id: perfil.c_usua,
      nombre: `${perfil.l_nom} ${perfil.l_apellp}`,
      rol: (perfil.rol as any)?.l_rol,
    })
  }

  return { login }
}