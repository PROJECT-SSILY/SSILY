import $axios from "axios";

const requestLogin = payload =>
$axios.post("/auth/login", payload).catch(error => {
if (error.response.status == 404) {
    alert("존재하지 않는 아이디입니다.");
}
if (error.response.status == 401) {
    alert("비밀번호를 확인하세요!");
}
return -100;
});

const requestRegister = payload => $axios.post("/users", payload);

const requestMe = async token => {
  console.log("getMeToken : ", token);
  const getME = await $axios.get("/users/me", {headers: {Authorization: `Bearer ${token}`}}).then(res => {
    return res.data;
  });
  return getME;
};

const requestId = userId => $axios.get(`/users/${userId}`).then(res => {
  return true;
}).catch(error => {
  return false;
});

export { requestLogin, requestRegister, requestId, requestMe };