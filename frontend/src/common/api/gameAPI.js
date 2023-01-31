import $axios from "axios";


const makeRoomAction = (payload) => {
    return $axios.post("/api/rooms", payload)
    .then(res => {
        console.log(res.data.code)
        return res.data
    })
    .catch(error => {
        return error.response.data
    });
}

// export { requestLogin, requestRegister, requestId, requestMe };
export { makeRoomAction };