// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    'nuxt-lodash',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/devtools',
    '@nuxt/eslint',
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'ru',
        iso: 'ru-RU',
        name: 'Русский',
        file: 'ru.json',
      },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    },
  },
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      extends: ['@task-manager/eslint-config-nuxt'],
    },
  },
});

