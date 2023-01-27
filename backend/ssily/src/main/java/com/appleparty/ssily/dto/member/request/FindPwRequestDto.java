package com.appleparty.ssily.dto.member.request;

import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FindPwRequestDto {
    @NotEmpty
    private String email;
    @NotEmpty
    private String name;
}
