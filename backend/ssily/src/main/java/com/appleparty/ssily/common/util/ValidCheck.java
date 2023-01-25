package com.appleparty.ssily.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidCheck {

    public static boolean isEmailValid(String email){
        boolean valid = false;
        String regex = "^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\\w+\\.)+\\w+$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(email);
        if(m.matches()) {
            valid = true;
        }
        return valid;
    }
}
