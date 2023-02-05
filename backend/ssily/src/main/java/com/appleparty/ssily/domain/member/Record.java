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

    public Record updateRecord(boolean isWin){
        this.plays += 1;
        if(isWin) this.wins += 1;
        else this.draws += 1;
        return this;
    }
}
