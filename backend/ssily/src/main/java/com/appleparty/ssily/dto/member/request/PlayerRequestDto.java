package com.appleparty.ssily.dto.member.request;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PlayerRequestDto {

    private String nickname;
    private int extraExp;
    private boolean levelUp;

    public boolean getLevelUp() {
        return levelUp;
    }
}
