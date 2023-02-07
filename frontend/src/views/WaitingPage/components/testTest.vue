<template>
  <div>
    <h1>test Test</h1>
    sessionVal:  {{ sessionVal }}
    
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue'

export default {
    name: 'testTest',  
    setup() {
      const store = useStore()
      const getSession = computed(store.getters['gameStore/getSession'])
      const sessionVal = computed(() => store.state.gameStore.session)


      return { getSession, sessionVal  }
    }

}
</script>

<style>

</style>