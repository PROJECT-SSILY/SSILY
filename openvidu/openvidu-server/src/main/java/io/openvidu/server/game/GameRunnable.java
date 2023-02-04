package io.openvidu.server.game;

import com.google.gson.JsonObject;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.ArrayList;

/**
 * 신대득
 * 세션에서
 * 자동적으로
 * 게임 이용자들에게 게임 정보를 전달하기 위한
 * 쓰레드
 */
public class GameRunnable implements Runnable{
    private ArrayList<Participant> participantsList;
    private RpcNotificationService rpcNotificationService;
    private String sessionId;

    public GameRunnable(String sessionId, ArrayList<Participant> participantsList, RpcNotificationService notice) {
        this.sessionId = sessionId;
        this.participantsList = participantsList;
        this.rpcNotificationService = notice;
    }

    @Override
    public void run() {
        try {
            JsonObject data = new JsonObject();
            JsonObject params = new JsonObject();

            //타입 지정
            String type = "signal:autoSystem";
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_TYPE_PARAM, type);
            Thread.sleep(30000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
