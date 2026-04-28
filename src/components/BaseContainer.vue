<template>
  <div class="base-container">
    <div class="top-bar">
      <button class="lang-btn" @click="toggleLanguage">{{ t('langSwitch') }}</button>
    </div>
    <header v-if="$slots.header" class="header-slot">
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { t, toggleLanguage } from '../composables/useI18n'
</script>

<style scoped>
.base-container { padding: 20px; max-width: 1000px; margin: 0 auto; font-family: sans-serif; }
.top-bar { display: flex; justify-content: flex-end; margin-bottom: 10px; }
.lang-btn { background: #2c3e50; color: white; border: none; padding: 5px 15px; border-radius: 20px; cursor: pointer; font-weight: bold; }
.lang-btn:hover { background: #1a252f; }
.header-slot { margin-bottom: 20px; }
</style>