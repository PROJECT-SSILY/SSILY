import { roomList } from "@/common/api/gameAPI";
// import { OpenVidu } from "openvidu-browser";
import $axios from "axios";

$axios.defaults.headers.post['Content-Type'] = 'application/json';
// const OPENVIDU_SERVER_URL = "https://localhost:4443";
// const OPENVIDU_SERVER_SECRET = "MY_SECRET";


<<<<<<< HEAD
import $axios from "axios";
$axios.defaults.headers.post['Content-Type'] = 'application/json';

import { makeRoomAction } from "@/common/api/gameAPI";
import { OpenVidu } from 'openvidu-browser';

const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const state = { // 원본 소스의 역할을 하며, View와 직접적으로 연결되어있는 Model
    teamorprivate: null,
=======

const state = {
    title: null,
    isSecret: false,
    password: null,
    isTeamBattle: null,
    isTeam: null,
>>>>>>> feature/ingame
    OV: undefined,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    mySessionId: '',
    myUserName: '',
    isHost: true,
    playerList: undefined,
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

<<<<<<< HEAD
const mutations = { // state를 변경하는 유일한 방법. 이벤트와 유사
    setTeam: (state) => {
        state.teamorprivate = !state.teamorprivate;
=======
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
>>>>>>> feature/ingame
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
  
}
<<<<<<< HEAD

const actions = { // mutation과 달리 비동기 작업 가능
=======
const actions = {
>>>>>>> feature/ingame
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
<<<<<<< HEAD

    // <actions 함수 작성법>
    // example : ({ state, commit }, { newMsg }) => {
    //     console.log(state, commit, newMsg)
    // },

    // ========== OpenVidu ============

    joinSession : (context) => {
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
        context.dispatch('getToken', state.mySessionId).then(token => {
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
        window.addEventListener('beforeunload', state.leaveSession)
    },
  
    leaveSession : () => {
        // --- Leave the session by calling 'disconnect' method over the Session object ---
        if (state.session) state.session.disconnect();
  
        state.session = undefined;
        state.mainStreamManager = undefined;
        state.publisher = undefined;
        state.subscribers = [];
        state.OV = undefined;
  
        window.removeEventListener('beforeunload', state.leaveSession);
    },
  
    updateMainVideoStreamManager : (stream) => {
        if (state.mainStreamManager === stream) return;
        state.mainStreamManager = stream;
    },
  
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
  
    getToken : (context, mySessionId) => {
        console.log("gettoken 시작")
        return context.dispatch('createSession', mySessionId).then(sessionId => context.dispatch('createToken', sessionId));
    },
  
      // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-session
    createSession : (context, sessionId) => {
        console.log("createsession 시작")
        return new Promise((resolve, reject) => {
          console.log("createdssesion promise")
          $axios
            .post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
              "title": "방제목",
              "isSecret": true,
              "password": "1234",
              "team": 'RED'
            }), {
              auth: {
                username: 'OPENVIDUAPP',
                password: OPENVIDU_SERVER_SECRET,
              },
            })
            .then(response => response.data)
            .then(data =>{
              console.log("data.id : ", data.id)
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
    },
  
      // See https://docs.openvidu.io/en/stable/reference-docs/REST-API/#post-connection
    createToken : (context, sessionId) => {
        console.log("createtoken 시작")
        console.log('sessionId : ',sessionId)
        return new Promise((resolve, reject) => {
          $axios
            .post(`${OPENVIDU_SERVER_URL}/api/rooms/${sessionId}`, JSON.stringify({
                "level": 1,
                "nickname": "테스트",
                "rate": 0.5,
                "isHost": true,
          }), {
              auth: {
                username: 'OPENVIDUAPP',
                password: OPENVIDU_SERVER_SECRET,
              },
            })
            .then(response => response.data)
            .then(data => resolve(data.token))
            .catch(error => {
              console.log("error : ", error)
              reject(error.response)
            });
          });
    },
=======
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
>>>>>>> feature/ingame
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}