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