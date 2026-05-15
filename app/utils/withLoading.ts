import { useLoadingStore } from '~/stores/loading'

export async function withLoading<T>(
    fn: () => Promise<T>
): Promise<T> {

    const loadingStore = useLoadingStore()

    try {

        loadingStore.start()

        return await fn()

    } finally {

        loadingStore.stop()

    }
}