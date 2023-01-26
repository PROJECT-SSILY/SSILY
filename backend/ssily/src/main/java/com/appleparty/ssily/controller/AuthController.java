package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.common.result.SingleResult;
import com.appleparty.ssily.dto.auth.request.EmailRequestDto;
import com.appleparty.ssily.dto.auth.request.LoginRequestDto;
import com.appleparty.ssily.dto.auth.response.LoginResponseDto;
import com.appleparty.ssily.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ResponseService responseService;
    private final AuthService authService;

    @PostMapping("/login")
    public SingleResult<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto){
        LoginResponseDto responseDto = authService.login(requestDto);
        return responseService.getSingleResult(responseDto);
    }

    @PostMapping("/email")
    public Result sendAuthToEmail(@RequestBody EmailRequestDto requestDto){
        authService.sendAuthToEmail(requestDto);
        return responseService.getSuccessResult();
    }

    @GetMapping("/email")
    public Result verifyAuthNumber(@RequestParam("email") String email, @RequestParam("authNumber") String authNumber){
        authService.verifyAuthNumber(email, authNumber);
        return responseService.getSuccessResult();
    }
}
