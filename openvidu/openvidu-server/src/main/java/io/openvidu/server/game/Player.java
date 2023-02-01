package io.openvidu.server.game;

import io.openvidu.server.core.Participant;

// 게임 참가 플레이어
public class Player {

    // 게임에 참가하는 openvidu 참가자
    private Participant participant;

    // 누적 점수
    private int score = 0;

    // 팀 (개인전, 팀전)
    private Team team = Team.NONE;

    // 설명자 여부
    private boolean isPresenter = false;

    // 준비 상태
    private boolean isReady = false;

    // 방장 여부
    private boolean isHost = false;

    public Player(Participant participant) {
        this.participant = participant;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public boolean isPresenter() {
        return isPresenter;
    }

    public void setPresenter(boolean presenter) {
        isPresenter = presenter;
    }

    public boolean isReady() {
        return isReady;
    }

    public void setReady(boolean ready) {
        isReady = ready;
    }

    public boolean isHost() {
        return isHost;
    }

    public void setHost(boolean host) {
        isHost = host;
    }
}
