import $axios from "axios";

import { requestLogin, requestRegister, checkEmail, checkNickname, sendNewPwAction, requestMe, changeNickname, deleteAccount } from "@/common/api/accountAPI";

const state = {
    token: localStorage.getItem('token') || null,
    user: {
        email: "test@example.com",
        name: "이름",
        nickname: "닉네임",
        level: 0,
        exp: null,
        record: {
            plays: null,
            wins: null,
            draws: null,
        }
    },
    alertColor: null,
    alertMessage: null,
    alertIcon: null,
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
    setAlertColor: (state, data) => {
        state.alertColor = data;
    },
    setAlertMessage: (state, data) => {
        state.alertMessage = data;
    },
    setAlertIcon: (state, data) => {
        state.alertIcon = data;
    },
}

const actions = {
    loginAction: async ({ dispatch, commit }, loginData) => {
        // console.log("loginData : ", loginData);
        const response = await requestLogin(loginData);
        // console.log("response : ", response);
        if (response == 404) {
          return 404;
        } else if (response == 401) {
          return 401
        }
        await commit("setToken", response.data.data.accessToken);
        localStorage.setItem('token', state.token)
        dispatch("getMeAction")
        // dispatch("getMeAction", response.data.data.accessToken)
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
    getMeAction: async (context) => {
        try {
            const response = await requestMe(state.token);
            console.log("getMe : ", response.data.data);
            await context.commit("setUser", response.data.data);
            return response.data.data
        } catch (err) {
            console.log(err);
        }
    },
    changeNicknameAction: async (context, nickname) => {
        try {
            const response = changeNickname(context.state.token, nickname)
            return response
        } catch (err) {
            console.log(err)
            throw err;
        }
    },
    changePasswordAction: async (context, payload) => {
          try {
            const params = { 
                oldPassword : payload.oldPassword,
                newPassword : payload.newPassword 
            }
            const res = await $axios.put("/api/member/password", 
            params, {headers: {Authorization: `Bearer ${context.state.token}`}})
            console.log(res);
            return res.data.code
        } catch(err) {
            return err.response.data.code
        }
        // .then(res => {
        //     console.log("res is", res);
        //     console.log("code = ", res.data.code)
        //     return res.data.code
        // })
        // .catch(error => {
        //     console.log("error = ", error)
        //     console.log("errorcode : ", error.response.data.code);
        //     return error.response.data.code
        // });
      

        
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