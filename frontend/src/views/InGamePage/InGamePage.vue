<template>
    <p>
        <v-btn @click="state.readyAll=!state.readyAll">게임 시작</v-btn> |
        <v-btn @click="state.isTeamBattle = !state.isTeamBattle">팀/개인전 변경</v-btn> |
        <v-btn @click="state.amIDescriber = !state.amIDescriber">게임 순서 변경</v-btn>
    </p>
    <div class="waiting_component" v-if="!state.readyAll">
        <WaitingPage
        @joinSession=joinSession
        :sessionId="state.sessionId"
        :playerList="playerList[0]"
        :session="state.session"
        :connectionId="state.connectionId"
        />
        <ChattingBox
        :session="state.session"
        />
    </div>
    <div class="in_game_component" v-else>
        <GameTimer date="August 15, 2016"/>
        <v-container>
            <v-row>
                <v-col>
                    <h1>상대 팀</h1>
                    <user-video v-for="sub in state.opponentTeam" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
                </v-col>
                <v-col>
                    <div id="video-container" class="col-md-6">
                        <div class="me">
                            <h1>나</h1>
                            <div class="drawing_sec" v-if="!state.amIDescriber">
                                <MyCanvasBox/>
                                <user-video :stream-manager="state.publisher" @click="updateMainVideoStreamManager(state.publisher)"/>
                            </div>
                            <div class="displaying_sec" v-else>
                                <user-video :stream-manager="state.publisher" @click="updateMainVideoStreamManager(state.publisher)"/>
                            </div>
                        </div>
                        <div class="our_team">
                            <h1>우리 팀</h1>
                            <div class="drawing_sec" v-if="state.amIDescriber">
                                <user-video :stream-manager="state.myTeam" @click="updateMainVideoStreamManager(state.myTeam)"/>
                                <MyCanvasBox/>
                            </div>
                            <div class="displaying_sec" v-else>
                                <user-video :stream-manager="state.myTeam" @click="updateMainVideoStreamManager(state.myTeam)"/>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import GameTimer from './components/GameTimer.vue';
import UserVideo from './components/UserVideo.vue';
import MyCanvasBox from './components/MyCanvasBox.vue'
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue';
import $axios from "axios";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { OpenVidu } from "openvidu-browser";
import { reactive } from '@vue/reactivity'
import { GetPlayerList } from "@/common/api/gameAPI";
import { ref, onMounted, onUpdated } from 'vue';
//=================OpenVdue====================

$axios.defaults.headers.post['Content-Type'] = 'application/json';
const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

//=============================================
import ChattingBox from '@/views/WaitingPage/components/ChattingBox.vue';



export default {
    name : "InGamePage",
    components: {
        GameTimer,
		UserVideo,
        MyCanvasBox,
        WaitingPage,
        ChattingBox

    },
    // props:{
    //     ready: Boolean
    // },
    setup() {
        const store = useStore()
        const playerList = ref([])
        const sessionVal = ref([])
        const state = reactive({
            title: null,
            isSecret: false,
            password: null,
            isTeamBattle: null,
            OV: undefined,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
            sessionId: null,
            myUserName: '',
            isHost: true,
            readyAll: false,
            connectionId: null,

            // 팀 분류
            myTeam: null,
            opponentTeam: [],

            // 게임 순서 관련
            amIDescriber: false, // false : 내가 그리는 차례, true : 내가 설명할 차례
        })
        const route = useRoute() // URL 파라미터를 통한 sessionId 얻기
        state.sessionId = route.params.sessionId

        // const status = toRefs(props).ready

        // watch(status, () => {
        //     console.log("start입니다.")
        // })
        onUpdated(() => {
            if (!state.readyAll) {
                document.querySelector(".waiting_component").innerHTML
                console.log("onupdated", playerList.value, document.querySelector(".waiting_component").innerHTML)
                console.log("onupdated", state.session,  document.querySelector(".waiting_component").innerHTML)
            }

            // 팀 분류하여 리스트에 추가
            let tmpMyTeam = null
            const tmpOpponentTeam = []
            for(let i=0; i<state.subscribers.length; i++) {
                if(state.subscribers[i].team==state.publisher.team) {
                    tmpMyTeam = state.subscribers[i]
                } else {
                    tmpOpponentTeam.push(state.subscribers[i])
                }
            }
            state.myTeam = tmpMyTeam
            state.opponentTeam = tmpOpponentTeam
        })
        onMounted(() => {
            console.log('join start');
            joinSession()
        })

        const joinSession = () => {
            console.log("joinsession 시작")
            // --- Get an OpenVidu object ---
            state.OV = new OpenVidu();

            // --- Init a session ---
            state.session = state.OV.initSession();

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




            // --- Connect to the session with a valid user token ---
            // 'getToken' method is simulating what your server-side should do.
            // 'token' parameter should be retrieved and returned by your own backend


            getToken(state.sessionId).then(token => {
                console.log("token : ", token)
                state.session.connect(token, { clientData: state.myUserName })
                requestPlayerList(state.sessionId).then(response => {
                console.log('requestPlayerlist response', response)
                playerList.value.push(response.content)
                console.log('response:::::::::::::::::::0-09i023', response.content)

                store.commit('gameStore/setSession', state.session)
                sessionVal.value.push(state.session) // 시험 ---
                console.log('@@@@@@@@@@state.session:', state.session)
                console.log('@@@@@@@@@@sessionVal:', sessionVal.value)
            })
            .then(() => {
                console.log("gettoken - connect - then")
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
            window.addEventListener('beforeunload', leaveSession)
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

        const getToken = async (sessionId) => {
        console.log("gettoken 시작")
        console.log('gettoken, sessionid : ', sessionId)
        const response = await createToken(sessionId)
        state.connectionId = response.connectionId
        console.log('connectionId ===>', state.connectionId)
        return response.token
    }


        // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-connection
        const createToken = (sessionId) => {
            const level = store.state.accountStore.user.level || 1
            const nickname = store.state.accountStore.user.nickname || ''
            const isHost = store.state.gameStore.isHost || true
            const rate = store.getters['accountStore/getRate']
            const password = store.state.gameStore.password || true
            const exp = store.state.accountStore.user.exp || 0



            return new Promise((resolve, reject)=> {
                console.log("level=",level);
                console.log("nickname=",nickname);
                console.log("isHost=", isHost);
                console.log("rate=", rate);
                console.log("exp", exp)
                $axios
                    .post(`${OPENVIDU_SERVER_URL}/api/rooms/${sessionId}`, JSON.stringify({
                    "level" : level,
                    "nickname" : nickname,
                    "rate" : rate,
                    "isHost" : isHost,
                    "password" : password,
                    "exp": exp,
                }), {
                    auth: {
                        username: 'OPENVIDUAPP',
                        password: OPENVIDU_SERVER_SECRET,
                    },
                })
                .then(response => resolve(response.data))
                .catch(error => reject(error.response));
            })
        }

        const requestPlayerList = async (sessionId) => {
            // 되는 코드
            console.log('requestPlayerList 시도 시작')
            try {
                console.log('requestplayerList 내 세션 아이디 : ', sessionId)
                const response = await GetPlayerList(sessionId);
                console.log('requestplayerList 결과 값 : ', response.data)
                store.commit('gameStore/setPlayerList', response.data)
                return response.data
            } catch(err) {
                console.log(err);
            }
        }

        return {
            state,
            playerList,
            joinSession,
            getToken,
            createToken,
            leaveSession,
            updateMainVideoStreamManager
        }
    }
}
</script>

<style scoped>

</style>