<template>
  <div class="min-h-screen bg-[#61DC6C] flex items-center justify-center">

    <!-- Tarjeta Login -->
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-10 flex flex-col items-center transition-all duration-300 relative">

      <!-- Botón volver -->
      <button
        @click="goBack"
        class="absolute top-4 left-4 flex items-center gap-1 text-gray-500 hover:text-[#264e49] transition"
        aria-label="Volver"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path 
            d="M15 6l-6 6 6 6" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>

        <span>Volver</span>
      </button>

      <!-- Logo -->
      <div class="mb-4">
        <img src="/logo/logoEddukko.png" class="w-60 h-60 object-contain" />
      </div>

      <!-- Título -->
      <h1 class="text-2xl font-bold text-[#264e49] mb-6">
        Iniciar Sesión
      </h1>

      <!-- Formulario Para iniciar Sesión -->
      <div class="w-full space-y-4">

        <!-- Institución -->
        <input
          v-model="form.institucion"
          type="text"
          class="w-full bg-gray-100 text-gray-500 text-sm rounded-lg px-4 py-3 cursor-not-allowed"
          disabled="true"
          readonly="true"
        />

        <!-- Email -->
        <input
          v-model="form.email"
          type="email"
          class="w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Correo Electrónico"
          autocomplete="email"
        />

        <!-- Contraseña -->
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full bg-gray-100 text-gray-700 text-sm roundend-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Contraseña"
            autocomplete="current-password"
          />

          <button
            type="button"
            class="absolute right-3 top-0.5 - translate-y-1/2 text-gray-400"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            <!-- Ojo abierto -->
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path stroke="#aaa" stroke-width="2" stroke-linecap="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
              <circle cx="12" cy="12" r="3" stroke="#aaa" stroke-width="2"/>
            </svg>

            <!-- Ojo cerrado -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path stroke="#aaa" stroke-width="2" stroke-linecap="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="#aaa" stroke-width="2" stroke-linecap="round"/>
            </svg>

          </button>
        </div>

        <!-- Botón Iniciar Sesión -->
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          :disabled="loading"
          @click="handleLogin"
        >
          <span v-if="!loading">Ingresar</span>

          <!-- Spinnr de carga -->
          <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        </button>

        <!-- Error message -->
        <!-- <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p> -->
      
        <!-- Forgot password -->
        <div class="text-center">
          <NuxtLink to="/login/recuperar-contrasena" class="text-sm text-[#264e49] hover:text-green-600">
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composable/auth/useAuth'


const route = useRoute()
const router = useRouter()
const { $swal } = useNuxtApp()
const {login} = useAuth()

//Data
const showPassword = ref(false)
const loading = ref(false)
//const errorMsg = ref('')
const form = reactive({
  codInstitucion: '',
  institucion: '',
  email: '',
  password: '',
})

//Mounted
onMounted(() => {
  if (route.query.institucion) {
    form.institucion = String(route.query.institucion)
  }else{
    form.institucion = "Colegio no encontrado"
  }

  if (route.query.codinstitucion) {
    form.codInstitucion = String(route.query.codinstitucion)
  }

})


async function handleLogin() {
  //errorMsg.value = ''

  if (!form.institucion || !form.email || !form.password) {
    //errorMsg.value = 'Por favor completa todos los campos.'
    $swal.fire('Error', 'Completa todos los campos', 'error')
    return
  }

  if (!esValidoEmail(form.email)) {
    $swal.fire('Error', 'Correo inválido, inserte un correo válido', 'error')
    return
  }


  loading.value = true

  try {
    await login(form)
    
    $swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      timer: 1200,
      showConfirmButton: false
    })

    await navigateTo('/principal')

  } catch (err: any) {

    $swal.fire('Error', err.message, 'error')

  } finally {
    loading.value = false
  }

}

function esValidoEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function goBack() {
  router.push('/')
}

</script>

