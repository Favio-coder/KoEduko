import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
      '@': resolve(__dirname, 'app'),
      '#imports': resolve(__dirname, 'app/__tests__/mocks/imports.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['app/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'json'],
      reportsDirectory: './coverage',
      include: [
        'app/stores/**',
        'app/composable/**',
        'app/services/**',
        'app/middleware/**',
      ],
    },
    reporters: ['default', 'html'],
    outputFile: './test-report/index.html',
    setupFiles: ['./app/__tests__/setup.ts'],
  },
})
