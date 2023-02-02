package com.appleparty.ssily.domain.game;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Word {
    @Id
    @GeneratedValue
    @Column(name = "word_id")
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
}
