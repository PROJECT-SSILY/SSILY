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
    mySessionId: 'sessionA',
    myUserName: '',
}

const getters = {
    getTeam: (state) => {
        return state.teamorprivate;
    },
    getSession: (state) => {
        return state.session;
    },
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
    // ---------------openvidu-----------------------------------------------
    joinSession: ({dispatch, state, commit}) => {
      const OV = new OpenVidu();
      const session = OV.initSession();
      const subscribers = [];

      session.on('streamCreated', ({ stream }) => {
        const subscriber = session.subscribe(stream);
				subscribers.push(subscriber);
			});
      console.log('streamCreated 완')
      session.on("streamDestroyed", ({ stream }) => {
        const index = subscribers.indexOf(stream.streamManager, 0);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      });
      console.log('streamDestroyed 완')

      session.on("exception", ({ exception }) => {
        console.warn(exception);
      });

      console.log('mySessionId', state.mySessionId)
      
      // get token
      dispatch("getToken", state.mySessionId).then(token => {
        session
        .connect(token, { clientData: state.myUserName })
        .then(()=>{

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
          // 추가
          commit("setOV", OV)
          commit("setSession", session)

          // WaitingPage에 있음
          commit("setMainStreamManager", publisher)
          commit("setPublisher", publisher)
          console.log('state변경완 : ', state)

          session.publish(publisher)
          console.log('publish완')
        })
        .catch(error => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
      });
      window.addEventListener('beforeunload', state.leaveSession)
    },

    getToken: ({dispatch}, mySessionId) => {
      console.log('gettoken진입')
      console.log('gettoken에 있는 mysessionId', mySessionId)
      return dispatch("createSession", mySessionId)
      .then((mySessionId) =>
      dispatch("createToken", mySessionId)
      )
    },
    createToken: (context, mySessionId) => {
      console.log('sessionId',mySessionId);
      return new Promise((resolve, reject)=> {
        $axios
					.post(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}`, JSON.stringify({
            "level" : 5,
            "nickname" : "회원 닉네임",
            "rate" : 0.5,
            "isHost" : true,
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
      console.log('createsession 진입 session Id : ', sessionId)
      return new Promise((resolve, reject) => {
        console.log("DDDDDD")
				$axios
					.post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}