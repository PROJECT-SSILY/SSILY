<template>
<div class="wrapper-item-userinfo ">
  <div class="item-userinfo">
    <div class="box-char">
      <v-img id="character" :src="require(`@/assets/images/${state.robot}.svg`)" alt=""/>
    </div>
    <div class="box-nickname">
      <p>{{ user.nickname }}</p>
    </div>
    <v-img src="@/assets/images/star.svg" alt="host" v-if="user.isHost" id="host"/>
    <!-- <p>레벨: {{ user.level }}</p>
    <p>팀: {{ user.team }}</p> -->
    
    <!--<p>경험치: {{ user.exp }}</p> -->
    <p id="ready" v-if="user.isReady">READY</p>
  </div>
</div>
</template>

<script>
import { useStore } from "vuex"
import { computed, reactive } from "vue"

export default {
  name: 'UserInfo',
  props: {
    user: Object
  },
  setup(props) {
    const store = useStore()
    const state = reactive({
      image: null,
      robot: computed(() => {
        if (props.user.level >= 0 && props.user.level < 6) {
          return "ssily1"
        } else if (props.user.level >= 6 && props.user.level < 11) {
          return "ssily2"
        } else {
          return "ssily3"
        }
      }),
    })
    return {
      store,
      state,
    }
  }
}
</script>

<style lang="scss" scoped>
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
$hover_top: 20px;
$hover_bottom: 0px;  

#character {
  height: 140px;
  animation:hover 1.1s ease-in-out 0s infinite alternate;
}

@keyframes hover { 
    0% { transform: translate3d(0,$hover_top,0) }
    100% { transform: translate3d(0,$hover_bottom,0) }
}
#ready {
  font-size: 30px;
  color: #24cb83;
  font-weight: 700;
  position: absolute;
  bottom: 59px;
  text-shadow: -1px 0px 10px #e4ff00, 0 1px #e4ff00, 1px 0 #e4ff00, 0 -1px #e4ff00;
  width: 100%;
}
#host {
  position: absolute;
  left: 15px;
  top: 15px;
  width: 20px;
  background: #edb100;
  height: 20px;
  border-radius: 10px;
}
</style>