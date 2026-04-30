<template>
  <div class="flex min-h-screen font-sans bg-[#f0f4f3]">

    <aside
      class="w-64 shrink-0 flex flex-col"
      style="background: linear-gradient(180deg, #1a3333 0%, #1e3d3d 60%, #162e2e 100%); box-shadow: 4px 0 24px rgba(0,0,0,0.18);"
    >
      <!-- LOGO -->
      <div class="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-md">
          <img src="/logo/logEddukko-solo.png" class="w-7 h-7 object-contain" />
        </div>
        <div>
          <p class="text-white font-bold text-base leading-tight tracking-wide">Ko Eduko</p>
          <p class="text-green-400/70 text-[10px] font-medium tracking-widest uppercase">Colaboración & Aula</p>
        </div>
      </div>

      <!-- NAV -->
      <nav class="flex-1 px-3 py-5 space-y-1">

        <!-- Label section -->
        <p class="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Menú</p>

        <!-- Principal -->
        <NuxtLink
          to="/principal"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
            isActive('/principal')
              ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
              : 'text-white/70 hover:bg-white/8 hover:text-white'
          ]"
        >
          <span v-if="isActive('/principal')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"></span>
          <HomeIcon class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>Principal</span>
        </NuxtLink>

        <!-- Sesiones -->
        <NuxtLink
          to="/sesiones"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
            isActive('/sesiones')
              ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
              : 'text-white/70 hover:bg-white/8 hover:text-white'
          ]"
        >
          <span v-if="isActive('/sesiones')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"></span>
          <CalendarDaysIcon class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>Sesiones</span>
          <!-- Sesiones activas badge -->
          <!-- <span
            v-if="sesionesActivas > 0"
            class="ml-auto flex items-center gap-1 text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            {{ sesionesActivas }}
          </span> -->
        </NuxtLink>


        <!-- Estudiantes (solo docente) -->
        <NuxtLink
          v-if="esDocente"
          to="/estudiantes"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
            isActive('/estudiantes')
              ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
              : 'text-white/70 hover:bg-white/8 hover:text-white'
          ]"
        >
          <span v-if="isActive('/estudiantes')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"></span>
          <UsersIcon class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>Estudiantes</span>
        </NuxtLink>


        <!-- Calificaciones (solo estudiante) -->
        <NuxtLink
          v-if="!esDocente"
          to="/estudiantes"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
            isActive('/estudiantes')
              ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
              : 'text-white/70 hover:bg-white/8 hover:text-white'
          ]"
        >
          <span v-if="isActive('/estudiantes')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"></span>
          <BookOpenIcon class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>Calificaciones</span>
        </NuxtLink>

        <!-- Emparejamiento (solo docente) -->
        <NuxtLink
          v-if="esDocente"
          to="/emparejamiento"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
            isActive('/emparejamiento')
              ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
              : 'text-white/70 hover:bg-white/8 hover:text-white'
          ]"
        >
          <span v-if="isActive('/emparejamiento')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"></span>
          <BoltIcon class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>Emparejamiento</span>
          <span class="ml-auto text-[10px] bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full font-semibold">IA</span>
        </NuxtLink>

        <!-- Principal -->
        <NuxtLink
          to="/salas"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden',
            isActive('/salas')
              ? 'bg-green-500 text-white shadow-lg shadow-green-900/40'
              : 'text-white/70 hover:bg-white/8 hover:text-white'
          ]"
        >
          <span v-if="isActive('/salas')" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"></span>
          <VideoCameraIcon class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span>Salas</span>
        </NuxtLink>

      </nav>

      <!-- BOTTOM: user mini + logout -->
      <div class="px-3 pb-5 space-y-3">
        <!-- Divider -->
        <div class="border-t border-white/10 mb-3"></div>

        <!-- Mini user card -->
        <div class="flex items-center gap-3 px-3 py-2">
          <div
            class="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow"
          >
            {{ inicialNombre }}
          </div>
          <div class="min-w-0">
            <p class="text-white text-xs font-semibold truncate">{{ authStore.user?.nombre ?? 'Usuario' }}</p>
            <p class="text-white/40 text-[10px] capitalize truncate">{{ authStore.user?.rol ?? 'Rol' }}</p>
          </div>
        </div>

        <!-- Logout -->
        <button
          @click="logout"
          class="group flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- ══════════════════════════════════════════
         MAIN AREA
    ══════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- ── TOP NAVBAR ── -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">

        <!-- LEFT: page title / breadcrumb (slot or auto) -->
        <div class="flex items-center gap-2">
          <h1 class="text-gray-800 font-semibold text-base tracking-tight">{{ pageTitle }}</h1>
        </div>

        <!-- RIGHT: actions -->
        <div class="flex items-center gap-3">

          <!-- Sesiones activas pill -->
          <!-- <div class="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ sesionesActivas }} Sesiones Activas
          </div> -->

          <!-- Notification bell -->
          <div class="relative" ref="notifRef">
            <button
              @click="toggleNotif"
              class="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-150"
              aria-label="Notificaciones"
            >
              <BellIcon class="w-5 h-5" />
              <!-- Badge -->
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Notification dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="showNotif"
                class="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right"
              >
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                  <span class="text-sm font-semibold text-gray-800">Notificaciones</span>
                  <button
                    v-if="unreadCount > 0"
                    @click="markAllRead"
                    class="text-xs text-green-600 hover:text-green-700 font-medium transition"
                  >
                    Marcar todas como leídas
                  </button>
                </div>

                <!-- List -->
                <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  <div v-if="notificaciones.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                    <BellSlashIcon class="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Sin notificaciones nuevas
                  </div>
                  <div
                    v-for="n in notificaciones"
                    :key="n.id"
                    :class="[
                      'flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
                      n.leida ? 'hover:bg-gray-50' : 'bg-green-50/60 hover:bg-green-50'
                    ]"
                    @click="marcarLeida(n)"
                  >
                    <!-- Icon type -->
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', n.color]">
                      <component :is="n.icon" class="w-4 h-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-semibold text-gray-800 leading-snug">{{ n.titulo }}</p>
                      <p class="text-xs text-gray-500 mt-0.5 leading-snug truncate">{{ n.descripcion }}</p>
                      <p class="text-[10px] text-gray-400 mt-1">{{ n.tiempo }}</p>
                    </div>
                    <span v-if="!n.leida" class="w-2 h-2 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-4 py-2.5 border-t border-gray-50 text-center">
                  <button class="text-xs text-green-600 hover:text-green-700 font-medium transition">
                    Ver todas las notificaciones →
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Settings -->
          <!-- <button class="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-150">
            <Cog6ToothIcon class="w-5 h-5" />
          </button> -->

          <!-- User avatar -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150 group"
            >
              <div class="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow">
                {{ inicialNombre }}
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-xs font-semibold text-gray-800 leading-tight">{{ authStore.user?.nombre ?? 'Usuario' }}</p>
                <p class="text-[10px] text-gray-400 capitalize">{{ authStore.user?.rol ?? 'Rol' }}</p>
              </div>
              <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" />
            </button>

            <!-- User dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right py-1"
              >
                <div class="px-4 py-3 border-b border-gray-50">
                  <p class="text-sm font-semibold text-gray-800">{{ authStore.user?.nombre }}</p>
                  <p class="text-xs text-gray-400 capitalize">{{ authStore.user?.rol }}</p>
                </div>
                <button class="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <UserCircleIcon class="w-4 h-4" /> Mi perfil
                </button>
                <button class="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <Cog6ToothIcon class="w-4 h-4" /> Configuración
                </button>
                <div class="border-t border-gray-50 mt-1 pt-1">
                  <button
                    @click="logout"
                    class="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              </div>
            </Transition>
          </div>

        </div>
      </header>

      <!-- ── PAGE CONTENT ── -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  VideoCameraIcon,
  BookOpenIcon,
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  BoltIcon,
  BellIcon,
  BellSlashIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const { $supabase } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ── computed ──────────────────────────────
const esDocente = computed(() => authStore.user?.rol === 'Docente')
const inicialNombre = computed(() => authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?')
const sesionesActivas = ref(12) // reemplazar con dato real

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/principal': 'Panel Principal',
    '/estudiantes': 'Estudiantes',
    '/emparejamiento': 'Emparejamiento Inteligente',
    '/sesiones': 'Sesiones',
    '/salas': 'Salas de reuniones (Ko Eduko Room)',
  }
  return map[route.path] ?? 'Ko Eduko'
})

// ── navigation active ─────────────────────
const isActive = (path: string) => route.path === path

// ── logout ────────────────────────────────
async function logout() {
  showUserMenu.value = false
  await $supabase.auth.signOut()
  authStore.clearSession()
  router.push('/')
}

// ── notifications ─────────────────────────
interface Notif {
  id: number
  titulo: string
  descripcion: string
  tiempo: string
  leida: boolean
  icon: any
  color: string
}

const showNotif = ref(false)
const notifRef = ref<HTMLElement | null>(null)

const notificaciones = ref<Notif[]>([
  {
    id: 1,
    titulo: 'Nueva sesión agendada',
    descripcion: 'Matemáticas avanzadas · Mañana 10:00 AM',
    tiempo: 'hace 5 min',
    leida: false,
    icon: CalendarDaysIcon,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    titulo: 'Emparejamiento completado',
    descripcion: '8 estudiantes fueron emparejados exitosamente',
    tiempo: 'hace 20 min',
    leida: false,
    icon: BoltIcon,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    titulo: 'Estudiante sin sesión',
    descripcion: 'Carlos Ramos lleva 3 días sin actividad',
    tiempo: 'hace 1 hora',
    leida: false,
    icon: ExclamationTriangleIcon,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    id: 4,
    titulo: 'Reporte disponible',
    descripcion: 'El reporte semanal ya está listo para descargar',
    tiempo: 'ayer',
    leida: true,
    icon: InformationCircleIcon,
    color: 'bg-gray-100 text-gray-500',
  },
])

const unreadCount = computed(() => notificaciones.value.filter(n => !n.leida).length)

function toggleNotif() {
  showNotif.value = !showNotif.value
  showUserMenu.value = false
}

function marcarLeida(n: Notif) {
  n.leida = true
}

function markAllRead() {
  notificaciones.value.forEach(n => (n.leida = true))
}

// ── user menu ─────────────────────────────
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  showNotif.value = false
}

// ── click outside ─────────────────────────
function handleClickOutside(e: MouseEvent) {
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) {
    showNotif.value = false
  }
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>