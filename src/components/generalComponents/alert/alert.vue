<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="alertIsVisible" 
      class="fixed bottom-5 right-5 z-50 flex items-center w-full max-w-md p-4 rounded-lg shadow-xl border bg-[#232428]"
      :class="typeClasses[alertType]"
    >
      <div class="flex-shrink-0 text-xl mr-3">
        {{ typeIcons[alertType] }}
      </div>
      
      <div class="flex-1 text-sm font-medium text-gray-200">
        {{ alertMessage }}
      </div>
      
      <button 
        @click="closeAlert" 
        class="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-[#35373c]"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUi } from '@/composables/useUi'

const typeClasses: Record<string, string> = {
  success: 'border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent',
  error: 'border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent',
  warning: 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent',
  info: 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent'
}

const typeIcons: Record<string, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

const {
  alertIsVisible,
  alertMessage,
  alertType,
  closeAlert
} = useUi()

</script>