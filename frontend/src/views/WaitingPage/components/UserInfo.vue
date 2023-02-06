<template>
  <v-sheet
    id="player-area"
    elevation="12"
    height="500"
    width="auto"
  >

    <h1>회원 정보</h1>
    <p>닉네임: {{ playerInfo.nickname }}</p>
    <p>레벨: {{ playerInfo.level }}</p>
    <p>팀: {{ playerInfo.team }}</p>
    <p>방장여부: {{ playerInfo.isHost }}</p>
  </v-sheet>
</template>

<script>
import { useStore } from "vuex"
import { ref } from '@vue/reactivity'




export default {
  name: 'UserInfo',
  components: {
    // UserInfoItem
  },
  props: {
    player: Object
  },
  setup(props) {
    const store = useStore()
    const playerInfo = ref(props.player.content[0].player)
    return { store, playerInfo }
  }

}
</script>

<style>

</style>