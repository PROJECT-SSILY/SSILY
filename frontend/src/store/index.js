import { createStore } from 'vuex'
import accountStore from './accountStore'
import gameStore from './gameStore'



export default createStore({
  modules: {
    accountStore,
    gameStore
  }
})
