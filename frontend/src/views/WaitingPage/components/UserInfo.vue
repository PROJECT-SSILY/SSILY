<template>
<div class="userinfo-item-wrapper ">
  <div class="userinfo-item">
    <h1>닉네임: {{ user.nickname }}</h1>
    <p>레벨: {{ user.level }}</p>
    <p>팀: {{ user.team }}</p>
    <p>방장여부: {{ user.isHost }}</p>
    <p>경험치: {{ user.exp }}</p>
    <p>레디: {{ user.isReady }}</p>
    <p>설명자여부: {{ user.isPresenter }}</p>
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

.userinfo-item-wrapper {
  display: inline-block;
  box-sizing: content-box;
  padding: 3px;
  margin: 20px 0px;
  border: 1px solid rgb(185, 185, 185);
  border-radius: 100%;
}
.userinfo-item {
  width: 297px;
  height: 297px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 100%;
  border: 35px solid black;
  border-color: inherit;
  box-shadow: inset 0px 0px 7px 1px;
}
.BLUE {
  border-color: #09c4ff;
}
.RED {
  border-color: #ff5f5f;
}

</style>