package com.appleparty.ssily.exception.member;

public class DuplicateEmailException extends RuntimeException{
    public DuplicateEmailException() {
    }

    public DuplicateEmailException(String message) {
        super(message);
    }

    public DuplicateEmailException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicateEmailException(Throwable cause) {
        super(cause);
    }

    public DuplicateEmailException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
