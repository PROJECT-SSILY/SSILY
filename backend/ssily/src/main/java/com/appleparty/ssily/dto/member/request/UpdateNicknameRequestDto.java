package com.appleparty.ssily.dto.member.request;

import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UpdateNicknameRequestDto {
    @NotEmpty
    String nickname;
}
