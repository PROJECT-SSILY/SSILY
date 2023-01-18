package com.example.erd.domain.player;

import com.example.erd.domain.BaseEntity;
import com.example.erd.domain.chat.ChatRoom;
import com.example.erd.domain.gameroom.GameRoom;
import com.example.erd.domain.member.Member;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Player extends BaseEntity {

    @Id @GeneratedValue
    @Column(name = "player_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="game_room_id")
    private GameRoom room;

    @Enumerated(EnumType.STRING)
    private Team team = Team.NONE;

    private boolean isPresenter;

    private int score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;
}