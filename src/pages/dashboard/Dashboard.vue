<template>
  <MegaCard 
    welcomeText="¡Bienvenido!"
    title="Panel de control"
    description="Administrador de servidores de SFG (Se cuidadoso, mañoso 🫵🤨)"
    icon="🎮"
  />

  <div class="flex items-center justify-between mb-4 px-6">
    
    <h3 class="text-sm font-bold text-gray-400 tracking-wider uppercase">
      Listado
    </h3>

    <button 
      class="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 bg-[#2b2d31] border border-[#1e1f22] hover:bg-[#35373c] hover:text-white transition-colors duration-150 shadow-md cursor-pointer group"
      @click="getAllServers()"
    >
      <span class="text-sm transition-transform duration-300 group-hover:rotate-180 inline-block">
        🔄
      </span>
      <span>Recargar</span>
    </button>

  </div>
    
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
    <div 
      v-for="game in gameList"
      :key="game.service_name"
      class="bg-[#2b2d31] rounded-lg overflow-hidden border border-[#1e1f22] hover:border-[#43444b] transition-all hover:-translate-y-0.5 shadow-md flex flex-col"
    >
      <div
        :class="[
          'h-28 bg-cover bg-center p-4 flex flex-col justify-between relative transition-all duration-300',
          failedImages[game.service_name] ? 'from-orange-500 to-amber-600 bg-gradient-to-br' : ''
        ]"
        :style="!failedImages[game.service_name] ? { backgroundImage: `url('/games/${game.service_name.toLowerCase()}.png')` } : {}"
      >
        <img 
          v-if="!failedImages[game.service_name]"
          :src="`/games/${game.service_name.toLowerCase()}.png`" 
          @error="handleImageError(game.service_name)"
          class="hidden" 
        />

        <div v-if="!failedImages[game.service_name]" class="absolute inset-0 bg-black/40 z-0"></div>

        <div class="z-10 flex items-start justify-between">
          <span class="text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded text-white backdrop-blur-sm uppercase">
            Juego {{ game.is_online ? 'Activo' : 'Inactivo' }}
          </span>

          <span
            v-if="game.is_online"
            :title="game.player_count == null ? 'No se pudo obtener el número de jugadores' : 'Jugadores conectados'"
            :class="['text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm',
              game.player_count ? 'text-green-400' : 'text-white']"
          >
            👥 {{ game.player_count ?? '0' }}
          </span>
        </div>
        <h4 class="z-10 text-lg font-bold text-white drop-shadow-md capitalize">
          {{ game.service_name }}
        </h4>
      </div>

      <div class="p-4 flex items-center justify-between text-xs bg-[#232428]/50 border-t border-[#1e1f22]">
        <div class="flex items-center gap-2">
          <span 
            :class="['w-2.5 h-2.5 rounded-full inline-block animate-pulse shadow-lg', 
              game.is_online ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50']"
          ></span>
          <span :class="['font-semibold uppercase tracking-wider text-[10px]', game.is_online ? 'text-green-400' : 'text-red-400']">
            {{ game.is_online ? 'Online' : 'Offline' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button 
            v-if="hasWorlds(game.service_name) && serverWorlds[game.service_name]"
            @click="openWorldModal(game.service_name)"
            class="px-3 py-1.5 rounded font-bold transition-all duration-150 uppercase tracking-wide text-[10px] text-white shadow-md bg-sky-600/80 hover:bg-sky-600 active:bg-sky-700 hover:shadow-sky-900/20"
          >
            Mundo 🌍
          </button>

          <button 
            v-if="game.is_online"
            @click="turnServer(game.service_name, 'restart')"
            class="px-3 py-1.5 rounded font-bold transition-all duration-150 uppercase tracking-wide text-[10px] text-white shadow-md bg-amber-600/80 hover:bg-amber-600 active:bg-amber-700 hover:shadow-amber-900/20"
          >
            Reiniciar 🔄
          </button>

          <button 
            @click="game.is_online ? turnServer(game.service_name, 'stop') : turnServer(game.service_name, 'start')"
            :class="['px-3 py-1.5 rounded font-bold transition-all duration-150 uppercase tracking-wide text-[10px] text-white shadow-md',
              game.is_online 
                ? 'bg-red-600/80 hover:bg-red-600 active:bg-red-700 hover:shadow-red-900/20' 
                : 'bg-emerald-600/80 hover:bg-emerald-600 active:bg-emerald-700 hover:shadow-emerald-900/20']"
          >
            {{ game.is_online ? 'Apagar 🛑' : 'Encender 🟩' }}
          </button>
        </div>
      </div>

    </div>
  </div>

  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition ease-in duration-150"
    leave-to-class="opacity-0"
  >
    <div
      v-if="worldModalService"
      class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeWorldModal"
    >
      <div class="w-full max-w-md bg-[#2b2d31] border border-[#1e1f22] rounded-lg shadow-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-[#1e1f22] flex items-center justify-between">
          <h3 class="text-white font-bold">🌍 Seleccionar mundo</h3>
          <button
            @click="closeWorldModal"
            class="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-[#35373c]"
          >
            ✕
          </button>
        </div>

        <div class="p-5 flex flex-col gap-2">
          <label for="world-select" class="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
            Mundo ({{ serverWorlds[worldModalService]?.worlds.length }} disponibles)
          </label>

          <select
            id="world-select"
            v-model="selectedWorlds[worldModalService]"
            @change="confirmingWorld = false"
            class="w-full bg-[#1e1f22] border border-[#3a3c42] rounded px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-[#66c0f4] cursor-pointer"
          >
            <option
              v-for="world in serverWorlds[worldModalService]?.worlds"
              :key="world"
              :value="world"
            >
              {{ world }}{{ world === serverWorlds[worldModalService]?.active_world ? ' (actual)' : '' }}
            </option>
          </select>
        </div>

        <div
          v-if="confirmingWorld"
          class="mx-5 mb-5 p-3 rounded border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 text-xs leading-snug flex gap-2"
        >
          <span>⚠️</span>
          <span>
            El servidor se va a <strong>reiniciar</strong> para cambiar al mundo
            "<strong>{{ selectedWorlds[worldModalService] }}</strong>". Los jugadores conectados serán desconectados.
          </span>
        </div>

        <div class="px-5 py-4 bg-[#232428]/50 border-t border-[#1e1f22] flex items-center justify-end gap-3">
          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="closeWorldModal"
              class="px-3 py-1.5 rounded font-bold uppercase tracking-wide text-[10px] text-gray-300 bg-[#35373c] hover:bg-[#3f4147] transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="selectWorld(worldModalService)"
              :disabled="!selectedWorlds[worldModalService] || selectedWorlds[worldModalService] === serverWorlds[worldModalService]?.active_world"
              :class="['px-3 py-1.5 rounded font-bold uppercase tracking-wide text-[10px] text-white shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                confirmingWorld
                  ? 'bg-amber-600/80 hover:bg-amber-600 active:bg-amber-700'
                  : 'bg-sky-600/80 hover:bg-sky-600 active:bg-sky-700']"
            >
              {{ confirmingWorld ? 'Sí, reiniciar' : 'Aplicar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
      
</template>

<script setup lang="ts">
// Components
import MegaCard from '@/components/generalComponents/megaCard/megaCard.vue'

// Logic view
import { useDashboard } from '@/pages/dashboard/Dashboard.ts'


interface IGame {
  service_name: string
  is_online: boolean
}

const {
  gameList,
  failedImages,
  serverWorlds,
  selectedWorlds,
  worldModalService,
  confirmingWorld,

  hasWorlds,
  openWorldModal,
  closeWorldModal,
  getAllServers,
  turnServer,
  selectWorld,
  handleImageError,
} = useDashboard()
</script>