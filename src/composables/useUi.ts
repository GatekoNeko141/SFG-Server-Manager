import { ref } from 'vue'

import { type IAlertType, type IAlertOptions } from '@/interfaces/UtilsInterfaces'

const isMainLoaderActive = ref<boolean>(false)

const alertIsVisible = ref(false)
const alertMessage = ref('')
const alertType = ref<IAlertType>('info')
let timeoutId: ReturnType<typeof setTimeout> | null = null

export const useUi = () => {
  const useMainLoader = (status: boolean) => {
    isMainLoaderActive.value = status
  }

  const useAlert = ({ message, type = 'info', duration = 3000 }: IAlertOptions) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    alertMessage.value = message
    alertType.value = type
    alertIsVisible.value = true

    timeoutId = setTimeout(() => {
      alertIsVisible.value = false
    }, duration)
  }

  const closeAlert = () => {
    if (timeoutId) clearTimeout(timeoutId)
    alertIsVisible.value = false
  }

  return {
    alertIsVisible,
    alertMessage,
    alertType,
    isMainLoaderActive,

    useMainLoader,
    useAlert,
    closeAlert,
  }
}
