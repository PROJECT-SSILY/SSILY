<template>
  <div id="flex-container">
    <div class="flex-item">
      <div class="userinfo-component">
        <UserInfo
        v-for="player in PlayerList"
        :player="player"
        :key="player.id"/>
      </div>
    </div>
    <div id="flex-container">
      <div class="flex-item">
      <p>{{ state.team  || '팀 선택' }}</p>
      <v-radio-group inline v-model="state.team" justify-content="center">
        <v-radio label="RED" value="RED" color="red" class="ma-2" @click="ClickTeam('RED')"></v-radio>
        <v-radio label="BLUE" value="BLUE" color="indigo" class="ma-2" @click="ClickTeam('BLUE')"></v-radio>
      </v-radio-group>
    </div>
    </div>
  </div>
  <v-btn class="ma-2" v-if="!state.ready" @Click="clickReady">READY</v-btn>
  <v-btn class="ma-2" v-if="state.ready" @Click="clickReady">CANCEL READY</v-btn>
  <v-btn class="ma-2" @click="clickExit">EXIT</v-btn>
  <!-- <v-btn @click="sessionInfo">session 정보</v-btn> -->

  <div id="main-container" class="container">
		<div id="join" v-if="!session">
			<div id="join-dialog" class="jumbotron vertical-center">
				<h1>Join a video session</h1>
				<div class="form-group">
					<p>
						<label>Participant</label>
						<input v-model="myUserName" class="form-control" type="text" required>
					</p>
					<p>
						<label>Session</label>
						<input v-model="mySessionId" class="form-control" type="text" required>
					</p>
					<p class="text-center">
						<button class="btn btn-lg btn-success" @click="joinSession()">Join!</button>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import $axios from "axios";
import { onUpdated } from 'vue'
import { useStore } from 'vuex';
import { changeReady } from "@/common/api/gameAPI";

$axios.defaults.headers.post['Content-Type'] = 'application/json';


export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
},
  props: {
    playerList: Object,
    session: Object,
    connectionId: String,
    sessionId: String,
  },
  emits: [
    'joinSession',
  ],
  setup(props, {emit}) {
    const router = useRouter()
    const store = useStore()
    const PlayerList = ref(props.playerList)

    onUpdated(() => {
      console.log("onupdated", PlayerList.value, document.querySelector(".userinfo-component").innerHTML)
    })

    const state = reactive({
      team: null,
      ready: false,
    })

    const clickExit = () => {
      router.push({
        name: 'main'
      })
    }

    const clickReady = async () => {
      console.log('clickready 시작')
      console.log(props.sessionId, props.connectionId)
      try { 
        const response = await changeReady(props.sessionId, props.connectionId)
        console.log('clickready - response : ', response)
        state.ready = response.data.player.isReady
      } catch(err) {
        console.log(err);
      }
    }

    const joinSession = async function() {
      emit('joinSession')
		}

    const sessionInfo = () => {
      const session1 = store.getters['gameStore/getSession']
      const sessionId1 = store.getters['gameStore/getSessionId']
      console.log('session클릭', session1)
      console.log('sessionId', sessionId1)
    }



    return {
		router,
		state,
		// title,
		clickExit,
		clickReady,
    // ClickTeam,
		joinSession,
		// leaveSession,
		sessionInfo,
		// updateMainVideoStreamManager,
    PlayerList,
    // == OpenVidu State ==
		// OV,
		// session,
		// mainStreamManager,
		// publisher,
		// subscribers,
		// mySessionId,
		// myUserName,
      // =====================
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