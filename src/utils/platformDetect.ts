/**
 * 判断当前是否在 Electron 环境中运行
 */
export const isElectron = (): boolean => {
  return !!(window.electron?.ipcRenderer)
}

/**
 * 判断当前是否在纯浏览器环境中运行
 */
export const isBrowser = (): boolean => {
  return !isElectron()
}
