// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import $axios from "axios";
$axios.defaults.headers.post['Content-Type'] = 'application/json';

import { makeRoomAction } from "@/common/api/gameAPI";
import { OpenVidu } from 'openvidu-browser';

const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const state = { // 원본 소스의 역할을 하며, View와 직접적으로 연결되어있는 Model
    teamorprivate: null,
    OV: undefined,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    mySessionId: '',
    myUserName: '',
}

const getters = {
    getTeam: (state) => {
        return state.teamorprivate;
    },
}

const mutations = { // state를 변경하는 유일한 방법. 이벤트와 유사
    setTeam: (state) => {
        state.teamorprivate = !state.teamorprivate;
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
}

const actions = { // mutation과 달리 비동기 작업 가능
    isTeam: (state) => {
        state.commit("setTeam", null)
        console.log(state.getters.getTeam);
    },
    roomAction: async (commit, formData) => {
        try {
            console.log(formData)
            const response = await makeRoomAction(formData)
            console.log(response);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

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
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}