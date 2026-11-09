export interface IServerStatusList {
  service_name: string
  status: string
  is_online: boolean
  player_count?: number
}

export interface IServerStatusResponse {
  action: string
  error: string
  return_code: number
  service_name: string
  success: boolean
}

export type IServerAction = 'start' | 'stop' | 'restart'

export interface IServerWorlds {
  service_name: string
  active_world: string | null
  worlds: string[]
}

export interface ISelectWorldResponse {
  action: string
  service_name: string
  success: boolean
  active_world: string | null
  restarted: boolean
  error: string
}