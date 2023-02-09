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
    session: null,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    sessionId: null,
    myUserName: '',
    isHost: false,
    playerList: undefined,
    messages: [],
    media: 0.5,
    alarm: 0.5,
    audio: new Audio('https://ccrma.stanford.edu/~jos/mp3/harpsi-cs.mp3'),
    isAllReady: false,
    userList: [],
    userKey: [],
    chat: [],
    myConnectionId: '',
}

const getters = {
    getTeam: (state) => {
        return state.isTeam;
    },
    getSession: (state) => {
        return state.session;
    },
    getSessionId: (state) => {
      return state.sessionId;
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
    setSessionId: (state, id) => {
        state.sessionId = id;
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
      console.log('setIsAllReady 찍힘', data)
      state.isAllReady = data
    },
    setUserKey: (state, data) => {
      state.userKey.push(data)
    },
    setReady: (state, data) => {
      console.log('data:', data)
      var index = data.index
      var ready = data.ready
      state.userList[index].isReady = ready
    },
    setIsHost: (state, data) => {
      state.isHost = data
    },
    setMyConnectionId: (state, data) => {
      state.myConnectionId = data
    },
    setIsPresenter: (state, data) => {
      var index = data.index
      var value = data.value
      state.userList[index].isPresenter = value
    }

    //==============================

}
const actions = {
  _joinSession: (context, sessionId) => {
    console.log("joinsession 시작");
    // --- Get an OpenVidu object ---
    const OV = new OpenVidu();

    // --- Init a session ---
    const session = OV.initSession();


    // --- Specify the actions when events take place in the session ---
    // On every new Stream received...
    // stream = 영상 송출과 관련된 정보들 | 이은혁
    // 세션에 publisher를 등록하면 자동으로 streamCreated가 실행되고 다른사람의 subscribers에 내 stream정보를 담는 로직 | 이은혁
    session.on('streamCreated', ({ stream }) => {
      const subscriber = session.subscribe(stream);
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
    session.on("signal:my-chat", (event) => {
      const chatMessage = JSON.parse(event.data);
      const chatUser = event.from.connectionId;
      var nickname = '';
      state.userList.forEach(user => {
        if (user.conectionId == chatUser) {
          nickname = user.nickname;
        }
      });
      const data = { user: nickname, text: chatMessage, id: chatUser };
      context.commit('setChat', data);
    });


    // 게임 시그널 관리 - 수연
    session.on("signal:game", (event) => {
      switch (event.data.gameStatus) {
        // 3. 참여자들 정보 받기
        case 0: {
          console.log('0번 시그널 수신 완료')
          var PresenterId = event.data.curPresenterId
          console.log(event.data.curPresenterId)
          for (var n=0; n < state.userList.length; n++ ) {
            if (state.userList[n].conectionId == PresenterId) {
              context.commit('setIsPresenter', {index: n, value: true})
            } else {
              context.commit('setIsPresenter', {index: n, value: false})}}
          break
        }

        case 3: {
          // 참여자 정보 정리
          var data = event.data.playerState;
          var keys = Object.keys(data);
          for (var i=0; i < keys.length; i++) {
            var user = {};
            var key = keys[i]
            if (state.myUserName == data[key].player.nickname) {
              context.commit('setMyConnectionId', key)
            }

            user.conectionId = key;
            user.isReady = data[key].isReady;
            user.exp = data[key].player.exp;
            user.isHost = data[key].player.isHost;
            user.isPresenter = data[key].player.isPresenter;
            user.level = data[key].player.level;
            user.nickname = data[key].player.nickname;
            user.rate = data[key].player.rate;
            user.score = data[key].player.score;
            user.team = data[key].player.team;
            if (!(state.userKey).includes(user.conectionId)) {
              console.log('user.conectionId', user.conectionId)
              console.log('state.userKey: ', state.userKey)
              context.commit('setUserKey', user.conectionId)
              context.commit('setUserList', user)
            }
          }
          break;
        }

        // 4. 참여자 ready 정보 경신 - 수연
        case 4: {
          console.log('4번 시그널 받음', event.data)
          var allready = event.data.isAllReady
          context.commit('setIsAllReady', allready)
          var readyData = event.data
          for (var k=0; k < state.userList.length; k++) {
            context.commit('setReady', {index: k, ready: readyData[state.userList[k].conectionId]})
          }
          // 모두 레디 했을 때, 게임 시작됨
          if (allready) {
            context.dispatch('gameStart')
            context.commit('setIsAllReady', allready)
          }
          break;
        }

        case 5: {
          console.log('5번 시그널 수신 완료')
          console.log(event.data)
        }


        }}
    );



    context.dispatch("getToken", sessionId).then(token => {
      console.log("여기까지 완료, token :", token, "state.myUserName :", state.myUserName);
      console.log("session : ", session);
      session.connect(token, { clientData: state.myUserName })
        .then(() => {
          // --- Get your own camera stream with the desired properties ---
          let publisher = OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false // Whether to mirror your local video or not
          });
          // .catch((error)=> console.log(error));
          console.log("아싸");
          context.commit("setOV", OV);
          context.commit("setSession", session);
          context.commit("setMainStreamManager", publisher);
          context.commit('SET_PUBLISHER', publisher);
          // --- Publish your stream ---
          session.publish(state.publisher);

          // 입장할 때 참여자 정보 가져오기 - 수연
          session.signal({
            type: 'game',
            data: {
              gameStatus: 3,
            },
            to: [],
          });
        })
        .catch(error => {
          console.log('There was an error connecting to the session:', error.code, error.message);
        });
    });
  },
  get joinSession() {
    return this._joinSession;
  },
  set joinSession(value) {
    this._joinSession = value;
  },

    createSession : (context, sessionId) => { // => 세션 생성 후 세션ID 발급됨
        if (sessionId) {
            console.log("세션ID 이미 존재");
            return sessionId
        } else {
            console.log("토큰 존재하지 않음");
            context.commit('setIsHost', true)
            console.log("title", state.title, "isSecret",  state.isSecret,"password", state.password, "isTeamBattle", state.isTeamBattle)
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

    getToken: ({dispatch}, sessionId) => {
        console.log('gettoken 진입')
        return dispatch('createSession', sessionId) // createsession 반환값 => sessionId
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

    // Bgm 관련 코드 - 수연
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
    },

    changeTest: (context) => {
        context.commit("setIsAllReady", true)     
    },

    // 팀전 할 때 사용할 코드, 지금은 안 씀 - 수연
    // changeTeamAction: async (context, color) => {
    //   try {
    //     const response = await changeTeam(state.sessionId, state.myConnectionId, color)
    //     console.log(response.data)
    //   } catch (err) {
    //     console.log(err)
    //   }

    //   state.session.signal({
    //     type: 'game',
    //     data: {
    //       gameStatus: 3,
    //     },
    //     to: [],
    //   });
    // },

    // 정답 값 5개 보내는 시그널 - 수연
    sendTopFive: (context, topFive) => {
      try {
        console.log('5번 시그널 보냄')
        console.log('보낸 데이터 : ', topFive)
        state.session.signal({
          type: 'game',
          data: {
            gameStatus: 5,
            answer: JSON.stringify(topFive)
          },
          to: [],
        });
      } catch (err) {
        console.log(err)
      }
    },
    // 게임 시작 시그널 - 수연
    gameStart: () => {
      try {
        state.session.signal({
          type: 'game',
          data: {
            gameStatus: 2,
          },
          to: [],
        });
      } catch (err) {
        console.log(err)
      }
      try {
        state.session.signal({
          type: 'game',
          data: {
            gameStatus: 0,
          },
          to: [],
        });
      } catch (err) {
        console.log(err)
      }
    }
    

}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}