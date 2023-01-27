package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.appleparty.ssily.common.result.SingleResult;
import com.appleparty.ssily.dto.member.request.FindPwRequestDto;
import com.appleparty.ssily.dto.member.request.JoinMemberRequestDto;
import com.appleparty.ssily.dto.member.request.UpdateNicknameRequestDto;
import com.appleparty.ssily.dto.member.response.GetMemberResponseDto;
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

    @PutMapping("/nickname")
    public Result updateNickname(@RequestBody UpdateNicknameRequestDto requestDto){
        memberService.updateNickname(requestDto);
        return responseService.getSuccessResult();
    }

    @PostMapping
    public Result join(@RequestBody JoinMemberRequestDto requestDto){
        memberService.join(requestDto);
        return responseService.getSuccessResult();
    }

    @GetMapping("/{member-id}")
    public SingleResult<GetMemberResponseDto> getMember(@PathVariable("member-id") long memberId) {
        return responseService.getSingleResult(memberService.getMember(memberId));
    }

    @GetMapping
    public SingleResult<GetMemberResponseDto> searchMyInfoByToken(){
        return responseService.getSingleResult(memberService.searchMyInfoByToken());
    }

    @PostMapping("/password")
    public Result findPw(@RequestBody FindPwRequestDto findPwRequestDto) {
        memberService.sendTempPwToEmail(findPwRequestDto);
        return responseService.getSuccessResult();
    }
}
