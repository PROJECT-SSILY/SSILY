package com.appleparty.ssily.dto.auth.request;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmailRequestDto {
    private String email;
}
