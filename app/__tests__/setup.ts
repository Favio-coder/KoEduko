import { vi } from 'vitest'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useRoute: () => ({
    path: '/principal',
    query: {},
  }),
}))

const mockNuxt = {
  defineNuxtRouteMiddleware: (fn: any) => fn,
  definePageMeta: () => undefined,
  navigateTo: vi.fn(),
}

vi.stubGlobal('defineNuxtRouteMiddleware', mockNuxt.defineNuxtRouteMiddleware)
vi.stubGlobal('definePageMeta', mockNuxt.definePageMeta)
vi.stubGlobal('navigateTo', mockNuxt.navigateTo)
