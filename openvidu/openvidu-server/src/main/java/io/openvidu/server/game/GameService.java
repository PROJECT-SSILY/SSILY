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

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

public class GameService   {

    static final int SET_PRESENTER_SETTING = 0;
    static final int GET_PRESENTER_SETTING =1;
    static final int GAME_START = 2;
    static final int GET_READY_STATE = 3;

    //Tread 관리
    public static ConcurrentHashMap<String, Thread> gameThread = new ConcurrentHashMap<>();

    // 게임 라운드 관리
    public static ConcurrentHashMap<String, Integer> round = new ConcurrentHashMap<>();

    // 참여자들 Ready 상태 현황
    public static ConcurrentHashMap<String, HashMap<String, Boolean>> readyState = new ConcurrentHashMap<>();

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
                return;
            case GET_READY_STATE:
                getReadyState(participant, sessionId, participants, params, data);
                return;
        }
    }

    /**
     * 서영탁
     * 게임 접속 시 참여자들의 Ready 상태를 알려줌
     */
    public void getReadyState(Participant participant, String sessionId, Set<Participant> participants, JsonObject params, JsonObject data){
        // 해당 방에서 관리되는게 없으면 빈 map 생성
        readyState.putIfAbsent(sessionId, new HashMap<>());

        // 이전에 관리되고 있던 세션별 레디 상태
        HashMap<String, Boolean> preReadyState = readyState.get(sessionId);
        HashMap<String, Boolean> nowReadyState = new HashMap<>();

        // 현재 방에 있지 않는 참여자 제외
        for (Participant p : participants) {
            String id = p.getParticipantPublicId();
            nowReadyState.put(id, preReadyState.getOrDefault(id, false));
        }

        readyState.computeIfPresent(sessionId, (k, v) -> v = nowReadyState);

        for (String id : nowReadyState.keySet()) {
            data.addProperty(id, nowReadyState.get(id));
        }

        params.add("data", data);

        rpcNotificationService.sendNotification(participant.getParticipantPrivateId(),
                ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
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
//        words.putIfAbsent(sessionId, new ArrayList<>());
        words.put(sessionId, pickWords());

        // 라운드 설정 : (1라운드)
        round.put(sessionId, 1);

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
     * 답안 제출
     */
    private void submitAnswer(Participant participant, String sessionId, Set<Participant> participants, JsonObject params, JsonObject data, String playerAnswer){

        log.info("submitAnswer is called by {}", participant.getParticipantPublicId());

        Integer nowRound = round.get(sessionId);
        String answer = words.get(sessionId).get(nowRound);

        // 플레이어가 제출한 답안이 정답이라면
        if(answer.equals(playerAnswer)){
            data.addProperty("answer", answer);
            data.addProperty("winnerId", participant.getParticipantPublicId());
            data.addProperty("winnerNickname", participant.getPlayer().getNickname());

            params.add("data", data);

            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
            }
        }
    }


    /**
     * 서영탁
     * 라운드 종료
     */
    private void finishRound(Participant participant, String sessionId, Set<Participant> participants, JsonObject params, JsonObject data){

        log.info("finishRound is called by [{}, nickname : [{}]]", participant.getParticipantPublicId(), participant.getPlayer().getNickname());

        // 점수 증가
        Player winner = participant.getPlayer();
        winner.setScore(winner.getScore() + 2);

        int cnt = 0;
        JsonObject playerJson = new JsonObject();
        for (Participant p : participants) {
            JsonObject player = new JsonObject();
            player.addProperty("connectionId", p.getParticipantPublicId());
            player.addProperty("score", p.getPlayer().getScore());
            playerJson.add(String.valueOf(cnt), player);
            cnt++;
        }
        data.add("player", playerJson);

        data.addProperty("cnt", cnt);
        data.addProperty("winnerId", participant.getParticipantPublicId());
        data.addProperty("winnerNickname", winner.getNickname());
        params.add("data", data);

        // 라운드 증가
        Integer nowRound = round.get(sessionId);
        round.put(sessionId, nowRound+1);

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
            p.getPlayer().initPlayerState();  // 상태 초기화 (다시 대기방으로 돌아가기 위해)
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
        ArrayList<String> winnerNicknames = new ArrayList<>();
        int winnerCnt = 0;
        for (Participant p : winner) {
            JsonObject player = new JsonObject();
            player.addProperty("connectionId", p.getParticipantPublicId());
            player.addProperty("nickname", p.getPlayer().getNickname());
            winnerJson.add(String.valueOf(winnerCnt), player);

            winnerNicknames.add(p.getPlayer().getNickname());
        }

        data.add("winner", winnerJson);
        data.addProperty("winnerCnt", winnerCnt);

        // 경험치 추가
        JsonObject gameResult = new JsonObject();
        ArrayList<JsonObject> playerList = new ArrayList<>();
        int cnt = 0;
        for (Participant p : participants) {
            int extraExp = calcExp(p, winner);
            p.getPlayer().addExp(extraExp);
            boolean levelUp = isLevelUp(p);

            JsonObject player = new JsonObject();
            player.addProperty("connectionId", p.getParticipantPublicId());
            player.addProperty("extraExp", extraExp);
            player.addProperty("levelUp", levelUp);
            player.addProperty("nickname", p.getPlayer().getNickname());

            gameResult.add(String.valueOf(cnt), player);
            playerList.add(player);
        }

        // 백엔드 전송
        updateMemberState(winnerNicknames, playerList);


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

    /**
     * 서영탁
     * 게임 결과 백엔드 DB에 반영
     */
    private void updateMemberState(ArrayList<String> winnerNicknames, ArrayList<JsonObject> playerList){
        BufferedWriter bw = null;

        try{
            String serverURL = PropertyConfig.getProperty("ssily.url");
            URL url = new URL(serverURL+"/api/member/state");

            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("POST"); // http 메서드
            conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setDoInput(true); // 서버에 전달할 값이 있다면 true
            conn.setDoOutput(false); // 서버로부터 받는 값이 있다면 true

            JSONObject requestBody = new JSONObject();
            requestBody.put("winner", winnerNicknames);
            requestBody.put("player", playerList);

            bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
            bw.write(requestBody.toJSONString()); // 버퍼에 담기
            bw.flush(); // 버퍼에 담긴 데이터 전달
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try{
                if(bw != null) bw.close();
            } catch (Exception e){
                e.printStackTrace();
            }
        }

    }

}
