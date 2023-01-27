package com.appleparty.ssily.domain.member;

import com.appleparty.ssily.domain.BaseEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member extends BaseEntity {

    @Id @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String nickname;

    private int level;

    private long exp;

    @Embedded
    private Record record;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_MEMBER;

    public Member updateNickname(String nickname){
        this.nickname = nickname;
        return this;
    }

    public Member updatePassword(String password){
        this.password = password;
        return this;
    }
}
