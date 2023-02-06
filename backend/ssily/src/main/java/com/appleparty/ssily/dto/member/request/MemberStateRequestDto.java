package com.appleparty.ssily.dto.member.request;

import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MemberStateRequestDto {

    private List<String> winner;

    private List<PlayerRequestDto> player;

}
