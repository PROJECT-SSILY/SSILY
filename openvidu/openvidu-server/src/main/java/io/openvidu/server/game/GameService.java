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
import org.springframework.security.core.parameters.P;

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

    static final int GET_TEAMS_SETTING = 0;
    static final int GET_PRESENTER_SETTING =1;
    static final int GAME_START = 2;

    //Tread 관리
    public static ConcurrentHashMap<String, Thread> gameThread = new ConcurrentHashMap<>();

    /**
     * 김윤미
     * 게임에 쓰이는 static 변수 추가
     */
    public static ConcurrentHashMap<String, List<String>> words=new ConcurrentHashMap<>();
    public static ConcurrentHashMap<String, ArrayList<Participant>> participantList =new ConcurrentHashMap<>();
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


    /**
     * 서영탁
     * 라운드 종료
     */
    private void finishRound(Participant participant, String sessionId, Set<Participant> participants, JsonObject params, JsonObject data){

        log.info("finishRound is called by [{}, nickname : [{}]]", participant.getParticipantPublicId(), participant.getPlayer().getNickname());

        // 점수 증가
        Player winner = participant.getPlayer();
        winner.setScore(winner.getScore()+1);

        int cnt = 0;
        for (Participant p : participants) {
            JsonObject player = new JsonObject();
            player.addProperty("connectionId", p.getParticipantPublicId());
            player.addProperty("score", p.getPlayer().getScore());
            data.add(String.valueOf(cnt), player);
            cnt++;
        }

        data.addProperty("cnt", cnt);
        data.addProperty("winnerId", participant.getParticipantPublicId());
        data.addProperty("winnerNickname", winner.getNickname());
        params.add("data", data);

        // 라운드 종료 알라기
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     * 서영탁
     * 게임 종료
     */
    private void finishGame(Participant participant, String sessionId, Set<Participant> participants, JsonObject params, JsonObject data){

        log.info("finishGame is called by {}", participant.getParticipantPublicId());

        ArrayList<Participant> winner = new ArrayList<>();
        int max = 0;

        // 우승자 첮가
        for (Participant p : participants) {
            int score = p.getPlayer().getScore();
            if(score >= max){
                if(score > max) {
                    winner = new ArrayList<>();
                    max = score;
                }
                winner.add(p);
            }
        }

        // 우승자 정보 json
        JsonObject winnerJson = new JsonObject();
        int winnerCnt = 0;
        for (Participant p : winner) {
            JsonObject player = new JsonObject();
            player.addProperty("connectionId", p.getParticipantPublicId());
            player.addProperty("nickname", p.getPlayer().getNickname());
            winnerJson.add(String.valueOf(winnerCnt), player);
        }

        data.add("winner", winnerJson);
        data.addProperty("winnerCnt", winnerCnt);

        // 경험치 추가
        // TODO : 백엔드 전송
        JsonObject gameResult = new JsonObject();
        int cnt = 0;
        for (Participant p : participants) {
            int extraExp = calcExp(p, winner);
            p.getPlayer().addExp(extraExp);
            boolean levelUp = isLevelUp(p);

            JsonObject player = new JsonObject();
            player.addProperty("connectionId", p.getParticipantPublicId());
            player.addProperty("extraExp", extraExp);
            player.addProperty("levelUp", levelUp);
            gameResult.add(String.valueOf(cnt), player);
        }

        // 게임 결과
        data.add("gameResult", gameResult);


        Thread ssilyThread = gameThread.get(sessionId);


        // TODO : 모든 자원 반납



        if(ssilyThread != null){
            ssilyThread.interrupt();
        }


        params.add("data", data);

        //게임 종료 알리기
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    }

    /**
     * 서영탁
     * 게임 결과에 따른 exp 설정
     */
    private int calcExp(Participant participant, ArrayList<Participant> winner){
        boolean isWinner = false;

        for (Participant p : winner) {
            if(p.getParticipantPublicId().equals(participant.getParticipantPublicId())){
                isWinner = true;
                break;
            }
        }

        if(isWinner) return participant.getPlayer().getScore()+20;
        else return participant.getPlayer().getScore();
    }

    /**
     * 서영탁
     * 레벨업 유무 확인
     * TODO : 레벨에 필요 경험치 증가량 수정
     */
    private boolean isLevelUp(Participant participant){
        Player player = participant.getPlayer();
        int level = player.getLevel();

        int needExp = 100 * level;

        if(player.getExp() >= needExp){
            return true;
        }
        return false;
    }

}
