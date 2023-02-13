import { createStore } from 'vuex'
import accountStore from './accountStore'
import gameStore from './gameStore'
// import createPersistedState from 'vuex-persistedstate'



export default createStore({
  modules: {
    accountStore,
    gameStore
  },
  // plugins: [createPersistedState({
  //   paths: ["gameStore"]
  // })],
})
