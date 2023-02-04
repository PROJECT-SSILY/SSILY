<!-- <template>
    <div>
        <GameTimer date="August 15, 2016"/>
        <v-btn @click="changeMode"
        >Change Mode
        </v-btn>
        <div v-if="state.isTeamGame">
            <h1>팀전</h1>
            <TeamGame/>
        </div>
        <div v-else>
            <h1>개인전</h1>
            <PrivateGame/>
        </div>
    </div>
</template> -->
<template>
    <div class="waiting_component">
        <WaitingPage
        @joinSession=joinSession
        />
    </div>
    <div class="in_game_component">
        <GameTimer date="August 15, 2016"/>
        <v-btn @click="changeMode">Change Mode</v-btn>s
        <div id="session-header">
				<h1 id="session-title"> {{ state.mySessionId }}</h1>
				<input class="btn btn-large btn-danger" type="button" id="buttonLeaveSession" @click="leaveSession" value="Leave session">
			</div>
			<div id="main-video" class="col-md-6">
				<user-video :stream-manager="state.mainStreamManager"/>
			</div>
			<div id="video-container" class="col-md-6">
				<user-video :stream-manager="state.publisher" @click="updateMainVideoStreamManager(state.publisher)"/>
				<user-video v-for="sub in state.subscribers" :key="sub.stream.connection.connectionId" :stream-manager="sub" @click="updateMainVideoStreamManager(sub)"/>
			</div>
        <div v-if="state.isTeamBattle">
            <h1>팀전</h1>
            <TeamGame/>
        </div>
        <div v-else>
            <h1>개인전</h1>
            <PrivateGame/>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import GameTimer from './components/GameTimer.vue';
import UserVideo from './components/UserVideo.vue';
import PrivateGame from './components/PrivateGame.vue';
import TeamGame from './components/TeamGame.vue';
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue';
import { useStore } from 'vuex';
import { watch, onMounted } from 'vue';
import { OpenVidu } from "openvidu-browser";
//=================OpenVdue====================

import $axios from "axios";
$axios.defaults.headers.post['Content-Type'] = 'application/json';


const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

//=============================================

export default {
    name : "InGamePage",
    components: {
        GameTimer,
        PrivateGame,
        TeamGame,
		UserVideo,
        WaitingPage
    },
    props:{
        ready: Boolean
    },
    setup(props) {
        const store = useStore()
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
            mySessionId: null,
            myUserName: '',
            isHost: true,
        })

        const status = toRefs(props).ready
        watch(status, () => {
            console.log("start입니다.")
        })

        onMounted(() => {
            console.log('join start');
            joinSession()
        })

        const changeMode = () => {
            state.isTeamBattle = !state.isTeamBattle
        }

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

            getToken(store.state.gameStore.mySessionId).then(token => {
                console.log("token : ", token)
                state.session.connect(token, { clientData: state.myUserName })
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


            store.commit('gameStore/setMySessionId', '')// 시험

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

            const getToken = async (mySessionId) => {
            console.log("gettoken 시작")
            console.log('gettoken, mysessionid : ', mySessionId)
            if (mySessionId == '') {
                return await createSession(mySessionId).then(async (sessionId) => {
                    console.log('세션 만들고 나온 id: ', sessionId)
                    await store.commit('gameStore/setMySessionId', sessionId)
                    console.log("세션 ID 저장 완료 : ", store.state.gameStore.mySessionId)
                    const token = await createToken(sessionId)
                    console.log("토큰 저장 완료")
                    store.commit('gameStore/setToken', token)
                    // ==============
                    state.mySessionId = sessionId
                    //================
                    return await token
                    });
                } else {
                    console.log("mySessionId: ", mySessionId)
                    return await createToken(mySessionId)

                }
            }



            // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-session
            const createSession = (sessionId) => {
                const myTitle= state.title;
                console.log("내 타이틀 이거임", myTitle);
                console.log("내 sessionId 이거임 : ", state.mySessionId, sessionId)
                return new Promise((resolve, reject) => {
                    $axios
                    .post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
                    // 하드코딩한 부분 나중에 수정 필요

                    "title" : store.state.gameStore.title,
                    "isSecret" : store.state.gameStore.isSecret,
                    "password" : store.state.gameStore.password,
                    "team" : store.state.gameStore.isTeamBattle
                    }), {
                        auth: {
                            username: 'OPENVIDUAPP',
                            password: OPENVIDU_SERVER_SECRET,
                        },
                    })
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.id)
                    })
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
            const createToken = (mySessionId) => {
                console.log('안됨?')
                const level = store.state.accountStore.user.level || 1
                const nickname = store.state.accountStore.user.nickname || ''
                const isHost = store.state.gameStore.isHost || true
                const rate = store.getters['accountStore/getRate']
                const password = store.state.gameStore.password || true

                console.log('------------',rate)

                return new Promise((resolve, reject)=> {
                    console.log("level=",level);
                    console.log("nickname=",nickname);
                    console.log("isHost=", isHost);
                    console.log("rate=", rate);

                    $axios
                        .post(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}`, JSON.stringify({
                        "level" : level,
                        "nickname" : nickname,
                        "rate" : rate,
                        "isHost" : isHost,
                        "password" : password,
                    }), {
                        auth: {
                            username: 'OPENVIDUAPP',
                            password: OPENVIDU_SERVER_SECRET,
                        },
                    })
                    .then(response => response.data)
                    .then(data => resolve(data.token))
                    .catch(error => reject(error.response));
                })
            }



            // const createToken = (sessionId) => {
            // console.log("createtoken 시작")
            // console.log('sessionId : ',sessionId)
            // store.commit('gameStore/setMySessionId', sessionId)

            // return new Promise((resolve, reject) => {
            //     $axios
            //     .post(`${OPENVIDU_SERVER_URL}/api/rooms/${sessionId}`, JSON.stringify({
            //         "level": 1,
            //         "nickname": "테스트",
            //         "rate": 0.5,
            //         "isHost": true,
            //     }), {
            //         auth: {
            //         username: 'OPENVIDUAPP',
            //         password: OPENVIDU_SERVER_SECRET,
            //         },
            //     })
            //     .then(response => response.data)
            //     .then(data => resolve(data.token))
            //     .catch(error => {
            //         console.log("error : ", error)
            //         reject(error.response)
            //     });
            //     });
            // }

        return {
            state,
            changeMode,
            joinSession,
            getToken,
            createToken,
            createSession,
            leaveSession,
            updateMainVideoStreamManager
        }
    }

}
</script>

<style scoped>

</style>