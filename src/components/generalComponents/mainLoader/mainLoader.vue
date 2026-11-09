<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isMainLoaderActive" 
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111214]/80 backdrop-blur-sm select-none"
    >
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-4 border-[#2b2d31]"></div>
        <div class="absolute inset-0 rounded-full border-4 border-[#5865F2] border-t-transparent animate-spin"></div>
      </div>
      
      <p class="mt-4 text-sm font-semibold tracking-wide text-gray-300 uppercase animate-pulse">
        Cargando...
      </p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUi } from '@/composables/useUi'

const { isMainLoaderActive } = useUi()
</script>