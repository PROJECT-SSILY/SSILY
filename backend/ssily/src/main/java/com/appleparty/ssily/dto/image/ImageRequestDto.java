package com.appleparty.ssily.dto.image;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ImageRequestDto {
    private String name;

    private String img;

}
