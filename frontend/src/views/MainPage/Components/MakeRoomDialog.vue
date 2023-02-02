<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      width="500"
    >
      <template v-slot:activator="{ attrs }">
        <v-btn
          dark
          v-bind="attrs"
          @click.stop="state.dialog = true"
        >
          방 만들기
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          방 만들기
        </v-card-title>
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
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
        <v-radio-group
          :rules="[state.rules.required]"
          v-model="state.teamorprivate"
          inline
        >
          <v-radio
            label="팀전"
            color="orange darken-3"
            value="radio-1"
          ></v-radio>
          <v-radio
            label="개인전"
            color="orange darken-3"
            value="radio-2"
          ></v-radio>
        </v-radio-group>
        <v-radio-group
          :rules="[state.rules.required]"
          v-model="state.secretornot"
          inline
        >
          <v-radio
            label="공개"
            color="orange darken-3"
            value="radio-1"
          ></v-radio>
          <v-radio
            label="비공개"
            color="orange darken-3"
            value="radio-2"
          ></v-radio>
        </v-radio-group>
        <v-text-field 
          v-if="state.secretornot ==='radio-2'"
          label="비밀번호 숫자 4자리를 입력하세요."
          hide-details="auto"
          v-model="state.password"
        ></v-text-field>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            type="submit"
            text
            @click="toWaiting"
          >
            방 만들기
          </v-btn>
        </v-card-actions>
      </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  import { reactive } from 'vue'
  import { useStore } from 'vuex'
  import { computed } from 'vue'
  import $axios from "axios";

  import { OpenVidu } from 'openvidu-browser';
  $axios.defaults.headers.post['Content-Type'] = 'application/json';
  const OPENVIDU_SERVER_URL = "https://localhost:4443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";
 
  export default {
    setup() {
      const router = useRouter()
      const store = useStore()
      const OV = computed(() => store.state.gameStore.OV)
      const session = computed(() => store.state.gameStore.session)
      const mainStreamManager = computed(() => store.state.gameStore.mainStreamManager ) 
      const publisher = computed(() => store.state.gameStore.publisher )
      const subscribers = computed(() => store.state.gameStore.subscribers ) 
      const mySessionId = computed(() => store.state.gameStore.mySessionId ) 
      const myUserName = computed(() => store.state.gameStore.myUserName )
      const state = reactive({
        dialog: false,
        teamorprivate: null,
        secretornot: null,
        password:null,
        rules: {
          required: value => !!value || '필수',
        }
      })
      const toWaiting = async function () {
        const formData = {
          teamorprivate: state.teamorprivate.value,
          isSecret: state.secretornot.value,
          password: state.password,
        }
        await store.dispatch('gameroomStore/roomAction', formData )
        await console.log("방 생성 완료")
        router.push('waiting')
      
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
        toWaiting,
        joinSession, 
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