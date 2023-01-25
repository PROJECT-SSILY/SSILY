<template>
  <div id="flex-container">
    <div class="flex-item">
      <UserInfo/>
    </div>
    <div class="flex-item">
      <p>{{ team  || '팀 선택' }}</p>
      <v-radio-group inline v-model="team">
        <v-radio label="RED" value="RED" class="ma-2"></v-radio>
        <v-radio label="BLUE" value="BLUE" class="ma-2"></v-radio>
      </v-radio-group>
      <ChatBox/>
    </div>      
  </div>
  <v-btn class="ma-2">
    READY
  </v-btn>
  <v-btn class="ma-2" @click="clickExit">
    나가기
  </v-btn>
</template>

<script>
import UserInfo from './components/UserInfo.vue';
import ChatBox from './components/ChatBox.vue';
export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
    ChatBox,
  },
  data() {
    return {
      team: null,
    }
  },
  methods: {
    clickExit() {
      this.$router.push('main')
    },
    clickReady() {
      console.log('ready 버튼 클릭')
    }
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