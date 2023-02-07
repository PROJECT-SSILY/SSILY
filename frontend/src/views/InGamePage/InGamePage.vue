<template>
<div class="wrap_component">
    <!----------------------------------- 개발용 버튼 -------------------------------------->
        <p>
            <v-btn @click="state.readyAll=!state.readyAll">게임 시작</v-btn> |
            <v-btn @click="state.isTeamBattle = !state.isTeamBattle">팀/개인전 변경</v-btn> |
            <v-btn @click="state.amIDescriber = !state.amIDescriber">게임 순서 변경</v-btn>
        </p>
    <!------------------------------------------------------------------------------------->
    <div class="waiting_component" v-if="!state.readyAll">
        <div class="users_component">
            <WaitingPage
            :sessionId="state.sessionId"
            :playerList="state.playerList"
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
import {  useRouter } from 'vue-router'
// import { OpenVidu } from "openvidu-browser";
import { reactive } from '@vue/reactivity'
// import { GetPlayerList } from "@/common/api/gameAPI";
import { onUpdated, onBeforeMount } from 'vue';

//=================OpenVdue====================

$axios.defaults.headers.post['Content-Type'] = 'application/json';
// const OPENVIDU_SERVER_URL = "https://localhost:4443";
// const OPENVIDU_SERVER_SECRET = "MY_SECRET";

//=============================================
import ChattingBox from '@/views/WaitingPage/components/ChattingBox.vue';

export default {
    name : "InGamePage",
    components: {
        GameTimer,
		UserVideo,
        MyCanvasBox,
        WaitingPage,
        ChattingBox,
    },
    props:{
        ready: Boolean
    },
    setup() {
        const store = useStore()
        // const route = useRoute() // URL 파라미터를 통한 sessionId 얻기
        const router = useRouter()
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
            // sessionId: route.params.sessionId || null,
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

        onBeforeMount(() => {
            console.log('join start');
            store.dispatch('gameStore/joinSession')
        })

        onUpdated(() => {
            if (!state.readyAll) {
                // document.querySelector(".waiting_component").innerHTML
                // playerList.value
                state.session
                state.team
                console.log(state.team)
            }

            // 팀 분류하여 리스트에 추가
            let tmpMyTeam = null
            const tmpOpponentTeam = []
            for(let i=0; i<state.subscribers.length; i++) {
                // console.log("state.publisher : ", state.publisher)
                if(state.subscribers[i].team === state.publisher.team) {
                    tmpMyTeam = state.subscribers[i]
                } else {
                    tmpOpponentTeam.push(state.subscribers[i])
                }
            }
            // console.log("playerList.value.length::::::::::", playerList.value.length)
            state.myTeam = tmpMyTeam
            state.opponentTeam = tmpOpponentTeam
        })

        // const joinSession = async () => {
        //     console.log("joinsession 시작")
        //     // --- Get an OpenVidu object ---
        //     state.OV = new OpenVidu();

        //     // --- Init a session ---
        //     state.session = state.OV.initSession();


        //     // On every asynchronous exception...
        //     state.session.on('exception', ({ exception }) => {
        //         console.warn(exception);
        //     });

        //     // state.session.on("signal:chat", (event)=>{
        //     //     const { message } = JSON.parse(event.data);
        //     //     const { user, chatMessage } = message
        //     //     const data = user + " : " + chatMessage
        //     //     store.commit('gameStore/SET_MESSAGES', data)
        //     // });

        //     // --- Connect to the session with a valid user token ---
        //     // 'getToken' method is simulating what your server-side should do.
        //     // 'token' parameter should be retrieved and returned by your own backend

        //     await getToken(state.sessionId).then(token => {
        //         state.session.connect(token, { clientData: state.myUserName })

        //         requestPlayerList(state.sessionId).then(response => {
        //         const resLength= response.content.length;
        //         // console.log("res 찍자", response.content);
        //         for(let i=0;i<resLength;i++){
        //             state.playerList.push(response.content[i]);
        //         }
        //         store.commit('gameStore/setSession', state.session)
        //         sessionVal.value.push(state.session)
        //         })
        //         .then(() => {
        //             // --- Get your own camera stream with the desired properties ---
        //             let publisher = state.OV.initPublisher(undefined, {
        //                 audioSource: undefined, // The source of audio. If undefined default microphone
        //                 videoSource: undefined, // The source of video. If undefined default webcam
        //                 publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
        //                 publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
        //                 resolution: '640x480',  // The resolution of your video
        //                 frameRate: 30,			// The frame rate of your video
        //                 insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
        //                 mirror: false       	// Whether to mirror your local video or not
        //             });
        //             state.mainStreamManager = publisher;
        //             state.publisher = publisher;



        const clickExit = () => {
            router.push({
                name: 'main'
            })
        }

        const clickReady = () => {
            store.dispatch('gameStore/changeReady')
        }

        // const leaveSession = () => {
        //     // --- Leave the session by calling 'disconnect' method over the Session object ---
        //     if (state.session) state.session.disconnect();

        //     state.session = undefined;
        //     state.mainStreamManager = undefined;
        //     state.publisher = undefined;
        //     state.subscribers = [];
        //     state.OV = undefined;

        //     window.removeEventListener('beforeunload', leaveSession);
        // }

        // const updateMainVideoStreamManager = (stream) => {
        //     if (state.mainStreamManager === stream) return;
        //     state.mainStreamManager = stream;
        //     }

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

        // const getToken = async (sessionId) => {
        //     const response = await createToken(sessionId)
        //     state.connectionId = response.connectionId
        //     // console.log('connectionId ===>', state.connectionId)
        //     return response.token
        // }

        // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-connection
        // const createToken = (sessionId) => {
        //     const level = store.state.accountStore.user.level || 1
        //     const nickname = store.state.accountStore.user.nickname || ''
        //     const isHost = store.state.gameStore.isHost || true
        //     const rate = store.getters['accountStore/getRate']
        //     const password = store.state.gameStore.password || true
        //     const exp = store.state.accountStore.user.exp || 0
        //     state.myUserName=store.state.accountStore.user.nickname || ''

        //     return new Promise((resolve, reject)=> {
        //         // console.log("level=",level);
        //         // console.log("nickname=",nickname);
        //         // console.log("isHost=", isHost);
        //         // console.log("rate=", rate);
        //         // console.log("exp", exp)
        //         $axios
        //             .post(`${OPENVIDU_SERVER_URL}/api/rooms/${sessionId}`, JSON.stringify({
        //             "level" : level,
        //             "nickname" : nickname,
        //             "rate" : rate,
        //             "isHost" : isHost,
        //             "password" : password,
        //             "exp": exp,
        //         }), {
        //             auth: {
        //                 username: 'OPENVIDUAPP',
        //                 password: OPENVIDU_SERVER_SECRET,
        //             },
        //         })
        //         .then(response => resolve(response.data))
        //         .catch(error => reject(error.response));
        //     })
        // }


        return {
            state,
            // playerList,
            // joinSession,
            // getToken,
            // createToken,
            // leaveSession,
            clickReady,
            clickExit,
            // updateMainVideoStreamManager
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
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.select_team {
    display: flex;
    border-radius: 30px;
    background-color: #ffffffeb;
    justify-content: center;
    margin-bottom: 10px;
}
.chat_box {
    flex: auto;
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
    padding-top: 10px;
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