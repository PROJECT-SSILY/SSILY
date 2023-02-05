import $axios from "axios";

const requestLogin = payload =>
$axios.post("/api/auth/login", payload).catch(error => {
if (error.response.status == 404) {
    alert("존재하지 않는 아이디입니다.");
}
if (error.response.status == 401) {
    alert("비밀번호를 확인하세요.");
}
return -100;
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

const sendNewPwAction = (payload) => {
    return $axios.post("/api/member/password", payload)
    .then(res => {
        console.log(res.data.code)
        return res.data.code
    })
    .catch(error => {
        return error.response.data.code
    });
}
const changeNickname = (token, payload) => {
    console.log("뭐지?");
    console.log(payload);
    const params = { nickname: payload }
    console.log(JSON.stringify(params));
    return $axios.put("/api/member/nickname", 
    JSON.stringify(params),
    {
        headers: {Authorization: `Bearer ${token}`}
    }).then(res =>{
        console.log(res.data.code);
    }
    )
    // .then(res => {
    //     console.log(res.data.code)
    //     return res.data.code
    // })
    .catch(error => {
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
export { requestLogin, requestRegister, checkEmail, checkNickname, sendNewPwAction, requestMe, changeNickname, deleteAccount };