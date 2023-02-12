import $axios from "axios";

const requestLogin = payload =>
$axios.post("/api/auth/login", payload).catch(error => {
return error.response.status
});

const requestRegister = payload => $axios.post("/api/member", payload); // 회원가입 요청


const checkEmail = (payload) => {
    console.log(payload)
    return $axios.get(`api/member/email?email=${payload}`)
} // 이메일 중복 확인

const checkNickname = (payload) => {
    const params = { nickname: payload }
    return $axios.get("api/member/nickname", { params })
} // 닉네임 중복 확인

const requestMe = (token) => {
//   console.log("getMeToken : ", token);
    return $axios.get("/api/member", {
        headers: {Authorization: `Bearer ${token}`}
    })
};

// const requestId = userId => $axios.get(`/users/${userId}`).then(res => {
//   return true;
// }).catch(error => {
//   return false;
// });

const sendNewPwAction = async (payload) => {
    try {
        const res = await $axios.post("/api/member/password", payload);
        console.log(res.data.code);
        return res.data.code;
    } catch (error) {
        return error.response.data.code;
    }
};

const changeNickname = (token, payload) => {
    console.log("뭐지?");
    console.log(token);
    console.log(payload);
    const params = { nickname: payload }
    $axios.put("/api/member/nickname", 
        params, {headers: {Authorization: `Bearer ${token}`}})
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error)
        return error.response.data.code
    });
}
const changePassword = (token, payload) => {
    console.log(token);
    console.log(payload);
    const params = { 
        oldPassword : payload.oldPassword,
        newPassword : payload.newPassword 
    }
    console.log(params);
    $axios.put("/api/member/password", 
        params, {headers: {Authorization: `Bearer ${token}`}})
    .then(res => {
        console.log("res is", res);
        console.log("code = ", res.data.code)
        return res.data.code
    })
    .catch(error => {
        console.log("error = ", error)
        console.log("code : ", error.response.data.code);
        return error.response.data.code
    });
}
const deleteAccount = (token) => {
    console.log(token);
    return $axios.delete("/api/member", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        console.log(res.data.code)
        return res.data.code
    })
    .catch(error => {
        return error.response.data.code
    });
}
// export { requestLogin, requestRegister, requestId, requestMe };
export { requestLogin, requestRegister, checkEmail, checkNickname, sendNewPwAction, requestMe, changeNickname, changePassword, deleteAccount };