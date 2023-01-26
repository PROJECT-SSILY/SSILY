package com.appleparty.ssily.exception;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.exception.auth.WrongAuthNumberException;
import com.appleparty.ssily.exception.member.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionAdvice {

    private final ResponseService responseService;

    @ExceptionHandler(InvalidEmailException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result invalidEmailException(){
        return responseService.getFailureResult(-100, "올바르지 않은 이메일 형식입니다.");
    }

    @ExceptionHandler(DuplicateEmailException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result duplicateEmailException(){
        return responseService.getFailureResult(-101, "이미 존재하는 이메일입니다.");
    }

    @ExceptionHandler(DuplicationNicknameException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result duplicationNicknameException(){
        return responseService.getFailureResult(-102, "이미 존재하는 닉네임입니다.");
    }

    @ExceptionHandler(MemberNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Result memberNotFoundException(){
        return responseService.getFailureResult(-103, "해당 회원을 찾을 수 없습니다.");
    }

    @ExceptionHandler(WrongPasswordException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result wrongPasswordException(){
        return responseService.getFailureResult(-104, "비밀번호가 일치하지 않습니다.");
    }

    @ExceptionHandler(WrongAuthNumberException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result wrongAuthNumberException(){
        return responseService.getFailureResult(-105, "인증번호가 일치하지 않습니다.");
    }
    @ExceptionHandler(WrongEmailException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result WrongEmailException(){
        return responseService.getFailureResult(-200, "이메일이 일치하지 않습니다.");
    }

    @ExceptionHandler(WrongNameException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result wrongNameException(){
        return responseService.getFailureResult(-201, "이름이 일치하지 않습니다.");
    }

}
