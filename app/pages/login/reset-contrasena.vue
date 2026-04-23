<template>
  <div class="min-h-screen flex items-center justify-center bg-[#61DC6C] px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
      
      <!-- Logo -->
      <img src="/logo/logoEddukko.png" class="w-40 mb-4 object-contain" />

      <!-- Título -->
      <h2 class="text-2xl font-bold text-[#264e49] text-center">
        Cambia tu contraseña
      </h2>
      <p class="text-sm text-gray-500 text-center mb-6">
        Ingresa una nueva contraseña para tu cuenta
      </p>

      <!-- Input contraseña -->
      <div class="relative w-full mb-3">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nueva contraseña"
          class="w-full px-4 py-3 pr-10 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
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

      <!-- ✅ Validador OWASP -->
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

      <!-- Botón -->
      <button
        @click="updatePassword"
        :disabled="puntaje < 4"
        class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Actualizar contraseña
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
const { $supabase, $swal } = useNuxtApp()
const router = useRouter()

const password = ref('')
const showPassword = ref(false)

// ✅ Reglas basadas en OWASP Top 10 / ASVS
const requisitos = computed(() => [
  {
    label: 'Mínimo 12 caracteres',
    cumple: password.value.length >= 12
  },
  {
    label: 'Al menos una letra mayúscula (A-Z)',
    cumple: /[A-Z]/.test(password.value)
  },
  {
    label: 'Al menos una letra minúscula (a-z)',
    cumple: /[a-z]/.test(password.value)
  },
  {
    label: 'Al menos un número (0-9)',
    cumple: /[0-9]/.test(password.value)
  },
  {
    label: 'Al menos un carácter especial (!@#$%...)',
    cumple: /[^A-Za-z0-9]/.test(password.value)
  },
  {
    label: 'Sin espacios en blanco',
    cumple: password.value.length > 0 && !/\s/.test(password.value)
  },
  {
    label: 'Sin secuencias comunes (123, abc, qwerty)',
    cumple: !/(123|abc|qwerty|password|contraseña|111|000)/i.test(password.value)
  },
])

// Cuántos requisitos se cumplen (sobre 7)
const puntaje = computed(() => requisitos.value.filter(r => r.cumple).length)

// Nivel de fuerza en 4 barras
const nivel = computed(() => {
  if (puntaje.value <= 2) return 1
  if (puntaje.value <= 4) return 2
  if (puntaje.value <= 6) return 3
  return 4
})

const nivelTexto = computed(() => {
  return ['', 'Muy débil', 'Débil', 'Fuerte', 'Muy fuerte'][nivel.value]
})

const nivelColor = computed(() => {
  return [
    '',
    'text-red-500',
    'text-orange-400',
    'text-yellow-500',
    'text-green-600'
  ][nivel.value]
})

function barColor(i: number) {
  if (i > nivel.value) return 'bg-gray-200'
  return [
    '',
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-500'
  ][nivel.value]
}

async function updatePassword() {
  if (puntaje.value < 7) {
    $swal.fire('Contraseña insegura', 'Completa todos los requisitos de seguridad', 'warning')
    return
  }

  const { error } = await $supabase.auth.updateUser({ password: password.value })

  if (error) {
    $swal.fire('Error', error.message, 'error')
  } else {
    $swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success')
    router.push('/')
  }
}
</script>