package com.appleparty.ssily.dto.member.request;

import com.appleparty.ssily.domain.member.Member;
import com.appleparty.ssily.domain.member.Record;
import com.appleparty.ssily.domain.member.Role;
import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class JoinMemberRequestDto {

    @NotEmpty
    private String email;

    @NotEmpty
    private String password;

    @NotEmpty
    private String name;

    @NotEmpty
    private String nickname;

    public Member toEntity(String password){
        return Member.builder()
                .email(email)
                .password(password)
                .name(name)
                .nickname(nickname)
                .level(1)
                .exp(0)
                .record(
                        Record.builder()
                                .plays(0)
                                .wins(0)
                                .draws(0)
                                .build()
                )
                .role(Role.ROLE_MEMBER)
                .build();
    }
}
