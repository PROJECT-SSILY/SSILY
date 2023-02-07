<template>
<div class="userinfo-item-wrapper">
  <!-- <div class="userinfo-item">
    <p>{{ team }}, {{ connectionId }}, {{ myConnectionId }}</p>
    <h1>닉네임: {{ player.nickname }}</h1>
      <p>레벨: {{ player.level }}</p>
      <p>팀: {{ player.team }}</p>
      <p>방장여부: {{ player.isHost }}</p>
      <p>경험치: {{ player.exp }}</p>
    </div> -->
</div>
</template>

<script>
// import { useStore } from "vuex"
// import { computed, watch } from '@vue/runtime-core'

// import { play } from "@tensorflow/tfjs-core/dist/test_util"


export default {
  name: 'UserInfo',
  components: {
  },
  // props: {
  //   player: Object,
  //   myConnectionId: String,
  //   myTeam: String
  // },
  setup() {
    // const store = useStore()
    // const state ={
    //   nickname: props.player.nickname,
    //   level: props.player.level,
    //   team: props.player.team,
    //   isHost: props.player.isHost,
    //   exp: props.player.exp,
    //   connectionId: props.myConnectionId,
    // }
    // const team = computed(() => props.connectionId == props.myConnectionId)
    // watch(props.myTeam, () => {
    //   () => {
    //     console.log("팀선택");
    //     console.log("state.connectedId : ", props.connectionId)
    //     if(props.connectionId == props.myConnectionId) {
    //       team.value = props.myTeam
    //     } else {
    //       team.value = props.team
    //     }
    //   }
    // })

    // console.log(toRaw(props.player))


    return {
      // team
    }
  }
}
</script>

<style>

.userinfo-item-wrapper {
  display: inline-block;
  box-sizing: content-box;
  padding: 3px;
  margin: 20px 0px;
  border: 1px solid rgb(185, 185, 185);
  border-radius: 100%;
}
.userinfo-item {
  width: 300px;
  height: 300px;
  padding: 30px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 100%;
  border: 25px solid black;
  border-color: inherit;
}
.BLUE {
  border-color: #09c4ff;
}
.RED {
  border-color: #ff5f5f;
}

</style>