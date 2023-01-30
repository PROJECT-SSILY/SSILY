// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { requestLogin, requestRegister, checkEmail, checkNickname, sendNewPwAction } from "@/common/api/accountAPI";

const state = {
    token: localStorage.getItem('token') || null,
}

const getters = {
    getToken: (state) => {
        return state.token;
    },
    getUser: (state) => {
        return state.user;
    },
    getCheckId: (state) => {
        return state.checkId;
    },
}

const mutations = {
    setToken: (state, token) => {
        state.token = token;
    },
    setUser: (state, data) => {
        state.user = data;
    },
    setCheckId: (state, checkId) => {
        state.checkId = checkId;
    },
}

const actions = {
    loginAction: async ({ commit }, loginData) => {
        // console.log("loginData : ", loginData);
        const response = await requestLogin(loginData);
        // console.log("response : ", response);
        if (response == -100) {
          return -100;
        }
        await commit("setToken", response.data.data.accessToken);
        localStorage.setItem('token', state.token)
        // console.log('토큰: ', state.token)
    },
    logoutAction: async ({ commit }) => {
        commit("setToken", null);
        localStorage.removeItem('token')
    },
    // mountAction: async ({ commit }) => {
    //     const local = await localStorage.getItem("token");
    //     commit("setToken", local);
    // },
    registerAction: async (commit, registerData) => {
        try {
            console.log(registerData)
            const response = await requestRegister(registerData)
            console.log(response);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    checkEmailAction: async (commit, email) => {
        try {
            console.log(email)
            const response = await checkEmail(email)
            return response
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    checkNicknameAction: async (commit, nickname) => {
        try {
            console.log(nickname)
            const response = await checkNickname(nickname)
            return response
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    sendAction: async (commit, userInfo) => {
        try {
            console.log(userInfo)
            const response = await sendNewPwAction(userInfo)
            console.log(response,'11111111111여긴 코드가 와야댐')
            return response
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    // getMeAction: async ({ commit }, token) => {
    //     try {
    //         // console.log("token : ", token);
    //         const response = await requestMe(token);
    //         console.log("getMe : ", response);
    //         await commit("setUser", response);
    //     } catch (err) {
    //         console.log("111");
    //     }
    // },
    // idAction: async ({ commit }, idData) => {
    //     console.log(idData, "------axios------");
    //     const response = await requestId(idData.id);
    //     console.log(response); // true or false
    //     await commit("setCheckId", response);
    // },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}