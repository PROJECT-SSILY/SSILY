<template>
<div class="wrapper-item-userinfo ">
  <div class="item-userinfo">
    <p>닉네임: {{ user.nickname }}</p>
    <p>레벨: {{ user.level }}</p>
    <!-- <p>팀: {{ user.team }}</p> -->
    <p>방장여부: {{ user.isHost }}</p>
    <!-- <p>경험치: {{ user.exp }}</p> -->
    <p>레디: {{ user.isReady }}</p>
    <!-- <p>설명자여부: {{ user.isPresenter }}</p> -->
  </div>
</div>
</template>

<script>
import { useStore } from "vuex"


export default {
  name: 'UserInfo',
  props: {
    user: Object
  },
  setup() {
    const store = useStore()

    return {
      store
    }
  }
}
</script>

<style>
</style>