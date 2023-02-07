<template>
<!----------------------------------- 개발용 버튼 -------------------------------------->
    <p>
        <v-btn @click="state.readyAll=!state.readyAll">게임 시작</v-btn> |
        <v-btn @click="state.isTeamBattle = !state.isTeamBattle">팀/개인전 변경</v-btn> |
        <v-btn @click="state.amIDescriber = !state.amIDescriber">게임 순서 변경</v-btn>
    </p>
<!------------------------------------------------------------------------------------->
<div class="wrap_component">
    <div class="waiting_component" v-if="!state.readyAll">
        <div class="users_component">
            <WaitingPage
            @joinSession=joinSession
            :sessionId="state.sessionId"
            :playerList="playerList[0]"
            :session="state.session"
            :myConnectionId="state.connectionId"
            :team="state.team"
            />
        </div>
        <div class="side_component flex-item">
            <v-radio-group class="select_team" inline v-model="state.team" justify-content="center">
                <v-radio label="RED" value="RED" color="red" class="ma-2"></v-radio>
                <v-radio label="BLUE" value="BLUE" color="indigo" class="ma-2"></v-radio>
            </v-radio-group>
            <div class="chat_box">
                <ChattingBox
                :session="state.session"
                />
            </div>
            <div class="side_footer">
                <div class="sidebtn">
                    <v-btn class="readybtn" v-if="!state.ready" @Click="clickReady">READY</v-btn>
                    <v-btn class="readybtn" v-if="state.ready" @Click="clickReady">CANCEL READY</v-btn>
                </div>
                <div class="sidebtn">
                    <v-btn class="exitbtn" @click="clickExit">EXIT</v-btn>
                </div>
            </div>
            <div class="sidebtn">
                    <v-btn class="exitbtn" @click="gameStart()">Game Start</v-btn>
            </div>
        </div>
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
</div>
</template>
<script>
import GameTimer from './components/GameTimer.vue';
import UserVideo from './components/UserVideo.vue';
import MyCanvasBox from './components/MyCanvasBox.vue'
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue';
import $axios from "axios";
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
import { OpenVidu } from "openvidu-browser";
import { reactive } from '@vue/reactivity'
import { GetPlayerList } from "@/common/api/gameAPI";
import { ref, onUpdated, onBeforeMount } from 'vue';

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
    props:{
        ready: Boolean
    },
    setup() {
        const store = useStore()
        const route = useRoute() // URL 파라미터를 통한 sessionId 얻기
        const router = useRouter()
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
            publisher: {
                team: null
            },
            subscribers: [],
            sessionId: route.params.sessionId || null,
            myUserName: '',
            isHost: true,
            readyAll: false,
            connectionId: null,

            // 팀 분류
            myTeam: null,
            opponentTeam: [],

            // 게임 순서 관련
            amIDescriber: false, // false : 내가 그리는 차례, true : 내가 설명할 차례
            
            ready: false,
            team: null,
        })

        onUpdated(() => {
            if (!state.readyAll) {
                document.querySelector(".waiting_component").innerHTML
                playerList.value
                document.querySelector(".waiting_component").innerHTML
                state.session
                document.querySelector(".waiting_component").innerHTML
                state.team
                console.log(state.team)
            }

            // 팀 분류하여 리스트에 추가
            let tmpMyTeam = null
            const tmpOpponentTeam = []
            for(let i=0; i<state.subscribers.length; i++) {
                console.log("state.publisher : ", state.publisher)
                if(state.subscribers[i].team === state.publisher.team) {
                    tmpMyTeam = state.subscribers[i]
                } else {
                    tmpOpponentTeam.push(state.subscribers[i])
                }
            }
            state.myTeam = tmpMyTeam
            state.opponentTeam = tmpOpponentTeam
        })

        onBeforeMount(() => {
            console.log('join start');
            joinSession()
        })

        const gameStart = async() =>{
            state.session.signal({
                    type: 'game',
                    data: {
                        gameStatus: 0
                },
                to: []
                })
        }

        const joinSession = async () => {
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

            state.session.on("signal:chat", (event)=>{
                const { message } = JSON.parse(event.data);
                const { user, chatMessage } = message
                const data = user + " : " + chatMessage
                store.commit('gameStore/SET_MESSAGES', data)
            });

            /**
             * 신대득
             * 게임 접속 시 게임 데이터 통신 부분 (GameNavigator 활용 되는..)
             * 이 부분을 만들어줘야 session이 이벤트를 읽어옴. (백 => 프론트 부분)
             */
            state.session.on("signal:game", (event)=>{
                // 게임 접속 시 데이터 받기
                switch(event.data.gameStatus){
                    // 설명자를 바꾸는 부분
                    // "curPresenterId"에 설명자 번호가 전송되서 온다.
                    case 0: {
                        console.log(event.data);
                        break;
                    }
                    case 1:{
                        console.log(event.data);
                        break;
                    }
                    case 2:{
                        console.log(event.data);
                        break;
                    }
                    case 3:{
                        console.log(event.data);
                        break;
                    }
                    case 4: {
                        console.log("준비완료!!!", event.data);
                        break;
                    }
                    case 5 :{
                        console.log(event.data);
                        break;
                    }
                }
            })


            // New signal: {"type":"signal:game","data":{"gameStatus":3,"con_U8n1OlFKYx":false,"con_RgCANyJOsq":false}}



            // state.session.on("signal:game", (event)=>{
            //     switch(event.data.gameStatus) {
            //         case 3: {
                        
            //         }
            //     }
            // });


            // --- Connect to the session with a valid user token ---
            // 'getToken' method is simulating what your server-side should do.
            // 'token' parameter should be retrieved and returned by your own backend


            getToken(state.sessionId).then(token => {
                // console.log("token : ", token)
                state.session.connect(token, { clientData: state.myUserName })
                requestPlayerList(state.sessionId).then(response => {
                // console.log('requestPlayerlist response', response)
                playerList.value.push(response.content)
                // console.log('response:::::::::::::::::::0-09i023', response.content)
                store.commit('gameStore/setSession', state.session)
                sessionVal.value.push(state.session) // 시험 ---
                // console.log('state.session : ', state.session)
                // console.log('sessionVal : ', sessionVal.value)
                // ready 정보 수신
                console.log('ready 정보 수신 !!!')
                state.session.signal({
                    type: 'game',
                    data: {
                        gameStatus: 3
                },
                to: []
                })
                
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

        const clickExit = () => {
            router.push({
                name: 'main'
            })
        }

        const clickReady = () => {
            console.log('clickReady 시작')
            const session = store.getters['gameStore/getSession']
            console.log('clickReady session 정보 : ', session)
            try {
                session.signal({
                type: 'game',
                data: {
                    gameStatus: 4
                },
                to: []
            })} catch(err) {
                console.log('err : ', err)
            }   

            // console.log('clickready 시작')
            // try { 
            //     const response = await changeReady(state.sessionId, state.connectionId)
            //     console.log('clickready - response : ', response)
            //     state.ready = response.data.player.isReady
            // } catch(err) {
            //     console.log(err);
            // }
        }
        const leaveSession = () => {
            // --- Leave the session by calling 'disconnect' method over the Session object ---
            if (state.session) state.session.disconnect();

            state.session = undefined;
            state.mainStreamManager = undefined;
            state.publisher = undefined;
            state.subscribers = [];
            state.OV = undefined;

            window.removeEventListener('beforeunload', leaveSession);
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
            state.myUserName=store.state.accountStore.user.nickname || ''

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
            gameStart,
            getToken,
            createToken,
            leaveSession,
            clickReady,
            clickExit,
            updateMainVideoStreamManager
        }
    }
}
</script>

<style scoped>
.wrap_component {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.waiting_component {
    display: flex;
    flex-direction: row;
    padding: 20px;
    max-width: 1200px;
    min-width: 800px;
    width: 100%;
    justify-content: space-between;
}
.side_component {
    width: 300px;    
}
.select_team {
    display: flex;
    border-radius: 30px;
    background-color: #ffffffeb;
    justify-content: center;
    margin-bottom: 10px;
}
.chat_box {
    border-radius: 30px;
    height: 500px;
    background-color: #ffffffeb;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    padding: 20px 30px;
}

.sidebtn {
    display: inline-block;
    width: 50%;
    padding: 10px 0px;
}
.sidebtn:first-child {
    padding-right: 5px; 
}
.sidebtn:last-child {
    padding-left: 5px; 
}
.sidebtn>button {
    width:100%;
    margin: 0px;
    border-radius: 20px;
    height: 70px;
    box-sizing: border-box;
    font-family: sans-serif;
    font-weight: 900;
    font-size: 25px;
    border: 7px solid #ffffffeb;
}
.readybtn {
    background: linear-gradient(342deg, rgba(198,255,0,1) 0%, rgba(108,204,55,1) 100%);
}
.exitbtn {
    background: rgb(224,61,61);
background: linear-gradient(133deg, rgba(224,61,61,1) 0%, rgba(255,93,93,1) 100%);
}
</style>