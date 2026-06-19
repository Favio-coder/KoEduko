<template>
  <div class="min-h-screen flex items-center justify-center bg-[#61DC6C]">

    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-10 flex flex-col items-center transition-all duration-300 relative">

      <!-- Logo -->
      <div class="mb-4">
        <img src="/logo/logoEddukko.png" class="w-60 h-60 object-contain" />
      </div>

      <!-- Título -->
      <h2 class="text-2xl font-bold text-[#264e49] text-center">
        Crear cuenta
      </h2>

      <p class="text-sm text-gray-500 text-center mb-6">
        Completa tus datos para registrarte 
      </p>

      <!-- Formulario para crear cuenta -->
      <div class="w-full space-y-4">

        <!-- Nombre -->
        <input v-model="form.nombre"
          type="text"
          placeholder="Nombre(s)"
          class="input w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" 
        />

        <!-- Apellido paterno -->
        <input v-model="form.apellidoPaterno"
          type="text"
          placeholder="Apellido paterno"
          class="input w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" 
        />

        <!-- Apellido materno -->
        <input v-model="form.apellidoMaterno"
          type="text"
          placeholder="Apellido materno"
          class="input  w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400
        " />

        <!-- Fecha nacimiento -->
        <input v-model="form.fechaNacimiento"
          type="date"
          class="input  w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />


        <div class="relative w-full mb-3">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nueva contraseña"
          class="input  w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#264e49]"
          @click="showPassword = !showPassword"
        >
          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div v-if="password.length > 0" class="w-full mb-4 space-y-2">

        <!-- Barra de fuerza -->
        <div class="flex gap-1 h-1.5">
          <div
            v-for="i in 4" :key="i"
            class="flex-1 rounded-full transition-all duration-300"
            :class="barColor(i)"
          />
        </div>

        <!-- Nivel textual -->
        <p class="text-xs font-semibold" :class="nivelColor">
          {{ nivelTexto }}
        </p>

        <!-- Requisitos individuales -->
        <ul class="space-y-1">
          <li
            v-for="req in requisitos"
            :key="req.label"
            class="flex items-center gap-2 text-xs"
            :class="req.cumple ? 'text-green-600' : 'text-gray-400'"
          >
            <!-- Check o círculo -->
            <svg v-if="req.cumple" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#22c55e"/>
              <path stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M7 12l3.5 3.5L17 8"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#d1d5db" stroke-width="2"/>
            </svg>
            {{ req.label }}
          </li>
        </ul>
      </div>
        <!-- <input
          v-model="comentario"
          type="text"
          placeholder="Escribe un comentario (prueba XSS aquí)"
          class="w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        /> -->
        <!-- BOTÓN -->
        <button
          @click="crearCuenta"
          :disabled="loading"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center"
        >
          <span v-if="!loading">Crear cuenta</span>
          <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        </button>

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { useRegistrarUsuario } from '~/composable/auth/useRegisterUser'

//const { crearCuentaAuth } = useCreateUser()
const { $swal } = useNuxtApp()
const router = useRouter() //Enrutador
const route = useRoute() //COnsumir de rutas
/* const comentario = ref('') */
const instanceId = ref('')
const rol = ref('')
const showPassword = ref(false)
const password = ref('')
const {register, loading} = useRegistrarUsuario()


const form = reactive({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  email: ''
})

onMounted(() => {
  instanceId.value = String(route.query.instance || '')
  rol.value = String(route.query.rol || '')
  form.email = String(route.query.email || '')
})



/* OWASP PASSWORD RULES */
const requisitos = computed(() => [
  { label: 'Mínimo 12 caracteres', cumple: password.value.length >= 12 },
  { label: 'Mayúscula (A-Z)', cumple: /[A-Z]/.test(password.value) },
  { label: 'Minúscula (a-z)', cumple: /[a-z]/.test(password.value) },
  { label: 'Número', cumple: /[0-9]/.test(password.value) },
  { label: 'Especial (!@#)', cumple: /[^A-Za-z0-9]/.test(password.value) },
  { label: 'Sin espacios', cumple: !/\s/.test(password.value) },
  { label: 'Sin secuencias comunes', cumple: !/(123|abc|qwerty|password)/i.test(password.value) }
])

const puntaje = computed(() =>
  requisitos.value.filter(r => r.cumple).length
)

const nivel = computed(() => {
  if (puntaje.value <= 2) return 1
  if (puntaje.value <= 4) return 2
  if (puntaje.value <= 6) return 3
  return 4
})

const nivelTexto = computed(() => ['', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][nivel.value])

const nivelColor = computed(() => [
  '',
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-green-600'
][nivel.value])

function barColor(i: number) {
  return i <= nivel.value ? 'bg-green-500' : 'bg-gray-200'
}

function esCampoAlfanumerico(valor: string) {
  return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+$/.test(valor.trim())
}

/* CREAR CUENTA */
async function crearCuenta() {

  if (
    !form.nombre ||
    !form.apellidoPaterno ||
    !form.apellidoMaterno ||
    !form.fechaNacimiento ||
    !password.value
  ) {
    $swal.fire('Error', 'Completa todos los campos', 'error')
    return
  }

  if (
    !esCampoAlfanumerico(form.nombre) ||
    !esCampoAlfanumerico(form.apellidoPaterno) ||
    !esCampoAlfanumerico(form.apellidoMaterno)
  ) {
    $swal.fire('Error', 'Los campos de nombre solo permiten caracteres alfanuméricos', 'error')
    return
  }

  if (puntaje.value < 6) {
    $swal.fire('Error', 'Contraseña insegura', 'warning')
    return
  }

  if (loading.value) return
  
  loading.value = true

  try {
    await register({
      email: form.email,
      password: password.value,
      nombre: form.nombre,
      apellp: form.apellidoPaterno,
      apellm: form.apellidoMaterno,
      fecha_nac: form.fechaNacimiento,
      instanceid: instanceId.value,
      rol: rol.value
    })

    // await router.push({
    //   path: '/register/verificar-email',
    //   query: { email: form.email }
    // })
    $swal.fire({
      title: '¡Éxito!',
      text: 'Cuenta creada con éxito',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      router.push('/');
    });

  } catch (err: any) {
    $swal.fire('Error', err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>