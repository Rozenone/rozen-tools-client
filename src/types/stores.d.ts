declare module '@/stores' {
  const createStore: () => {
    top: {
      leftDrawerOpen: boolean
      rightDrawerOpen: boolean
      toggleLeftDrawer: () => void
      toggleRightDrawer: () => void
    }
  }
  export default createStore
} 