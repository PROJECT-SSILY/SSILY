package com.appleparty.ssily.domain.image;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.sql.Blob;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Data
public class Image {

    @Id @GeneratedValue
    private Long id;

    private String name;

    @Lob
    private Blob img;

}
