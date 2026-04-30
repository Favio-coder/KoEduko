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
        ¡Bienvenido a Ko Eduko!
      </h2>

      <!-- Subtitle -->
      <p class="text-md text-gray-500 text-center leading-relaxed mb-8">
        Accede a tu aula virtual donde <br />
        ko kreamos la educación
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

        <div class="text-center mt-2">
          <NuxtLink to="/register" class="text-sm text-[#264e49] hover:text-green-600">
            No tienes cuenta, registrate aquí
          </NuxtLink>
        </div>

        <!-- <input
          v-model="comentario"
          type="text"
          placeholder="Escribe un comentario (prueba XSS aquí)"
          class="w-full bg-gray-100 text-gray-700 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        /> -->
        <!-- Arrow -->
        <!-- <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          ▼
        </span> -->
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { appListInsEdu } from '~/composable/institucionesEducativas/appListInsEdu'

const comentario = ref('')
const router = useRouter()

//Data
const selectedInstitution = ref<any>(null)
const {instituciones, fetchInstituciones} = appListInsEdu()

//Mounted 
onMounted(() => {
  fetchInstituciones() //LLama a las instituciones
})



function handleInstitutionSelect() {
  if (selectedInstitution.value) {
    router.push({
      path: '/login',
      query: { 
        institucion: selectedInstitution.value.l_col,
        codinstitucion: selectedInstitution.value.c_ie
      },
    })
  }
}
</script>