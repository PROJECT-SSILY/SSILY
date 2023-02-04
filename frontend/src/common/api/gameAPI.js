import $axios from "axios";
const OPENVIDU_SERVER_URL = "https://localhost:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

const roomList = () => {
    return $axios.get(`${OPENVIDU_SERVER_URL}/api/rooms`, {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}
const randomTeam = (payload) => {
    console.log(payload);
    return $axios.post(`${OPENVIDU_SERVER_URL}/api/rooms/random`, JSON.stringify(payload),
    {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
    .then(res => {
        console.log(res)
        return res.data
    })
    .catch(error => {
        return error.response.data
    });
}
const randomPrivate = (payload) => {
    console.log(payload);
    return $axios.post(`${OPENVIDU_SERVER_URL}/api/rooms/random`, JSON.stringify(payload),
    {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
    .then(res => {
        console.log(res)
        return res.data
    })
    .catch(error => {
        return error.response.data
    });
}

// export { requestLogin, requestRegister, requestId, requestMe };
export { roomList, randomTeam, randomPrivate };