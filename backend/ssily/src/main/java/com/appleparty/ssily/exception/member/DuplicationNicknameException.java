package com.appleparty.ssily.exception.member;

public class DuplicationNicknameException extends RuntimeException{
    public DuplicationNicknameException() {
    }

    public DuplicationNicknameException(String message) {
        super(message);
    }

    public DuplicationNicknameException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicationNicknameException(Throwable cause) {
        super(cause);
    }

    public DuplicationNicknameException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
