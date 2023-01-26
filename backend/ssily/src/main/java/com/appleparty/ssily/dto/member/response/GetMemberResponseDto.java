package com.appleparty.ssily.dto.member.response;

import com.appleparty.ssily.domain.member.Record;
import lombok.*;

import javax.persistence.Embedded;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GetMemberResponseDto {
    private String email;
    private String name;
    private String nickname;
    private int level;
    private long exp;
    private Record record;

}
