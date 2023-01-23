package com.appleparty.ssily.domain.member;

import lombok.*;

import javax.persistence.Embeddable;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Record {

    private int plays;

    private int wins;

    private int draws;
}
