<template>
<div class="wrapper-item-userinfo ">
  <div class="item-userinfo">
    <div class="box-char">
      <v-img id="character" src="@/assets/images/character.svg" alt=""/>
    </div>
    <div class="box-nickname">
      <p>{{ user.nickname }}</p>
    </div>
    <!-- <p>레벨: {{ user.level }}</p>
    <p>팀: {{ user.team }}</p>
    <p>방장여부: {{ user.isHost }}</p>
    <p>경험치: {{ user.exp }}</p>
    <p>레디: {{ user.isReady }}</p>
    <p>설명자여부: {{ user.isPresenter }}</p> -->
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

<style scoped>
.box-char {
  height: 100%;
  padding: 10px;
}
.box-nickname {
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0 auto;
  font-size: 20px;
  padding: 10px;
  color: #e8e8e8;
}
#character {
  height: 140px;
}
</style>