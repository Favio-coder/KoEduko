<template>
    <div class="space-y-6">
        <h1 class="text-2xl font-bold mb-4">Salas</h1>

        <button
            @click="nuevaSala"
            class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
            Crear sesión
        </button>

        <div v-for="s in sesiones" :key="s.id" class="bg-white p-4 mb-2 rounded shadow">
            <p>{{ s.nombre }}</p>

            <NuxtLink
                :to="`/salas/${s.id}`"
                class="text-blue-500"
            >
                Entrar
            </NuxtLink>
        </div>

    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const sesiones = ref<any[]>([])

const nuevaSala = () => {
    const id = Date.now()

    // Cambiar de nombre
    sesiones.value.push({
        id, 
        nombre: `Clase-${id}`,
        sala: `KoEduko-${id}`
    })
}

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
})



</script>