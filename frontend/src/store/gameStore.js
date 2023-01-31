// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { makeRoomAction } from "@/common/api/gameAPI";

const state = {
    teamorprivate: null
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