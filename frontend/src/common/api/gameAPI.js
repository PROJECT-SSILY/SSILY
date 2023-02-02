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
const roomList = () => {
    return $axios.get("/api/rooms", {
        headers: {
        username : "OPENVIDUAPP",
        password : "MY_SECRET"
        }
    })
    .then(res => {
        console.log(res.data.code)
        return res.data
    })
    .catch(error => {
        return error.response.data
    });
}
const joinRoomAction = () => {
    return $axios.get("/api/rooms/{room-id}")
    .then(res => {
        console.log(res.data.code)
        return res.data
    })
    .catch(error => {
        return error.response.data
    });
}

// export { requestLogin, requestRegister, requestId, requestMe };
export { makeRoomAction, joinRoomAction, roomList };