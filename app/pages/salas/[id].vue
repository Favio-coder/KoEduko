<template>
    <div class="space-y-6">
        <h1 class="text-xl font-bold mb-4">Sala en vivo</h1>
        <div id="jitsi-container"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  const script = document.createElement("script")
  script.src = "https://meet.jit.si/external_api.js"
  script.async = true

  script.onload = () => {
    iniciarJitsi()
  }

  document.body.appendChild(script)
})

function iniciarJitsi() {
  const domain = "meet.jit.si"

  const options = {
    roomName: `KoEduko-${route.params.id}`,
    width: "100%",
    height: 600,
    parentNode: document.querySelector("#jitsi-container"),

    userInfo: {
      displayName: authStore.user?.nombre || "Usuario"
    }
  }

  const api = new (window as any).JitsiMeetExternalAPI(domain, options)

  api.addEventListener("participantJoined", (e: any) => {
  
  })
}
</script>

