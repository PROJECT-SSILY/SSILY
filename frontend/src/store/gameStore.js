// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { makeRoomAction } from "@/common/api/gameAPI";

const state = {
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
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}