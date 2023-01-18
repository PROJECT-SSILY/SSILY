package com.example.erd.domain.chat;

import com.example.erd.domain.BaseEntity;
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
public class ChatRoom extends BaseEntity {

    @Id @GeneratedValue
    @Column(name = "chat_room_id")
    private Long id;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<Player> players = new ArrayList<>();


}
