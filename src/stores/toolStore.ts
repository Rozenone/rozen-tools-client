import { defineStore } from 'pinia'

const useToolStore = defineStore('tool', {
  state: () => ({
    favorites: [] as string[],    // 收藏的工具 title 列表
    toolOrder: [] as string[],    // 工具排序序列（存储 title）
  }),
  getters: {
    isFavorite: (state) => {
      return (title: string) => state.favorites.includes(title)
    }
  },
  actions: {
    toggleFavorite(title: string) {
      const index = this.favorites.indexOf(title)
      if (index === -1) {
        this.favorites.push(title)
      } else {
        this.favorites.splice(index, 1)
      }
    },
    updateOrder(newOrder: string[]) {
      this.toolOrder = newOrder
    },
    // 初始化排序，处理新增工具的情况
    initOrder(defaultTitles: string[]) {
      // 移除已不存在的工具
      this.toolOrder = this.toolOrder.filter(t => defaultTitles.includes(t))
      // 添加新工具到末尾
      for (const title of defaultTitles) {
        if (!this.toolOrder.includes(title)) {
          this.toolOrder.push(title)
        }
      }
      // 清理不存在的收藏
      this.favorites = this.favorites.filter(t => defaultTitles.includes(t))
    }
  },
  persist: true
})

export default useToolStore
