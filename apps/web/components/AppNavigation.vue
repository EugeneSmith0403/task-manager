<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Task Manager
          </NuxtLink>
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              exact-active-class="text-blue-600 bg-blue-50 font-medium"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
            <NuxtLink
              to="/tasks"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              active-class="text-blue-600 bg-blue-50 font-medium"
            >
              {{ $t('nav.tasks') }}
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <v-select
            v-model="selectedLocale"
            :items="locales"
            item-title="name"
            item-value="code"
            density="compact"
            variant="outlined"
            hide-details
            class="language-select"
            style="max-width: 150px;"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n();

const locales = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
];

const selectedLocale = computed({
  get: () => locale.value,
  set: (value: string) => {
    setLocale(value as 'en' | 'ru');
  },
});
</script>

<style scoped>
:deep(.language-select .v-field) {
  min-height: 40px;
}

:deep(.language-select .v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>

