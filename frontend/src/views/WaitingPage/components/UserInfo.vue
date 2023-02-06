<template>
<div class="userinfo-item-wrapper" :class="team">
  <div class="userinfo-item" :class="team">
    <h1>회원 정보</h1>
    <p>{{  team  }}</p>
    <p>닉네임: {{ playerInfo.nickname }}</p>
    <p>레벨: {{ playerInfo.level }}</p>
    <p>팀: {{ playerInfo.team }}</p>
    <p>방장여부: {{ playerInfo.isHost }}</p>
  </div>
</div>
</template>

<script>
import { useStore } from "vuex"
import { ref } from '@vue/reactivity'
import { computed, onUpdated, watch } from '@vue/runtime-core'
// import { play } from "@tensorflow/tfjs-core/dist/test_util"




export default {
  name: 'UserInfo',
  components: {
    // UserInfoItem
  },
  props: {
    player: Object,
    connectedId: String,
    myTeam: String
  },
  setup(props) {
    const store = useStore()
    const playerInfo = ref(props.player.content[0].player)
    const team = computed(() => props.myTeam)

    onUpdated(() => {
      console.log(team);
    })
    watch(props.myTeam, () => {
      () => {
        console.log("팀선택");
        if(playerInfo.connectionId == props.connectedId) {
          team.value = props.myTeam
        } else {
          team.value = playerInfo.player.team
        }
      }
    })

    return { store, playerInfo, team }
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
  border-color: #00E0FF;
}
.userinfo-item-wrapper.RED {
  border-color: #FF0000;
}

</style>