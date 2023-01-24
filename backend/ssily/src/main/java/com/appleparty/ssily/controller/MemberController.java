package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.common.result.SingleResult;
import com.appleparty.ssily.dto.member.request.JoinMemberRequestDto;
import com.appleparty.ssily.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final ResponseService responseService;
    private final MemberService memberService;

    @GetMapping("/email")
    public SingleResult<Boolean> checkEmailDuplicate(@RequestParam("email") String email){
        return responseService.getSingleResult(memberService.checkEmailDuplicate(email));
    }

    @GetMapping("/nickname")
    public SingleResult<Boolean> checkNicknameDuplicate(@RequestParam("nickname") String nickname){
        return responseService.getSingleResult(memberService.checkNicknameDuplicate(nickname));
    }

    @PostMapping
    public Result join(@RequestBody JoinMemberRequestDto requestDto){
        memberService.join(requestDto);
        return responseService.getSuccessResult();
    }
}
