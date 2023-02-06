import { roomList } from "@/common/api/gameAPI";
// import { OpenVidu } from "openvidu-browser";
import $axios from "axios";

$axios.defaults.headers.post['Content-Type'] = 'application/json';
// const OPENVIDU_SERVER_URL = "https://localhost:4443";
// const OPENVIDU_SERVER_SECRET = "MY_SECRET";

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
    }
  
}
const actions = {
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
    // ---------------openvidu-------------------
    // joinSession: (context) => {
    //   const OV = new OpenVidu();
    //   const session = OV.initSession();
    //   const subscribers = [];

    //   session.on('streamCreated', ({ stream }) => {
    //     const subscriber = session.subscribe(stream);
		// 		subscribers.push(subscriber);
		// 	});


    //   session.on("streamDestroyed", ({ stream }) => {
    //     const index = subscribers.indexOf(stream.streamManager, 0);
    //     if (index >= 0) {
    //       subscribers.splice(index, 1);
    //     }
    //   });

    //   session.on("exception", ({ exception }) => {
    //     console.warn(exception);
    //   });

    //   context.commit("setMySessionId", state.mySessionId)
    //   state.myUserName = context.rootState.accountStore.user.nickname;
    //   context.dispatch("getToken", state.mySessionId).then(token => {
    //     session
    //     .connect(token, { clientData: state.myUserName })
    //     .then(()=>{

    //       let publisher = OV.initPublisher(undefined, {
    //         audioSource: undefined,
    //         videoSource: undefined,
    //         publishAudio: true,
    //         publishVideo: true,
    //         resolution: '640x480',
    //         frameRate: 30,
    //         insertMode: 'APPEND',
    //         mirror: false
    //       });
    //       context.commit("setOV", OV)
    //       context.commit("setSession", session)
    //       context.commit("setMainStreamManager", publisher)
    //       context.commit("setPublisher", publisher)

    //       session.publish(publisher)
    //     })
    //     .catch(error => {
    //       console.log('There was an error connecting to the session:', error.code, error.message);
    //     });
    //   });
    //   window.addEventListener('beforeunload', state.leaveSession)
    // },

    // getToken: ({dispatch}, mySessionId) => {
    //   console.log('gettoken 진입')
    //   return dispatch("createSession", mySessionId)
    //   .then((mySessionId) =>
    //   dispatch("createToken", mySessionId)
    //   )
    // },
    // createToken: (context, mySessionId) => {
    //   console.log('안됨?')
    //   const level = context.rootState.accountStore.user.level
    //   const nickname = context.rootState.accountStore.user.nickname
    //   const isHost = state.isHost
    //   const rate = context.rootGetters['accountStore/getRate']
    //   console.log('------------',rate)
    //   return new Promise((resolve, reject)=> {
    //     console.log("level=",level);
    //     console.log("nickname=",nickname);
    //     console.log("isHost=", isHost);
    //     console.log("rate=", rate);
    //     const isSecret = state.isSecret
    //     if (isSecret) {
    //       $axios
		// 			.post(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}`, JSON.stringify({
    //         "level" : level,
    //         "nickname" : nickname,
    //         "rate" : rate,
    //         "isHost" : isHost,
    //         "password" : state.password
    //       }), {
    //         auth: {
    //           username: 'OPENVIDUAPP',
		// 					password: OPENVIDU_SERVER_SECRET,
		// 				},
		// 			})
		// 			.then(response => response.data)
		// 			.then(data => resolve(data.token))
		// 			.catch(error => reject(error.response));
    //     } else {
    //       $axios
		// 			.post(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}`, JSON.stringify({
    //         "level" : level,
    //         "nickname" : nickname,
    //         "rate" : rate,
    //         "isHost" : isHost,
    //       }), {
    //         auth: {
    //           username: 'OPENVIDUAPP',
		// 					password: OPENVIDU_SERVER_SECRET,
		// 				},
		// 			})
		// 			.then(response => response.data)
		// 			.then(data => resolve(data.token))
		// 			.catch(error => reject(error.response));
    //     }
    //     })

    // },
    // createSession: (context, sessionId) => {
    //   const myTitle= state.title;
    //   console.log("내 타이틀 이거임", myTitle);
    //   console.log("createsession 팀 ", state.isTeamBattle);
    //   return new Promise((resolve, reject) => {
		// 	$axios
		// 	.post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
    //         // 하드코딩한 부분 나중에 수정 필요

    //         "title" : myTitle,
    //         "isSecret" : state.isSecret,
    //         "password" : state.password,
    //         "isTeamBattle" : state.isTeamBattle,
    //         "customSessionId" : sessionId,
    //       }), {
		// 				auth: {
		// 					username: 'OPENVIDUAPP',
		// 					password: OPENVIDU_SERVER_SECRET,
		// 				},
		// 			})
		// 			.then(response => response.data)
		// 			.then(data => resolve(data.id))
		// 			.catch(error => {
		// 				if (error.response.status === 409) {
		// 					resolve(sessionId);
		// 				} else {
		// 					console.warn(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`);
		// 					if (window.confirm(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`)) {
		// 						location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
		// 					}
		// 					reject(error.response);
		// 				}
		// 			});
		// 	});
    // },
    // leaveSession: (commit) => {
    //   if (state.session) state.session.disconnect();
    //   commit("setSession", undefined)
    //   commit("setMainStreamManager", undefined)
    //   commit("setPublisher", undefined)
    //   commit("setSubscribers", [])
    //   commit("setOV", undefined)
    // },


    // updateMainVideoStreamManager: (commit, stream) => {
    //   if (state.mainStreamManager === stream) return;
    //   commit("setMainStreamManager", stream)
    // }

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