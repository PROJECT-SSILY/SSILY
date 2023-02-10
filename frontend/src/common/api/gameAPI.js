import $axios from "axios";
const OPENVIDU_SERVER_URL = "https://localhost:4443/openvidu";
// const OPENVIDU_SERVER_URL = "https://i8c104.p.ssafy.io:8443/openvidu";
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

const GetPlayerList = (mySessionId) => { // 중복 입장 처리용
    return $axios.get(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players`, {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    }).then((response) => response.data)
}

// 시그널로 변경됨
// const changeReady = (mySessionId, connectionId) => {
//     return $axios.put(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players/${connectionId}/ready`, JSON.stringify({"body" : "body"}), {
//         auth: {
//             username: 'OPENVIDUAPP',
//             password: OPENVIDU_SERVER_SECRET,
//         }
//     })
// }
/*
    나중에 팀전 할 때 사용
const changeTeam = (mySessionId, connectionId, color) => {
    return $axios.put(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/players/${connectionId}/team`,
    JSON.stringify({"team" : color}),{
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}
*/
// 유저 경험치 부여
const sendExp = (mySessionId, expData) => {
    return $axios.put(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/exp`, JSON.stringify({"players" : expData}), {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}

// 게임 종료시 각 참여자 점수 초기화
const resetExp = (mySessionId) => {
    return $axios.put(`${OPENVIDU_SERVER_URL}/api/rooms/${mySessionId}/reset`, JSON.stringify({"body" : "body"}), {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}

// 라운드 별 점수 누적
const sendScore = (playerId, score) => {
    return $axios.put(`${OPENVIDU_SERVER_URL}/api/players/${playerId}/score`, JSON.stringify({ "score" : score }), {
        auth: {
            username: 'OPENVIDUAPP',
            password: OPENVIDU_SERVER_SECRET,
        }
    })
}


export { roomList, GetPlayerList, randomTeam, randomPrivate, sendExp, resetExp, sendScore };

