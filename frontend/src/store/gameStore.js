import { roomList } from "@/common/api/gameAPI";
import { OpenVidu } from "openvidu-browser";
import $axios from "axios";

$axios.defaults.headers.post['Content-Type'] = 'application/json';
const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

import { randomTeam, randomPrivate } from "@/common/api/gameAPI";

const state = {
    title: null,
    isSecret: false,
    password: null,
    isTeamBattle: null,
    isTeam: null,
    OV: undefined,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    mySessionId: '',
    myUserName: '',
    isHost: true,
    playerList: undefined,
    messages: [],
    media: 0.5,
    alarm: 0.5,
    audio: new Audio('https://ccrma.stanford.edu/~jos/mp3/harpsi-cs.mp3')
}

const getters = {
    getTeam: (state) => {
        return state.isTeam;
    },
    getSession: (state) => {
        return state.session;
    },
    getSessionId: (state) => {
      return state.mySessionId;
    },
    getTitle: (state) => {
      return state.title;
    },

}


const mutations = {

    setTitle: (state, data) => {
        state.title = data
        console.log('set적용되는지확인' + state.title);
    },
    setSecret: (state, payload) => {
        state.isSecret = payload
    },
    setPassword: (state, payload) => {
        state.password = payload
    },
    setTeam: (state, payload) => {
        state.isTeamBattle = payload
        console.log('set적용되는지확인' + state.isTeamBattle);
    },
    setOV: (state, data) => {
        state.OV = data;
    },
    setSession: (state, data) => {
        state.session = data;
    },
    setMainStreamManager: (state, data) => {
        state.mainStreamManager = data;
    },
    setPublisher: (state, data) => {
        state.publisher = data;
    },
    setSubscribers: (state, data) => {
        state.subscribers = data;
    },
    setMySessionId: (state, id) => {
        state.mySessionId = id;
    },
    setMyUserName: (state, name) => {
        state.myUserName = name;
    },
    changeMode: (state) => {
      state.isTeam = !state.isTeam
    },
    setPlayerList: (state, data) => {
        state.playerList = data
    },
    setVolume1: (state, volume) => {
      state.media = volume
    },
    setVolume2: (state, volume) => {
      state.alarm = volume
    },
    SET_MESSAGES: (state, data) => {
        state.messages = data
    },

}
const actions = {
    joinSession : (context) => {
        console.log("joinsession 시작")
        // --- Get an OpenVidu object ---
        const OV = new OpenVidu();

        // --- Init a session ---
        const session = OV.initSession();

        // --- Specify the actions when events take place in the session ---
        // On every new Stream received...
        session.on('streamCreated', ({ stream }) => {
            const subscriber = state.session.subscribe(stream);
            state.subscribers.push(subscriber);
        });

        // On every Stream destroyed...
        session.on('streamDestroyed', ({ stream }) => {
            const index = state.subscribers.indexOf(stream.streamManager, 0);
            if (index >= 0) {
            state.subscribers.splice(index, 1);
            }
        });

        // On every asynchronous exception...
        session.on('exception', ({ exception }) => {
            console.warn(exception);
        });

        // state.session.on("signal:chat", (event)=>{
        //     const { message } = JSON.parse(event.data);
        //     const { user, chatMessage } = message
        //     const data = user + " : " + chatMessage
        //     store.commit('gameStore/SET_MESSAGES', data)
        // });

        // --- Connect to the session with a valid user token ---
        // 'getToken' method is simulating what your server-side should do.
        // 'token' parameter should be retrieved and returned by your own backend

        context.dispatch("getToken", state.mySessionId).then(token => {
            console.log("여기까지 완료, token :", token, "state.myUserName :", state.myUserName )
            console.log("session : ", session )
            session.connect(token, { clientData: state.myUserName })
            .then(() => {
                // --- Get your own camera stream with the desired properties ---
                let publisher = OV.initPublisher(undefined, {
                    audioSource: undefined, // The source of audio. If undefined default microphone
                    videoSource: undefined, // The source of video. If undefined default webcam
                    publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
                    publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
                    resolution: '640x480',  // The resolution of your video
                    frameRate: 30,			// The frame rate of your video
                    insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
                    mirror: false       	// Whether to mirror your local video or not
                });
                console.log("아싸")
                context.commit("setOV", OV)
                context.commit("setSession", session)
                context.commit("setMainStreamManager", publisher)
                context.commit("setPublisher", publisher)
                // --- Publish your stream ---

                session.publish(state.publisher);
            })
            .catch(error => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
        });
        // window.addEventListener('beforeunload', this.leaveSession)
    },

    createSession : (context, sessionId) => { // => 세션 생성 후 세션ID 발급됨
        if (sessionId) {
            console.log("토큰 이미 존재");
            return sessionId
        } else {
            console.log("토큰 존재하지 않음");
            return new Promise((resolve, reject) => {
                $axios
                .post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
                "title" : state.title,
                "isSecret" : state.isSecret,
                "password" : state.password,
                "isTeamBattle" : state.isTeamBattle
                }), {
                    auth: {
                        username: 'OPENVIDUAPP',
                        password: OPENVIDU_SERVER_SECRET,
                    },
                })
                .then(response => response.data)
                .then(data => {
                    console.log("세션ID :", data.id)
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
    },

    createToken : (context, sessionId) => {
        // const level = store.state.accountStore.user.level || 1
        // const nickname = store.state.accountStore.user.nickname || ''
        // const isHost = store.state.gameStore.isHost || true
        // const rate = store.getters['accountStore/getRate']
        // const password = store.state.gameStore.password || true
        // const exp = store.state.accountStore.user.exp || 0
        // state.myUserName=store.state.accountStore.user.nickname || ''
        const level = context.rootState.accountStore.user.level
        const nickname = context.rootState.accountStore.user.nickname
        const isHost = state.isHost
        const rate = context.rootGetters['accountStore/getRate']
        const password = state.password || true
        const exp = context.rootState.accountStore.user.exp || 0
        state.myUserName=context.rootState.accountStore.user.nickname || ''


        return new Promise((resolve, reject)=> {
            console.log("level=",level);
            console.log("nickname=",nickname);
            console.log("isHost=", isHost);
            console.log("rate=", rate);
            console.log("password=", password);
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
            .then(response => {
                console.log(response)
                return response.data
            })
            .then(data => resolve(data.token))
            .catch(error => reject(error.response));
        })
    },

    getToken: ({dispatch}, mySessionId) => {
        console.log('gettoken 진입')
        return dispatch('createSession', mySessionId) // createsession 반환값 => sessionId
        .then((sessionId) => dispatch('createToken', sessionId));
    },

    leaveSession: (commit) => {
        if (state.session) state.session.disconnect();
        commit("setSession", undefined)
        commit("setMainStreamManager", undefined)
        commit("setPublisher", undefined)
        commit("setSubscribers", [])
        commit("setOV", undefined)
    },

    updateMainVideoStreamManager: (commit, stream) => {
        if (state.mainStreamManager === stream) return;
        commit("setMainStreamManager", stream)
    },


    isTeam: (state) => {
        state.commit("changeMode", null)
        console.log(state.getters.getTeam);
    },
    getRoomList: async() => {
        // const res = await roomList()
        const res = ''
        console.log('room리스트 ', roomList());
        console.log('getroomlist : ',res)
        try {
            return res
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    randomTeamAction: async (context, payload) => {
      try{
        console.log(payload);
        const userInfo = {
          "isTeamBattle": payload.isTeamBattle,
          "level": context.rootState.accountStore.user.level,
          "nickname": context.rootState.accountStore.user.nickname,
          "rate": "0.0",
        }
        console.log(userInfo)
        const response = await randomTeam(userInfo)
        return response
      } catch(err) {
        console.log(err);
        throw err
      }
    },
    randomPrivateAction: async (context, payload) => {
      try{
        console.log(payload);
        const userInfo = {
          "isTeamBattle": payload.isTeamBattle,
          "level": context.rootState.accountStore.user.level,
          "nickname": context.rootState.accountStore.user.nickname,
          "rate": "0.0",
        }
        console.log(userInfo)
        const response = await randomPrivate(userInfo)
        return response
      } catch(err) {
        console.log(err);
        throw err
      }
    },
    playBgm: () => {
        state.audio.volume = state.media
        state.audio.loop = true
        state.audio.play()
    },

    changeVolume1: (context, volume) => {
        context.commit("setVolume1", volume)
        state.audio.volume = volume
    },

    changeVolume2: (context, volume) => {
        context.commit("setVolume2", volume)
        // 아직 효과음 없어서 볼륨 조절 코드 없음 효과음 추가 이후 작성 예정
        console.log('alarm 볼륨 조절')
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}