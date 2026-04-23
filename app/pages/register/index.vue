<template>
  <div class="min-h-screen bg-[#61DC6C] flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-10 flex flex-col items-center">

      <div class="mb-3">
        <img src="/logo/logoEddukko.png" class="w-60 h-60 object-contain" />
      </div>

      <!-- <h1 class="text-3xl font-bold text-gray-900 mb-0">
        Ko Eduko
      </h1> -->

      <!-- Título -->
      <h2 class="text-lg font-semibold text-[#264e49] text-center mb-2">
        Creación de Cuenta
      </h2>

      <!-- Subtitle -->
      <p class="text-md text-gray-500 text-center leading-relaxed mb-8">
        Escoge a la institución que perteneces <br />
        para la creación de una cuenta
      </p>

      <!-- Select -->
      <div class="relative w-full">
        <select
          v-model="selectedInstitution"
          @change="handleInstitutionSelect"
          class="w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
          aria-placeholder="Ingresa el nombre de la institución"
        >
          <option value="" disabled selected>
            Ingresa el nombre de la institución
          </option>
          <option
            v-for="inst in instituciones"
            :value="inst"
          >
            {{ inst.l_col }}
          </option>
        </select>


        <div v-if="mostrarCorreo" class="w-full space-y-4 mt-6">
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
                :disabled="loading"
                @click="crearCuenta"
            >
                <span v-if="!loading">Crear Cuenta</span>

                <!-- Spinner de carga -->
                <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            </button>
            </div>


        <div class="text-center mt-2">
          <NuxtLink to="/" class="text-sm text-[#264e49] hover:text-green-600">
            Tienes una cuenta, inicia sesión aquí
          </NuxtLink>
        </div>



      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { appListInsEdu } from '~/composable/institucionesEducativas/appListInsEdu'
import { useCreateUser } from '~/composable/auth/useCreateUser'
import { obtenerContextoUsuario } from '~/services/usuario/obtenerContexto'

const router = useRouter()
const mostrarCorreo = ref(false)
const { $swal } = useNuxtApp()

//Data
const selectedInstitution = ref<any>(null)
const {instituciones, fetchInstituciones} = appListInsEdu()
const form = reactive({
    codInstitucion: '',
    institucion: '',
    email: ''
})

const {crearCuenta: crearCuentaAuth, loading} = useCreateUser()

//Mounted 
onMounted(() => {
  fetchInstituciones()
})



function handleInstitutionSelect() {
  if (selectedInstitution.value) {
    form.codInstitucion = selectedInstitution.value.c_ie
    form.institucion = selectedInstitution.value.l_col
    mostrarCorreo.value = true
  }
}

async function crearCuenta() {

  if (!form.institucion || !form.email) {
    $swal.fire('Error', 'Completa todos los campos', 'error')
    return
  }

  if (!esValidoEmail(form.email)) {
    $swal.fire('Error', 'Correo inválido', 'error')
    return
  }

  try {

    // 1. OBTENER CONTEXTO
    const ctx = await obtenerContextoUsuario(
      form.email,
      form.codInstitucion
    )

    if (!ctx) {
      throw new Error('Usuario no encontrado en la institución')
    }

    // 2. ENVIAR EMAIL CON CONTEXTO
    await crearCuentaAuth(
      form.email,
      form.codInstitucion,
      ctx.instance_id,
      ctx.l_rol
    )

    $swal.fire({
      icon: 'success',
      title: 'Correo enviado',
      text: 'Revisa tu email para continuar',
    })

  } catch (err: any) {
    $swal.fire('Error', err.message, 'error')
  }
}


function esValidoEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>