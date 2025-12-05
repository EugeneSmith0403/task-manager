<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="text-center px-4 py-8 max-w-2xl">
      <h1 class="text-5xl font-bold text-gray-800 mb-6">
        {{ $t('home.welcome') }}
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        {{ $t('home.description') }}
      </p>
      <NuxtLink
        to="/tasks"
        class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
      >
        {{ $t('home.viewTasks') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Task Manager',
});
</script>

