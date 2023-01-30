<template>
  <p class="text-subtitle-1">
    방 : {{ state.title }}
  </p>
  <div id="flex-container">
    <div class="flex-item">
      <UserInfo/>
    </div>
    <div id="flex-container">
      <div class="flex-item">
      <p>{{ state.team  || '팀 선택' }}</p>
      <v-radio-group inline v-model="state.team" justify-content="center">
        <v-radio label="RED" value="RED" color="red" class="ma-2"></v-radio>
        <v-radio label="BLUE" value="BLUE" color="indigo" class="ma-2"></v-radio>
      </v-radio-group> 
      <ChatBox/>
    </div>
    </div>
  </div>
  <v-btn 
  class="ma-2" 
  v-if="!state.ready"
  @Click="clickReady"
  >
  READY
  </v-btn>
  <v-btn 
  class="ma-2" 
  v-if="state.ready"
  disabled
  >
  READY함
  </v-btn>
  <v-btn class="ma-2" @click="clickExit">
    나가기
  </v-btn>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import ChatBox from './components/ChatBox.vue';
export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
    ChatBox,
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      title: "",
      team: null,
      ready: false,
    })
    function clickExit() {
      router.push({
        name: 'main'
      })
    }
    function clickReady() {
      state.ready = !state.ready
    }
    return { router, state, clickExit, clickReady }
  }
}
</script>

<style>
#flex-container {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
}

#flex-container > .flex-item {
  flex: auto;
  justify-items: stretch;
  justify-content: center;
  margin: 30px;
}

</style>