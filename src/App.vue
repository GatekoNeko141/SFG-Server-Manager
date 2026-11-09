<template>
  <div class="flex h-screen w-full bg-[#1e1f22] text-gray-200 font-sans overflow-hidden relative">
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="isMobileMenuOpen = false"
    ></div>

    <section 
      :class="[
        'w-60 bg-[#2b2d31] flex flex-col justify-between fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="font-bold text-white tracking-wide">SFG SV MANAGER</h1>
          <span class="text-xs bg-[#232428] px-2 py-1 rounded text-green-400 font-mono">ONLINE</span>
        </div>
        
        <nav class="flex flex-col gap-1">
          <button
            v-for="navbarItem in navbarList"
            @click="handleTabSelect(navbarItem.name)"
            :class="['w-full text-left px-3 py-2 rounded font-medium transition-colors text-sm', currentTab === navbarItem.name ? 'bg-[#35373c] text-white' : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200']"
          >
            {{ navbarItem.icon }} {{ navbarItem.title }}
          </button>
        </nav>
      </div>

      <div class="p-3 bg-[#232428] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            UX
          </div>
          <div class="leading-tight">
            <p class="text-xs font-bold text-white">sfgserver</p>
            <p class="text-[10px] text-gray-400">#0001</p>
          </div>
        </div>
        <span class="text-gray-400 hover:text-white cursor-pointer text-sm">⚙️</span>
      </div>
    </section>

    <main class="flex-1 bg-[#313338] flex flex-col overflow-y-auto w-full">
      <header class="h-12 border-b border-[#1f2023] px-4 md:px-6 flex items-center justify-between shadow-sm bg-[#313338] sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="text-gray-400 hover:text-white block md:hidden text-xl focus:outline-none p-1"
          >
            ☰
          </button>
          
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-lg">#</span>
            <span class="font-semibold text-white">{{ currentTab }}</span>
          </div>
        </div>
      </header>

      <RouterView />
    </main>

  </div>

  <GlobalAlert />
  <MainLoader />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLoader from '@/components/generalComponents/mainLoader/mainLoader.vue'
import GlobalAlert from '@/components/generalComponents/alert/alert.vue'

// Logic view
import { useApp } from '@/App'

const {
  currentTab,
  navbarList,
  isMobileMenuOpen,
  handleTabSelect,
} = useApp()
</script>