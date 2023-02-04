<template>
  <v-sheet
    id="player-area"
    elevation="12"
    height="500"
    width="auto"
  >
  <h1> player </h1>
  <!-- {{ props.player }} -->
    <!-- <UserInfoItem
    :playerList="playerList"/> -->
  </v-sheet>
</template>

<script>
import { useStore } from "vuex"
// import UserInfoItem from './UserInfoItem.vue';




export default {
  name: 'UserInfo',
  components: {
    // UserInfoItem
  },
  props: {
    player: Object
  },
  setup() {
    const store = useStore()
    return { store }
  }

}
</script>

<style>

</style>