package io.openvidu.server.game;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class GameService {
    static final int GET_TEAMS_SETTING = 0;
    static final int GET_PRESENTER_SETTING =1;
    static final int GAME_START = 2;

    /**
     * 김윤미
     * 게임에 쓰이는 static 변수 추가
     */
    public static ConcurrentHashMap<String, ArrayList<String>> words=new ConcurrentHashMap<>();
    public static ConcurrentHashMap<String, ArrayList<Participant>> participants=new ConcurrentHashMap<>();


    // RPC 프로토콜을 위한 전역변수
    static RpcNotificationService rpcNotificationService;

    // log 찍기 위한 logger
    private static final Logger log = LoggerFactory.getLogger(GameService.class);

    public void gameNavigator(Participant participant, JsonObject message, Set<Participant> participants,
                              String sessionId, RpcNotificationService notice) {
        rpcNotificationService = notice;
        JsonObject params = new JsonObject();
        // data 파싱해서 다시 JSONOBJECT로 바꾸기.
        String dataString = message.get("data").toString();
        JsonObject data = (JsonObject) JsonParser.parseString(dataString);

        // data에 gameStatus로 게임 상태 분기
        int gameStatus = data.get("gameStatus").getAsInt();

        //타입은 game+gameStatus로 보내준다. 예시 : game2 or game3
        String type = message.get("type").getAsString();
        params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_TYPE_PARAM, type);

        switch (gameStatus) {
            case GET_TEAMS_SETTING: // 사용자들의 팀 정보값 얻기. 0번
//                getTeamsSetting(participant, sessionId, participants, params, data, notice);
                return;
            case GET_PRESENTER_SETTING: // 누가 설명자인지 얻기.
                return;
            case GAME_START:
                gameStart(participant, message, sessionId, participants, params, data, notice);
        }
    }

    /**
     * 김윤미
     * 게임 시작 처리
     * @param participant
     * @param message
     * @param sessionId
     * @param gameParticipants
     * @param params
     * @param data
     * @param notice
     */
    private void gameStart(Participant participant, JsonObject message, String sessionId, Set<Participant> gameParticipants,
                           JsonObject params, JsonObject data, RpcNotificationService notice) {
        //제시어 불러오기
        words.putIfAbsent(sessionId, new ArrayList<>());

        //참여자 목록 생성
        ArrayList<Participant> participantList=new ArrayList<>(gameParticipants);
        participants.putIfAbsent(sessionId, participantList);

        //설명자 부여

        //설명자 누구인지 알려주기
    }

    /**
     * 김윤미
     * @return : 제시어 12개 리스트
     */
    public List<String> pickWords() {
        String url="http://localhost:8080/api/game/words";
//        List<String> words=new ArrayList<>();
        httpGetConnection(url);

        return null;
    }

    public static void httpGetConnection(String urlData) {
        //http 통신을 하기위한 객체 선언 실시
        URL url = null;
        HttpURLConnection conn = null;

        //http 통신 요청 후 응답 받은 데이터를 담기 위한 변수
        JsonObject responseData = null;

        //메소드 호출 결과값을 반환하기 위한 변수
        String returnData = "";
        BufferedReader br=null;

        try {
            //파라미터로 들어온 url을 사용해 connection 실시
            url = new URL(urlData);
            conn = (HttpURLConnection) url.openConnection();

            //http 요청에 필요한 타입 정의 실시
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestMethod("GET");

            conn.setDoOutput(true);

            //http 요청 실시
            conn.connect();
            System.out.println("http 요청 방식 : "+"GET");
            System.out.println("http 요청 타입 : "+"application/json");
            System.out.println("http 요청 주소 : "+urlData);
            System.out.println("");

            StringBuffer sb = new StringBuffer();
            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            while(br.ready()) {
                sb.append(br.readLine());
            }

            returnData=sb.toString();

            //http 요청 응답 코드 확인 실시
            String responseCode = String.valueOf(conn.getResponseCode());
            System.out.println("http 응답 코드 : "+responseCode);
            System.out.println("http 응답 데이터 : "+returnData);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            //http 요청 및 응답 완료 후 BufferedReader를 닫아줍니다
            try {
                if (br != null) {
                    br.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
