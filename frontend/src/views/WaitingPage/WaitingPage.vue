<template>
  <p>세션 : {{ mySessionId }}</p>
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
  <v-btn @click="sessionInfo">
	session 정보
  </v-btn>




  <div id="main-container" class="container">
		<div id="join" v-if="!session">
			<div id="img-div"><img src="resources/images/openvidu_grey_bg_transp_cropped.png" /></div>
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

		<div id="session" v-if="session">
			<div id="session-header">
				<h1 id="session-title"> {{ mySessionId }}</h1>
				<input class="btn btn-large btn-danger" type="button" id="buttonLeaveSession" @click="leaveSession" value="Leave session">
			</div>
			<div id="main-video" class="col-md-6">
				<user-video :stream-manager="mainStreamManager"/>
			</div>
			<div id="video-container" class="col-md-6">
				<user-video :stream-manager="publisher" @click="updateMainVideoStreamManager(publisher)"/>
				<user-video v-for="sub in subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
			</div>
			<div id="chat-head" class="col-md-6">
				<chatting-box :session="session"/>
			</div>
		</div>
	</div>
</template>
<script>
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import ChatBox from './components/ChatBox.vue';
import $axios from "axios";
import { computed } from 'vue'
import { useStore } from 'vuex';

//=================OpenVdue====================

import UserVideo from './components/UserVideo.vue';
import ChattingBox from './components/ChattingBox.vue';

$axios.defaults.headers.post['Content-Type'] = 'application/json';


//=============================================


export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
    ChatBox,
		UserVideo,
		ChattingBox,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
	
    // == OpenVidu State ==
    const OV = computed(() => store.state.gameStore.OV)
    const session = computed(() => store.state.gameStore.session)
    const mainStreamManager = computed(() => store.state.gameStore.mainStreamManager ) 
    const publisher = computed(() => store.state.gameStore.publisher )
    const subscribers = computed(() => store.state.gameStore.subscribers ) 
    const mySessionId = computed(() => store.state.gameStore.mySessionId ) 
    const myUserName = computed(() => store.state.gameStore.myUserName )
    // =====================

    const state = reactive({
      title: "",
      team: null,
      ready: false,
      
    })
    const clickExit = () => {
      router.push({
        name: 'main'
      })
    }
    const clickReady = () => {
      state.ready = !state.ready
    }

    const joinSession = async function() {
		store.dispatch('gameStore/joinSession')
		}

	const leaveSession = async function() {
		store.dispatch('gameStore/leaveSession')
		window.removeEventListener('beforeunload', leaveSession);
	}

	const updateMainVideoStreamManager = async function(stream) {
		store.dispatch('gameStore/updateMainVideoStreamManager',stream)
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
		clickExit, 
		clickReady, 
		joinSession, 
		leaveSession, 
		sessionInfo,
		updateMainVideoStreamManager,

      // == OpenVidu State ==
		OV,
		session,
		mainStreamManager,
		publisher,
		subscribers,
		mySessionId,
		myUserName,
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