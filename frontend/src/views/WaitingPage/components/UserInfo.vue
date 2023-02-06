<template>
  <v-sheet
    id="player-area"
    elevation="12"
    height="500"
    width="auto"
  >
    <h1>닉네임: {{ state.nickname }}</h1>
      <p>레벨: {{ state.level }}</p>
      <p>팀: {{ state.team }}</p>
      <p>방장여부: {{ state.isHost }}</p>
      <p>경험치: {{ state.exp }}</p>
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
  setup(props) {
    const store = useStore()
    const state ={
      nickname: props.player.player.nickname,
      level: props.player.player.level,
      team: props.player.player.team,
      isHost: props.player.player.isHost,
      exp: props.player.player.exp,
    }
    return { store, state }
  }

}
</script>

<style>

</style>