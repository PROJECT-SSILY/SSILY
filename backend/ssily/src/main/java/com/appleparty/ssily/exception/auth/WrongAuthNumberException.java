package com.appleparty.ssily.exception.auth;

public class WrongAuthNumberException extends RuntimeException{
    public WrongAuthNumberException() {
    }

    public WrongAuthNumberException(String message) {
        super(message);
    }

    public WrongAuthNumberException(String message, Throwable cause) {
        super(message, cause);
    }

    public WrongAuthNumberException(Throwable cause) {
        super(cause);
    }

    public WrongAuthNumberException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
