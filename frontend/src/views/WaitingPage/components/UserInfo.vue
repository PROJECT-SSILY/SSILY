<template>
  <v-sheet
    id="player-area"
    elevation="12"
    height="500"
    width="auto"
  >
    <h1>닉네임: {{ player.player.nickname }}</h1>
      <p>레벨: {{ player.player.level }}</p>
      <p>팀: {{ player.player.team }}</p>
      <p>방장여부: {{ player.player.isHost }}</p>
      <p>경험치: {{ player.player.exp }}</p>
  </v-sheet>
</template>

<script>
import { useStore } from "vuex"



export default {
  name: 'UserInfo',
  components: {
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