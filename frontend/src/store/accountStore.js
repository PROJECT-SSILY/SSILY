// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { requestLogin, requestRegister, checkEmail, checkNickname, sendNewPwAction, requestMe, changeNickname, changePassword, deleteAccount } from "@/common/api/accountAPI";

const state = {
    token: localStorage.getItem('token') || null,
    user: {
        email: "",
        name: "",
        nickname: "",
        level: null,
        exp: null,
        record: {
            plays: null,
            wins: null,
            draws: null,
        }
    }
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
    getRate: (state) => {
        if (state.plays) {
            return parseFloat(state.wins/(state.plays - state.draws - state.wins)).toFixed(1)
        }
        return parseFloat(0).toFixed(1)
    }
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
    setNickname: (state, nickname) => {
        state.nickname = nickname;
    },
}

const actions = {
    loginAction: async ({ dispatch, commit }, loginData) => {
        // console.log("loginData : ", loginData);
        const response = await requestLogin(loginData);
        // console.log("response : ", response);
        if (response == -100) {
          return -100;
        }
        await commit("setToken", response.data.data.accessToken);
        localStorage.setItem('token', state.token)
        dispatch("getMeAction", response.data.data.accessToken)
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
    },
    getMeAction: async ( context, token) => {
        try {
            const response = await requestMe(token);
            console.log("getMe : ", response.data.data);
            await context.commit("setUser", response.data.data);
            return response.data.data
        } catch (err) {
            console.log(err);
        }
    },
    changeNicknameAction: async (context, nickname) => {
        try {
            const response = await changeNickname(context.state.token, nickname)
            return response
        } catch (err) {
            console.log(err)
            throw err;
        }
    },
    changePasswordAction: async (context, payload) => {
        try {
            console.log("비밀번호", payload)
            const response = await changePassword(context.state.token, payload)
            console.log("store에서 보냈다")
            return response
        } catch (err) {
            console.log(err)
            throw err;
        }
    },
    deleteAction: async (context) => {
        try {
            console.log(context);
            const response = await deleteAccount(context.state.token)
            await context.commit("setToken", null);
            localStorage.removeItem('token')
            return response
        } catch(err) {
            console.log(err);
            throw err
        }
    }
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