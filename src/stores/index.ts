import topStore from './top/topStore'

const createStore = () => {
  return {
    top: topStore()
  }
}

export default createStore