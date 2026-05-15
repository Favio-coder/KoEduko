<template>
  <Transition name="fade">
    
    <div
      v-if="loading"
      class="fixed inset-0 z-9999 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center"
    >

      <!-- Logo -->
      <img
        src="/logo/logEddukko-solo.png"
        class="w-24 h-24 object-contain animate-pulse"
      />

      <!-- Bolitas -->
      <div class="flex items-center gap-2 mt-5">

        <div class="w-3 h-3 rounded-full bg-emerald-500 animate-bounce"></div>

        <div
          class="w-3 h-3 rounded-full bg-emerald-500 animate-bounce"
          style="animation-delay: 0.15s"
        ></div>

        <div
          class="w-3 h-3 rounded-full bg-emerald-500 animate-bounce"
          style="animation-delay: 0.3s"
        ></div>

      </div>

    </div>

  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '~/stores/loading'

const loadingStore = useLoadingStore()

const loading = computed(() => loadingStore.loading)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>