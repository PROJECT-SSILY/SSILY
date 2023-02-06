package io.openvidu.server.exception;

import java.util.HashMap;

public class ExceptionResponseBody {

    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public ExceptionResponseBody(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public HashMap<String, Object> toJson() {
        HashMap<String, Object> body = new HashMap<>();
        body.put("code", this.getCode());
        body.put("message", this.getMessage());
        return body;
    }
}
