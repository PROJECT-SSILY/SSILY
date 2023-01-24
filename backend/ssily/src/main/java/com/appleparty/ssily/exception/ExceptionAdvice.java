package com.appleparty.ssily.exception;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.exception.member.DuplicateEmailException;
import com.appleparty.ssily.exception.member.DuplicationNicknameException;
import com.appleparty.ssily.exception.member.InvalidEmailException;
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


}
