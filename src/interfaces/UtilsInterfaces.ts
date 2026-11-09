export type IAlertType = 'success' | 'error' | 'warning' | 'info'

export interface IAlertOptions {
  message: string
  type?: IAlertType
  duration?: number
}