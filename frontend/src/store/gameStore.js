// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { makeRoomAction } from "@/common/api/gameAPI";


import { OpenVidu } from "openvidu-browser";
import $axios from "axios";

$axios.defaults.headers.post['Content-Type'] = 'application/json';
const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";



const state = {
    teamorprivate: null,
    OV: undefined,
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    mySessionId: '',
    myUserName: '',
    isHost: true
}

const getters = {
    getTeam: (state) => {
        return state.teamorprivate;
    },
    getSession: (state) => {
        return state.session;
    },
    getSessionId: (state) => {
      return state.mySessionId;
    }
}

const mutations = {
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

const actions = {
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
    // ---------------openvidu-------------------
    joinSession: ({dispatch, state, commit}) => {
      const OV = new OpenVidu();
      const session = OV.initSession();
      const subscribers = [];

      session.on('streamCreated', ({ stream }) => {
        const subscriber = session.subscribe(stream);
				subscribers.push(subscriber);
			});


      session.on("streamDestroyed", ({ stream }) => {
        const index = subscribers.indexOf(stream.streamManager, 0);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      });

      session.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      
      dispatch("getToken", state.mySessionId).then(token => {
        session
        .connect(token, { clientData: state.myUserName })
        .then(()=>{

          let publisher = OV.initPublisher(undefined, {
            audioSource: undefined, 
            videoSource: undefined, 
            publishAudio: true,  	
            publishVideo: true, 
            resolution: '640x480', 
            frameRate: 30,			
            insertMode: 'APPEND',	
            mirror: false       
          });
          commit("setOV", OV)
          commit("setSession", session)
          commit("setMainStreamManager", publisher)
          commit("setPublisher", publisher)

          session.publish(publisher)
        })
        .catch(error => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
      });
      window.addEventListener('beforeunload', state.leaveSession)
    },

    getToken: ({dispatch}, mySessionId) => {
      return dispatch("createSession", mySessionId)
      .then((mySessionId) =>
      dispatch("createToken", mySessionId)
      )
    },
    createToken: (context, mySessionId) => {
      console.log('안됨?')
      const level = context.rootState.accountStore.user.level
      const nickname = context.rootState.accountStore.user.nickname
      const isHost = state.isHost
      const rate = context.rootGetters['accountStore/getRate']
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

    },
    createSession: (context, sessionId) => {
      return new Promise((resolve, reject) => {
				$axios
					.post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
            // 하드코딩한 부분 나중에 수정 필요
            "title" : "방제목",
            "isSecret" : false,
            "password" : "123",
            "team" : "NONE"
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}