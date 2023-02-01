package io.openvidu.server.game;

import com.google.gson.JsonObject;

/**
 * 서영탁
 * 게임 참가 플레이어
 */
public class Player {

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

    // 참여자 레벨
    private int level;
    
    // 참여자 닉네임
    private String nickname;
    
    // 참여자 승률
    private double rate;


    public Player() {
        this.score = 0;
        this.team = Team.NONE;
        this.isPresenter = false;
        this.isReady = false;
        this.isHost = false;
    }

    public Player(int level, String nickname, double rate) {
        this.score = 0;
        this.team = Team.NONE;
        this.isPresenter = false;
        this.isReady = false;
        this.isHost = false;
        this.level = level;
        this.nickname = nickname;
        this.rate = rate;
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

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public JsonObject toJson(){
        JsonObject json = new JsonObject();
        json.addProperty("score", this.getScore());
        json.addProperty("team", this.getTeam().toString());
        json.addProperty("isPresenter", this.isPresenter());
        json.addProperty("isReady", this.isReady());
        json.addProperty("isHost", this.isHost());
        json.addProperty("level", this.getLevel());
        json.addProperty("nickname", this.getNickname());
        json.addProperty("rate", this.getRate());
        return json;
    }
}
