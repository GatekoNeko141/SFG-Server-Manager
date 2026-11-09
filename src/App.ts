import { ref } from 'vue'

export const useApp = () => {
  const currentTab = ref('Servidores')

  const selectTab = (tabName: string) => {
    currentTab.value = tabName
  }

  const navbarList = ref([
    { id: 1, title: 'Lista de servidores', name: 'Servidores', icon: '📁'},
  ])

  const isMobileMenuOpen = ref(false)

  const handleTabSelect = (tabName: string) => {
    selectTab(tabName)
    isMobileMenuOpen.value = false
  }

  return {
    currentTab,
    navbarList,
    isMobileMenuOpen,
    handleTabSelect,
  }
}