import { apiClient } from '@/services/apiClient'

import { useUi } from '@/composables/useUi'

import {
  type IServerAction,
  type IServerStatusResponse,
  type IServerStatusList,
  type IServerWorlds,
  type ISelectWorldResponse
} from '@/interfaces/GameServer'

const actionLabels: Record<IServerAction, string> = {
  start: 'Iniciar',
  stop: 'Detener',
  restart: 'Reiniciar'
}

const actionDoneLabels: Record<IServerAction, string> = {
  start: 'encendido',
  stop: 'apagado',
  restart: 'reiniciado'
}

export const useGamesStore = () => {
  const { useAlert, useMainLoader } = useUi()

  const actions = {

    _getAllServers: (): Promise<IServerStatusList[]> => {
      return apiClient.get<IServerStatusList[]>('/get_all_servers')
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          useAlert({
            message: `Error al intentar obtener el listado.`,
            type: 'error',
            duration: 3000
          })

          useMainLoader(false)
          throw error
        })
    },

    _postTurnServer: (game: string, action: IServerAction): Promise<IServerStatusResponse> => {
      return apiClient.post<IServerStatusResponse>(`servers/${game}/${action}`)
        .then((response) => {
          useAlert({
            message: response.data.success
              ? `Cambios realizados con éxito: servidor de ${game} ${actionDoneLabels[action]}.`
              : `No se pudo ${actionLabels[action].toLowerCase()} el servidor de ${game}: ${response.data.error}`,
            type: response.data.success ? 'success' : 'error',
            duration: 3000
          })

          return response.data
        })
        .catch((error) => {
          useAlert({
            message: `Error al intentar ${actionLabels[action].toLowerCase()} el servidor de ${game}.`,
            type: 'error',
            duration: 3000
          })

          useMainLoader(false)
          throw error 
        })
    },

    _getWorlds: (game: string): Promise<IServerWorlds> => {
      return apiClient.get<IServerWorlds>(`servers/${game}/worlds`)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          useAlert({
            message: `Error al obtener los mundos de ${game}.`,
            type: 'error',
            duration: 3000
          })

          throw error
        })
    },

    _postSelectWorld: (game: string, worldName: string): Promise<ISelectWorldResponse> => {
      return apiClient.post<ISelectWorldResponse>(`servers/${game}/worlds/active`, { world_name: worldName })
        .then((response) => {
          useAlert({
            message: response.data.success
              ? `Cambios realizados con éxito: mundo de ${game} cambiado a "${response.data.active_world}"${response.data.restarted ? ' y servidor reiniciado' : ''}.`
              : `No se pudo cambiar el mundo: ${response.data.error}`,
            type: response.data.success ? 'success' : 'error',
            duration: 4000
          })

          return response.data
        })
        .catch((error) => {
          useAlert({
            message: `Error al intentar cambiar el mundo de ${game}.`,
            type: 'error',
            duration: 3000
          })

          useMainLoader(false)
          throw error
        })
    }
  }

  return {
    ...actions
  }
}