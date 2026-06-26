<template>
  <div class="max-w-2xl mx-auto space-y-6">

    <!-- Cabecera -->
    <div class="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-[#2f4f4f] flex items-center justify-center text-white text-2xl font-bold">
        {{ inicialNombre }}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-[#264e49]">Mi Perfil</h1>
        <p class="text-sm text-gray-500">{{ authStore.user?.nombre }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-4">Cargando perfil...</p>
    </div>

    <template v-if="!cargando">

      <!-- Datos personales -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <UserCircleIcon class="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-gray-800">Datos personales</h2>
            <p class="text-xs text-gray-400">Información de tu cuenta</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nombres</label>
            <input
              v-model="form.nombre"
              type="text"
              class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Apellido paterno</label>
            <input
              v-model="form.apellp"
              type="text"
              class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Apellido materno</label>
            <input
              v-model="form.apellm"
              type="text"
              class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fecha de nacimiento</label>
            <input
              v-model="form.f_nac"
              type="date"
              class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Correo electrónico</label>
            <input
              :value="form.email"
              type="email"
              disabled
              class="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <p class="text-[10px] text-gray-400 mt-1">El correo no se puede modificar</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="guardarPerfil"
            :disabled="guardandoPerfil"
            class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon v-if="guardandoPerfil" class="w-4 h-4 animate-spin" />
            <CheckIcon v-else class="w-4 h-4" />
            Guardar cambios
          </button>
        </div>
      </div>

      <!-- Cambiar contraseña -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <LockClosedIcon class="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-gray-800">Cambiar contraseña</h2>
            <p class="text-xs text-gray-400">Actualiza tu contraseña de acceso</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nueva contraseña</label>
            <input
              v-model="passwordForm.nueva"
              type="password"
              placeholder="Mínimo 6 caracteres"
              class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirmar contraseña</label>
            <input
              v-model="passwordForm.confirmar"
              type="password"
              placeholder="Repite la nueva contraseña"
              class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition"
            />
          </div>
        </div>

        <div v-if="passwordError" class="mt-3 text-xs text-red-500 flex items-center gap-1">
          <ExclamationTriangleIcon class="w-3.5 h-3.5" />
          {{ passwordError }}
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="cambiarPassword"
            :disabled="guardandoPassword"
            class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon v-if="guardandoPassword" class="w-4 h-4 animate-spin" />
            <CheckIcon v-else class="w-4 h-4" />
            Actualizar contraseña
          </button>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  UserCircleIcon,
  LockClosedIcon,
  CheckIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { $supabase, $swal } = useNuxtApp()
const authStore = useAuthStore()

const cargando = ref(true)
const guardandoPerfil = ref(false)
const guardandoPassword = ref(false)
const passwordError = ref('')

const form = ref({
  nombre: '',
  apellp: '',
  apellm: '',
  f_nac: '',
  email: '',
})

const passwordForm = ref({
  nueva: '',
  confirmar: '',
})

const inicialNombre = computed(() =>
  authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
)

const cargarPerfil = async () => {
  cargando.value = true
  try {
    // Obtener email desde auth
    const { data: authData } = await $supabase.auth.getUser()
    const email = authData?.user?.email ?? ''

    // Obtener datos desde core.usuarios
    const userId = authStore.perfil?.c_usua
    if (!userId) throw new Error('No se encontró el usuario')

    const { data: usuario, error } = await $supabase
      .schema('core')
      .from('usuarios')
      .select('l_nom, l_apellp, l_apellm, f_nac, l_email')
      .eq('c_usua', userId)
      .maybeSingle()

    if (error) throw error

    form.value = {
      nombre: usuario?.l_nom ?? authStore.perfil?.l_nom ?? '',
      apellp: usuario?.l_apellp ?? authStore.perfil?.l_apellp ?? '',
      apellm: usuario?.l_apellm ?? authStore.perfil?.l_apellm ?? '',
      f_nac: usuario?.f_nac ? usuario.f_nac.split('T')[0] : '',
      email: usuario?.l_email ?? email,
    }
  } catch (error: any) {
    console.error('Error cargando perfil:', error)
    await $swal.fire({
      title: 'Error',
      text: 'No se pudo cargar el perfil',
      icon: 'error'
    })
  } finally {
    cargando.value = false
  }
}

const guardarPerfil = async () => {
  guardandoPerfil.value = true
  try {
    const userId = authStore.perfil?.c_usua
    if (!userId) throw new Error('No se encontró el usuario')

    const { error } = await $supabase
      .schema('core')
      .from('usuarios')
      .update({
        l_nom: form.value.nombre,
        l_apellp: form.value.apellp,
        l_apellm: form.value.apellm,
        f_nac: form.value.f_nac || null,
      })
      .eq('c_usua', userId)

    if (error) throw error

    // Actualizar store local
    authStore.setPerfil({
      ...authStore.perfil,
      l_nom: form.value.nombre,
      l_apellp: form.value.apellp,
      l_apellm: form.value.apellm,
    })
    authStore.setUser({
      ...authStore.user,
      nombre: `${form.value.nombre} ${form.value.apellp}`,
    })

    await $swal.fire({
      title: '¡Actualizado!',
      text: 'Tu perfil se actualizó correctamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error: any) {
    console.error('Error guardando perfil:', error)
    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo guardar el perfil',
      icon: 'error'
    })
  } finally {
    guardandoPerfil.value = false
  }
}

const cambiarPassword = async () => {
  passwordError.value = ''

  if (!passwordForm.value.nueva) {
    passwordError.value = 'Ingresa una nueva contraseña'
    return
  }

  if (passwordForm.value.nueva.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (passwordForm.value.nueva !== passwordForm.value.confirmar) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }

  guardandoPassword.value = true
  try {
    const { error } = await $supabase.auth.updateUser({
      password: passwordForm.value.nueva
    })

    if (error) throw error

    passwordForm.value = { nueva: '', confirmar: '' }

    await $swal.fire({
      title: '¡Contraseña actualizada!',
      text: 'Tu contraseña se cambió correctamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error: any) {
    console.error('Error cambiando contraseña:', error)
    await $swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo cambiar la contraseña',
      icon: 'error'
    })
  } finally {
    guardandoPassword.value = false
  }
}

onMounted(() => {
  cargarPerfil()
})
</script>
