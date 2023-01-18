package com.example.erd.domain.gameroom;

import com.example.erd.domain.BaseEntity;
import com.example.erd.domain.member.Member;
import com.example.erd.domain.player.Player;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GameRoom extends BaseEntity {
    @Id @GeneratedValue
    @Column(name="game_room_id")
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private boolean isSecret;

    @Column(length = 4)
    private String password;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="host_id")
    private Member host;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Player> players = new ArrayList<>();

}
