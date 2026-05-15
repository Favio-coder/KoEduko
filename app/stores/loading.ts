import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {

    state: () => ({
        loading: false,
        requests: 0
    }),

    actions: {

        start() {

            this.requests++

            this.loading = true

        },

        stop() {

            this.requests--

            if (this.requests <= 0) {

                this.loading = false
                this.requests = 0

            }
        }

    }

})