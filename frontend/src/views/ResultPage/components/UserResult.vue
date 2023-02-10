<template>
  <div>
    <h1> {{ state.winner }} WON! </h1>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex';

export default {
  name: "UserResult",
  setup() {
    const store = useStore()
    const state = reactive({
      winner: '',
    })
    return {
      store,
      state
    }
  }

}
</script>

<style>

</style>