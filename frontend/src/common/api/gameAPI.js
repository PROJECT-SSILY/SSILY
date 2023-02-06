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

const GetPlayerList = (mySessionId) => {
    return $axios.get(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players`, {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}

const changeReady = (mySessionId, connectionId) => {
    return $axios.put(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players/${connectionId}/ready`, JSON.stringify({"body" : "body"}), {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}

// 개인전만 진행하므로 잠시 보류
// const changeTeam = (mySessionId, connectionId, color) => {
//     return $axios.put(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players/${connectionId}/team`, 
//     JSON.stringify({"team" : color}),{
//         auth: {
//             username: 'OPENVIDUAPP',
//             password: OPENVIDU_SERVER_SECRET,
//         }
//     })
// }



export { roomList, GetPlayerList, randomTeam, randomPrivate, changeReady };

