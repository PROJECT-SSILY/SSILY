package io.openvidu.server.game;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.config.PropertyConfig;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

public class GameService   {

    static final int SET_PRESENTER_SETTING = 0;
    static final int GET_PRESENTER_SETTING =1;
    static final int GAME_START = 2;

    /**
     * 김윤미
     * 게임에 쓰이는 static 변수 추가
     */
    public static ConcurrentHashMap<String, List<String>> words=new ConcurrentHashMap<>();
    public static ConcurrentHashMap<String, ArrayList<Participant>> participantList=new ConcurrentHashMap<>();
    public static ConcurrentHashMap<String, Integer> presenterIndex=new ConcurrentHashMap<>();
    public final List<String> allWords=allWords();


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
        params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_TYPE_PARAM, type); //params의 "type" 안에 저장

        switch (gameStatus) {
            case SET_PRESENTER_SETTING: // 사용자들의 팀 정보값 얻기. 0번
                setPresenterSetting(participant, message, sessionId, participants, params, data, notice);
                return;
            case GET_PRESENTER_SETTING: // 누가 설명자인지 얻기.
                getPresenterSetting(participant, message, sessionId, participants, params, data, notice);
                return;
            case GAME_START:
                gameStart(participant, message, sessionId, participants, params, data, notice);
        }
    }

    /**
     * 신대득
     * 설명자 변경 메서드
     * 처음시작이라면 0번 참가자가 설명자
     * @param participant
     * @param message
     * @param sessionId
     * @param gameParticipants
     * @param params
     * @param data
     * @param notice
     */
    public void setPresenterSetting(Participant participant, JsonObject message, String sessionId, Set<Participant> gameParticipants,
                                    JsonObject params, JsonObject data, RpcNotificationService notice){
        log.info("PrepareGame is called by {}", participant.getParticipantPublicId());

        ArrayList<Participant> curParticipantList = participantList.get(sessionId);
        String curPresenterId="";
        if(presenterIndex.get(sessionId)==null){
            presenterIndex.put(sessionId, 0);
            curParticipantList.get(0).getPlayer().setPresenter(true);
            curPresenterId=curParticipantList.get(0).getParticipantPrivateId();
        } else{
            int prePresenterIndex=presenterIndex.get(sessionId);
            int curPresenterIndex=(prePresenterIndex+1)%4;
            curParticipantList.get(prePresenterIndex).getPlayer().setPresenter(false);
            presenterIndex.put(sessionId, curPresenterIndex);
            curParticipantList.get(curPresenterIndex).getPlayer().setPresenter(true);
            curPresenterId=curParticipantList.get(0).getParticipantPrivateId();
        }
        data.addProperty("curPresenterId", curPresenterId);
        params.add("data", data);

        //방 참여자들에게 바뀐 데이터 보내주기.
        for (Participant p : gameParticipants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    public void getPresenterSetting(Participant participant, JsonObject message, String sessionId, Set<Participant> gameParticipants,
                                    JsonObject params, JsonObject data, RpcNotificationService notice){

    }


    /**
     * 김윤미
     * 게임 시작 처리
     * @param participant
     * @param message
     * @param sessionId
     * @param participants
     * @param params
     * @param data
     * @param notice
     */
    public void gameStart(Participant participant, JsonObject message, String sessionId, Set<Participant> participants,
                          JsonObject params, JsonObject data, RpcNotificationService notice) {

        //제시어 불러오기
        words.putIfAbsent(sessionId, new ArrayList<>());

        //참여자 목록 생성
        ArrayList<Participant> gameParticipants=new ArrayList<>(participants);
        participantList.putIfAbsent(sessionId, gameParticipants);

        //설명자 부여

        //설명자 누구인지 알려주기
    }

    /**
     * 김윤미
     * @return : 전체 단어 조회
     */
    private List<String> allWords() {
        URL url = null;
        HttpURLConnection conn = null;

        String returnData = "";
        BufferedReader br=null;

        List<String> wordList=null;

        try {
            String serverURL = PropertyConfig.getProperty("ssily.url");
            log.info("serverURL = {}", serverURL);
            url = new URL(serverURL+"/api/game/words");
            conn = (HttpURLConnection) url.openConnection();

            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestMethod("GET");

            conn.setDoOutput(true);

            conn.connect();

            StringBuffer sb = new StringBuffer();
            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            while(br.ready()) {
                sb.append(br.readLine());
            }

            returnData=sb.toString();

            JSONParser parser = new JSONParser();
            JSONObject returnJson = (JSONObject)parser.parse(returnData);
            wordList= (List<String>) returnJson.get("data");
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        } finally {
            try {
                if (br != null) {
                    br.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return wordList;
    }

    /**
     * 김윤미
     * 12개의 제시어 목록 반환
     * @return
     */
    private List<String> pickWords() {
        if(allWords==null) return null;

        List<String> pickedWords=new ArrayList<>();
        ThreadLocalRandom.current().ints(0, allWords.size()).distinct().limit(12).forEach(index -> pickedWords.add(allWords.get(index).toString()));
        return pickedWords;
    }


}
