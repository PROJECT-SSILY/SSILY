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
    audio: new Audio('https://ccrma.stanford.edu/~jos/mp3/harpsi-cs.mp3'),
    isAllReady: false,
    userList: [],
    chat: []
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
    getUserList: (state) => {
      return state.userList;
    },
    getChat: (state) => {
      return state.chat
    },
    // 우리편 팀원들을 골라서 뽑아내는 메서드
    getMyTeams: (state) => {
        const myTeamColor = state.publisher.team
        const res = []
        state.subscribers.forEach(sub => {
            if(sub.team == myTeamColor) {
                res.push(sub)
            }
        });
        return res;
    },

    // 상대편 팀원들을 골라서 뽑아내는 메서드
    getOpponents: (state) => {
        const myTeamColor = state.publisher.team
        const res = []
        state.subscribers.forEach(sub => {
            if(sub.team != myTeamColor) {
                res.push(sub)
            }
        });
        return res;
    }

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
    SET_PUBLISHER (state, data) {
        state.publisher = data
    },
    setMainStreamManager: (state, data) => {
        state.mainStreamManager = data;
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
    setChat: (state, data) => {
      state.chat.push(data)
    },
    setUserList: (state, data) => {
      state.userList.push(data)
    },
    setIsAllReady: (state, data) => {
      state.isAllReady = data
    }

    //==============================

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

        // stream = 영상 송출과 관련된 정보들
        // 세션에 publisher를 등록하면 자동으로 streamCreated가 실행되고 다른사람의 subscribers에 내 stream정보를 담는 로직
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

        // 채팅 신호 관리 - 수연
        session.on("signal:my-chat", (event)=> {
          const chatMessage = event.data
          const chatUser = event.from.connectionId
          var nickname = ''
          state.userList.forEach(user => {
            if (user.conectionId == chatUser) {
              nickname = user.nickname
            }
          })
          const data = {user : nickname, text: chatMessage, id: chatUser}
          console.log('채팅 신호 받음')
          context.commit('setChat', data)
          

        })

  
        // 게임 시그널 관리 - 수연
        session.on("signal:game", (event)=>{
          switch(event.data.gameStatus) {
            // 3. 참여자들 정보 받기
              case 3: {
                  // 참여자 정보 정리
                  var data = event.data.playerState
                  var key = Object.keys(data)[0]
                  var user = {}
                  user.conectionId = key
                  user.isReady = data[key].isReady     
                  user.exp = data[key].player.exp
                  user.isHost = data[key].player.isHost
                  user.isPresenter = data[key].player.isPresenter
                  user.level = data[key].player.level
                  user.nickname = data[key].player.nickname
                  user.rate = data[key].player.rate
                  user.score = data[key].player.rate
                  user.team = data[key].player.rate
                  if (state.userList.length) {
                    // 없는 유저일때만 저장
                    for (var i=0; i<state.userList.length; i++) {
                      if (state.userList.connectionId != key) {
                        context.commit('setUserList', user)
                        console.log('유저리스트 : ', state.userList)
                      }}
                  } else {
                    context.commit('setUserList', user)
                  }
                  break
              }
              // 4. 참여자 ready 정보 경신
              case 4: {
                state.isAllReady = event.data.isAllReady
                var readyUser = Object.keys(event.data)[1]
                state.userList.forEach(user => {
                  if (user.conectionId == readyUser) {
                    user.isReady = !user.isReady
                    console.log('user', user.nickname, '의 ready', user.isReady)
                    context.commit('setIsAllReady', state.isAllReady)
                  }
                })
                break
            }
          }
      });




        // session.on의 첫번째 인자 = event(String), 두번째 인자 = 앞의 event를 받아서 실행하는 함수(Function)
        // event.data에 채팅 input에서 받은 내용을 parsing해서 state의 messages에 반영

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
                context.commit('SET_PUBLISHER', publisher)
                // --- Publish your stream ---

                session.publish(state.publisher);

                // 입장할 때 참여자 정보 가져오기
                session.signal({
                  type: 'game',
                  data: {
                    gameStatus: 3,
                  },
                  to: [],
                })  
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

    leaveSession: (context) => {
        if (state.session) state.session.disconnect();
        context.commit("setSession", undefined)
        context.commit("setMainStreamManager", undefined)
        context.commit("setSubscribers", [])
        context.commit("setOV", undefined)
        context.commit('SET_PUBLISHER', undefined)
    },

    updateMainVideoStreamManager: (commit, stream) => {
        if (state.mainStreamManager === stream) return;
        commit("setMainStreamManager", stream)
    },

    

    // 참여자 레디 상태 변경 - ingamePage에서 clickReady 했을 때 호출
    changeReady: () => {
      state.session.signal({
        type: 'game',
        data: {
          gameStatus: 4,
        },
        to: [],
      })
    },

    // 채팅
    sendMessage: (context, chattings) => {
      state.session.signal({
        data: JSON.stringify(chattings),
        type: 'my-chat'
      })
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