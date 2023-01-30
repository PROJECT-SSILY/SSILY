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
} // 이메일 중복 확인

// const requestMe = async token => {
//   console.log("getMeToken : ", token);
//   const getME = await $axios.get("/users/me", {headers: {Authorization: `Bearer ${token}`}}).then(res => {
//     return res.data;
//   });
//   return getME;
// };

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

// export { requestLogin, requestRegister, requestId, requestMe };
export { requestLogin, requestRegister, checkEmail, checkNickname, sendNewPwAction };