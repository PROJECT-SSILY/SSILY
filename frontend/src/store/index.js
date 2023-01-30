import { createStore } from 'vuex'
import accountStore from './accountStore'
import gameroomStore from './gameroomStore'



export default createStore({
  modules: {
    accountStore,
    gameroomStore
  }
})
