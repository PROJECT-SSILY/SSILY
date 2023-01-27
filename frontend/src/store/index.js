import { createStore } from 'vuex'
import accountStore from './accountStore'



export default createStore({
  modules: {
    accountStore
  }
})
