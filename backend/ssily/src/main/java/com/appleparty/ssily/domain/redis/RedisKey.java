package com.appleparty.ssily.domain.redis;

import lombok.Getter;

@Getter
public enum RedisKey {
    EMAIL_AUTH("EMAIL_AUTH_");

    private String key;

    RedisKey(String key){
        this.key = key;
    }
}
