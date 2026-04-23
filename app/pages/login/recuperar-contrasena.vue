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
        Recuperar Contraseña
      </h1>

      <!-- Formulario Para iniciar Sesión -->
      <div class="w-full space-y-4">



        <!-- Email -->
        <input
          v-model="form.email"
          type="email"
          class="w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Correo Electrónico"
          autocomplete="email"
        />



        <!-- Botón Iniciar Sesión -->
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          :disabled="loading || countdown > 0"
          @click="handleResetPassword"
        >
          <span v-if="!loading && countdown === 0">Enviar correo</span>

          <span v-else-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

          <span v-else>
            Reenviar en {{ countdown }}s
          </span>
        </button>
        <p v-if="correoEnviado" class="text-green-600 text-sm text-center">
          Se envió un enlace a tu correo
        </p>
        <!-- Error message -->
        <!-- <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p> -->

       
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { $swal } = useNuxtApp()
const countdown = ref(0)
const correoEnviado = ref(false)
let timer: any = null

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


async function handleResetPassword() {

  if (!form.email) {
    $swal.fire('Error', 'Ingresa tu correo', 'error')
    return
  }

  if (!esValidoEmail(form.email)) {
    $swal.fire('Error', 'Correo inválido', 'error')
    return
  }

  loading.value = true

  try {
    const { $supabase } = useNuxtApp()

    const { error } = await $supabase.auth.resetPasswordForEmail(
      form.email,
      {
        redirectTo: 'http://localhost:3000/login/reset-contrasena'
      }
    )

    if (error) throw error

    correoEnviado.value = true

    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)

  } catch (err: any) {

    let mensaje = err.message

    if (mensaje.includes('rate limit')) {
      mensaje = 'Ups! Se supero el envio de correos, espera un momento antes de volver a enviar el correo'
    }

    $swal.fire('Error', mensaje, 'error')

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

