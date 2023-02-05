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

const GetPlayerList = (mySessionId) => {
    return $axios.get(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players`, {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}


// export { requestLogin, requestRegister, requestId, requestMe };
export { roomList, GetPlayerList };