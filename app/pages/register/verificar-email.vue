<template>
  <div class="min-h-screen flex items-center justify-center bg-[#61DC6C]">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-10 text-center">
      
      <!-- Icono de sobre/email -->
      <div class="mb-6">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-[#264e49] mb-2">
        Verifica tu correo
      </h2>

      <p class="text-gray-600 mb-4">
        Hemos enviado un enlace de verificación a:
      </p>

      <p class="font-semibold text-[#264e49] mb-6">
        {{ email }}
      </p>

      <p class="text-sm text-gray-500 mb-6">
        Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        <br />
        <span class="text-xs">Si no lo encuentras, revisa la carpeta de spam.</span>
      </p>

      <div class="space-y-3">
        <button
          @click="reenviarCorreo"
          :disabled="reenviando"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
        >
          <span v-if="!reenviando">Reenviar correo</span>
          <span v-else class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        </button>

        <button
          @click="irALogin"
          class="w-full text-gray-600 hover:text-[#264e49] text-sm"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { $supabase } = useNuxtApp()
const { $swal } = useNuxtApp()

// ✅ CORREGIDO: Convertir el query param a string correctamente
const email = ref<string>(Array.isArray(route.query.email) 
  ? route.query.email[0] || '' 
  : route.query.email || '')

const reenviando = ref(false)

// Función para reenviar el correo de verificación
const reenviarCorreo = async () => {
  if (!email.value) {
    $swal.fire('Error', 'No hay correo para reenviar', 'error')
    return
  }

  reenviando.value = true

  try {
    const { error } = await $supabase.auth.resend({
      type: 'signup',
      email: email.value
    })

    if (error) throw error

    $swal.fire({
      icon: 'success',
      title: 'Correo reenviado',
      text: 'Revisa tu bandeja de entrada',
      timer: 3000
    })
  } catch (err: any) {
    $swal.fire('Error', err.message, 'error')
  } finally {
    reenviando.value = false
  }
}

const irALogin = () => {
  router.push('/')
}
</script>