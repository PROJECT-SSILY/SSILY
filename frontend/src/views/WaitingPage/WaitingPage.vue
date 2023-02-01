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




  <div id="main-container" class="container">
		<div id="join" v-if="!state.session">
			<div id="img-div"><img src="resources/images/openvidu_grey_bg_transp_cropped.png" /></div>
			<div id="join-dialog" class="jumbotron vertical-center">
				<h1>Join a video session</h1>
				<div class="form-group">
					<p>
						<label>Participant</label>
						<input v-model="state.myUserName" class="form-control" type="text" required>
					</p>
					<p>
						<label>Session</label>
						<input v-model="state.mySessionId" class="form-control" type="text" required>
					</p>
					<p class="text-center">
						<button class="btn btn-lg btn-success" @click="joinSession()">Join!</button>
					</p>
				</div>
			</div>
		</div>

		<div id="session" v-if="state.session">
			<div id="session-header">
				<h1 id="session-title">{{ state.mySessionId }}</h1>
				<input class="btn btn-large btn-danger" type="button" id="buttonLeaveSession" @click="leaveSession" value="Leave session">
			</div>
			<div id="main-video" class="col-md-6">
				<user-video :stream-manager="state.mainStreamManager"/>
			</div>
			<div id="video-container" class="col-md-6">
				<user-video :stream-manager="state.publisher" @click="updateMainVideoStreamManager(state.publisher)"/>
				<user-video v-for="sub in state.subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
			</div>
			<div id="chat-head" class="col-md-6">
				<chatting-box :session="state.session"/>
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

import { OpenVidu } from 'openvidu-browser';
import UserVideo from './components/UserVideo.vue';
import ChattingBox from './components/ChattingBox.vue';

$axios.defaults.headers.post['Content-Type'] = 'application/json';
const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

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


    const joinSession = () => {
			state.OV = new OpenVidu(); // --- Get an OpenVidu object ---
			state.session = state.OV.initSession();// --- Init a session ---
			// --- Specify the actions when events take place in the session ---
			// On every new Stream received...
			state.session.on('streamCreated', ({ stream }) => {
        const subscriber = state.session.subscribe(stream);
				state.subscribers.push(subscriber);
			});

			// On every Stream destroyed...
			state.session.on('streamDestroyed', ({ stream }) => {
				const index = state.subscribers.indexOf(stream.streamManager, 0);
				if (index >= 0) {
          state.subscribers.splice(index, 1);
				}
			});
      
			// On every asynchronous exception...
			state.session.on('exception', ({ exception }) => {
        console.warn(exception);
			});
      
      console.log("ok")
			// --- Connect to the session with a valid user token ---

			// 'getToken' method is simulating what your server-side should do.
			// 'token' parameter should be retrieved and returned by your own backend
			getToken(state.mySessionId).then(token => {
				state.session.connect(token, { clientData: state.myUserName })
					.then(() => {

						// --- Get your own camera stream with the desired properties ---

						let publisher = state.OV.initPublisher(undefined, {
							audioSource: undefined, // The source of audio. If undefined default microphone
							videoSource: undefined, // The source of video. If undefined default webcam
							publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
							publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
							resolution: '640x480',  // The resolution of your video
							frameRate: 30,			// The frame rate of your video
							insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
							mirror: false       	// Whether to mirror your local video or not
						});

						state.mainStreamManager = publisher;
						state.publisher = publisher;

						// --- Publish your stream ---

						state.session.publish(state.publisher);
					})
					.catch(error => {
						console.log('There was an error connecting to the session:', error.code, error.message);
					});
			});

			window.addEventListener('beforeunload', state.leaveSession)
		}

		const leaveSession = () => {
			// --- Leave the session by calling 'disconnect' method over the Session object ---
			if (state.session) state.session.disconnect();

			state.session = undefined;
			state.mainStreamManager = undefined;
			state.publisher = undefined;
			state.subscribers = [];
			state.OV = undefined;

			window.removeEventListener('beforeunload', state.leaveSession);
		}

		const updateMainVideoStreamManager = (stream) => {
			if (state.mainStreamManager === stream) return;
			state.mainStreamManager = stream;
		}

		/**
		 * --------------------------
		 * SERVER-SIDE RESPONSIBILITY
		 * --------------------------
		 * These methods retrieve the mandatory user token from OpenVidu Server.
		 * state behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
		 * the API REST, openvidu-java-client or openvidu-node-client):
		 *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
		 *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
		 *   3) The Connection.token must be consumed in Session.connect() method
		 */

		const getToken = (mySessionId) => {
			return createSession(mySessionId).then(sessionId => createToken(sessionId));
		}

		// See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-session
		const createSession = (sessionId) => {
			return new Promise((resolve, reject) => {
				$axios
					.post(`${OPENVIDU_SERVER_URL}/api/sessions`, JSON.stringify({
						customSessionId: sessionId,
					}), {
						auth: {
							username: 'OPENVIDUAPP',
							password: OPENVIDU_SERVER_SECRET,
						},
					})
					.then(response => response.data)
					.then(data => resolve(data.id))
					.catch(error => {
						if (error.response.status === 409) {
							resolve(sessionId);
						} else {
							console.warn(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`);
							if (window.confirm(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`)) {
								location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
							}
							reject(error.response);
						}
					});
			});
		}

		// See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-connection
		const createToken = (sessionId) => {
			return new Promise((resolve, reject) => {
				$axios
					.post(`${OPENVIDU_SERVER_URL}/api/sessions/${sessionId}/connection`, {}, {
						auth: {
							username: 'OPENVIDUAPP',
							password: OPENVIDU_SERVER_SECRET,
						},
					})
					.then(response => response.data)
					.then(data => resolve(data.token))
					.catch(error => reject(error.response));
			});
		}

    return { 
      router, 
      state, 
      clickExit, 
      clickReady, 
      joinSession, 
      leaveSession, 
      updateMainVideoStreamManager,
      getToken,
      createSession,
      createToken,
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