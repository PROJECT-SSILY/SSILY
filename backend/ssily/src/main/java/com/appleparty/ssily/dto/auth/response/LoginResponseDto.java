package com.appleparty.ssily.dto.auth.response;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LoginResponseDto {

    private String accessToken;
}
