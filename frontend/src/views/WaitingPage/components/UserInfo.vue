<template>
<div class="userinfo-item-wrapper" :class="team">
  <div class="userinfo-item" :class="team">
    <h1>닉네임: {{ state.nickname }}</h1>
      <p>레벨: {{ state.level }}</p>
      <p>팀: {{ state.team }}</p>
      <p>방장여부: {{ state.isHost }}</p>
      <p>경험치: {{ state.exp }}</p>      
    </div>
</div>
</template>

<script>
import { useStore } from "vuex"
import { computed, watch } from '@vue/runtime-core'
// import { play } from "@tensorflow/tfjs-core/dist/test_util"


export default {
  name: 'UserInfo',
  components: {
  },
  props: {
    player: Object,
    myConnectionId: String,
    myTeam: String
  },
  setup(props) {
    const store = useStore()
    const state ={
      nickname: props.player.player.nickname,
      level: props.player.player.level,
      team: props.player.player.team,
      isHost: props.player.player.isHost,
      exp: props.player.player.exp,
      connectionId: props.player.connectionId,
      isReady: false,
    }
    const team = computed(() => {
        console.log("팀선택");
        console.log("state.connectedId : ", props.player.connectionId)
        if(state.connectionId == props.myConnectionId) {
          return props.myTeam
        } else {
           state.team
        }
    })

    // console.log(toRaw(props.player))
    watch(props.myTeam, () => {
      () => {
        console.log("팀선택");
        console.log("state.connectedId : ", state.connectionId)
        if(state.connectionId == props.myConnectionId) {
          team.value = props.myTeam
        } else {
          team.value = state.team
        }
      }
    })
    return { store, state, team}
  }
}
</script>

<style>

.userinfo-item-wrapper {
  display: inline-block;
  box-sizing: content-box;
  padding: 3px;
  border: 1px solid rgb(185, 185, 185);
  border-radius: 100%;
}
.userinfo-item {
  width: 180px;
  height: 180px;
  padding: 30px;
  box-sizing: content-box;
  background-color: white;
  border-radius: 100%;
  border: 25px solid black;
  border-color: inherit;
}
.userinfo-item-wrapper.BLUE {
  border-color: #09c4ff;
}
.userinfo-item-wrapper.RED {
  border-color: #ff5f5f;
}

</style>