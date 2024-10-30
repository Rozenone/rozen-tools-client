import topStore from './top/topStore'

// 统一导出所有store
export default function useStore() {
    return {
        top: topStore()
    }
}