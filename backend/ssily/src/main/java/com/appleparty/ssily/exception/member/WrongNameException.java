package com.appleparty.ssily.exception.member;

public class WrongNameException extends RuntimeException{
    public WrongNameException() {
    }

    public WrongNameException(String message) {
        super(message);
    }

    public WrongNameException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongNameException(Throwable cause) {
        super(cause);
    }

    public WrongNameException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
