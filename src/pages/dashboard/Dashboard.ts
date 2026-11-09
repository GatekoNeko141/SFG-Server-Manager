import { onMounted, onUnmounted, ref } from 'vue'

import { useUi } from '@/composables/useUi'
import {
  type IServerAction,
  type IServerStatusResponse,
  type IServerStatusList,
  type IServerWorlds
} from '@/interfaces/GameServer'

import { useGamesStore } from '@/store/useGamesStore'

export const useDashboard = () => {
  const { _getAllServers, _postTurnServer, _getWorlds, _postSelectWorld } = useGamesStore()

  const { useMainLoader, useAlert } = useUi()

  const gameList = ref<IServerStatusList[]>([])

  const worldServers = ['minecraftbe']

  const serverWorlds = ref<Record<string, IServerWorlds>>({})
  const selectedWorlds = ref<Record<string, string>>({})

  const hasWorlds = (serviceName: string) => worldServers.includes(serviceName)

  const getWorlds = async (serviceName: string) => {
    const data = await _getWorlds(serviceName)
    serverWorlds.value[serviceName] = data
    selectedWorlds.value[serviceName] = data.active_world ?? ''
  }

  const getAllServers = async (showAlert = true) => {
    useMainLoader(true)
    gameList.value = await _getAllServers()

    await Promise.allSettled(
      gameList.value
        .filter((game) => hasWorlds(game.service_name))
        .map((game) => getWorlds(game.service_name))
    )

    if (showAlert) {
      useAlert({
        message: `Listado obtenido exitosamente`,
        type: 'success',
        duration: 3000
      })
    }
    useMainLoader(false)
  }

  const turnServer = async (serverName:string, action: IServerAction) => {
    useMainLoader(true)
    const data:IServerStatusResponse = await _postTurnServer(serverName, action)
    if(data.success){
      getAllServers(false)
    }
    useMainLoader(false)
  }

  const worldModalService = ref<string | null>(null)

  const confirmingWorld = ref(false)

  const openWorldModal = (serviceName: string) => {
    selectedWorlds.value[serviceName] = serverWorlds.value[serviceName]?.active_world ?? ''
    confirmingWorld.value = false
    worldModalService.value = serviceName
  }

  const closeWorldModal = () => {
    confirmingWorld.value = false
    worldModalService.value = null
  }

  const selectWorld = async (serviceName: string) => {
    const worldName = selectedWorlds.value[serviceName]

    if (!worldName || worldName === serverWorlds.value[serviceName]?.active_world) return

    const isOnline = gameList.value.find((game) => game.service_name === serviceName)?.is_online
    if (isOnline && !confirmingWorld.value) {
      confirmingWorld.value = true
      return
    }

    closeWorldModal()
    useMainLoader(true)
    await _postSelectWorld(serviceName, worldName)
    await getAllServers(false)
  }

  const failedImages = ref<Record<string, boolean>>({})

  const handleImageError = (serviceName: string) => {
    console.log(serviceName)
    failedImages.value[serviceName] = true
  }

  onMounted(() => {
    getAllServers()
  })

  return {
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
  }
}