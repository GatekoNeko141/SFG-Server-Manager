<template>
  <div class="p-6">
    <div class="mb-8 p-6 rounded-lg bg-gradient-to-r from-[#171a21] to-[#2a475e] border border-[#3a6180] shadow-xl relative overflow-hidden">
      
      <div class="relative z-10 max-w-lg">
        <span class="text-xs font-bold text-[#66c0f4] tracking-widest uppercase">
          {{ welcomeText || '¡Bienvenido!' }}
        </span>
        
        <h2 class="text-3xl font-extrabold text-white mt-1 mb-2 tracking-tight">
          {{ title }}
        </h2>
        
        <p class="text-sm text-gray-300 leading-relaxed">
          {{ description }}
        </p>
      </div>
      
      <div class="absolute right-0 bottom-0 text-9xl opacity-10 select-none translate-y-6 translate-x-4">
        {{ icon || '⚡' }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { type MegaCardInterface } from '@/components/generalComponents/megaCard/megaCard'

const props = defineProps<MegaCardInterface>()

</script>
