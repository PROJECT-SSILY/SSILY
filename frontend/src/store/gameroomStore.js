// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { makeRoomAction } from "@/common/api/gameroomAPI";

const state = {
    teamorprivate: null
}

const getters = {
}

const mutations = {
    
}

const actions = {
    isTeam: (state) => {
        if(state.teamorprivate == false){
            state.teamorprivate == true
        } else {
            state.teamorprivate = false;
        }
        console.log(state.teamorprivate);
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