// import {
//     requestLogin,
//     requestRegister,
//     requestMe,
//     requestId,
//   } from "../common/api/accountAPI";

import { requestRegister } from "@/common/api/accountAPI";

const state = {
    API_URL: "http://localhost:8080",
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
        // console.log("loginACTINO", token);
    },
    setUser: (state, data) => {
        state.user = data;
    },
    setCheckId: (state, checkId) => {
        state.checkId = checkId;
    },
}

const actions = {
    // loginAction: async ({ commit }, loginData) => {
    //     console.log(loginData, "------------");
    //     const response = await requestLogin(loginData);
    //     console.log("response = ", response);
    //     if (response == -100) {
    //       return -100;
    //     }
    //     await commit("setToken", response.data.accessToken);
    // },
    // logoutAction: async ({ commit }) => {
    //     commit("setToken", null);
    // },
    // mountAction: async ({ commit }) => {
    //     const local = await localStorage.getItem("token");
    //     commit("setToken", local);
    // },
    registerAction: async (commit, registerData) => {
        try {
          const response = await requestRegister(registerData)
          console.log(response);
        } catch (err) {
          console.log(err);
          throw err;
        }
      },

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