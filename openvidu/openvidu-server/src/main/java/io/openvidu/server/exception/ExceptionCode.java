package io.openvidu.server.exception;

public class ExceptionCode {

    public static final int FULL_ROOM = -400;
    public static final String FULL_ROOM_MESSAGE = "이미 가득 찬 방입니다.";
    public static final int PLAYING_ROOM = -401;
    public static final String PLAYING_ROOM_MESSAGE = "이미 게임이 진행중인 방입니다.";

    public static final int NOT_TEAM_BATTLE = -402;
    public static final String NOT_TEAM_BATTLE_MESSAGE = "팀전이 아닙니다.";

    public static final int WRONG_PASSWORD = -403;
    public static final String WRONG_PASSWORD_MESSAGE = "비밀번호가 틀렸습니다.";

}
