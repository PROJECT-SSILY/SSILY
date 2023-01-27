package com.appleparty.ssily.service;

import com.appleparty.ssily.common.util.MailUtil;
import com.appleparty.ssily.common.util.ValidCheck;
import com.appleparty.ssily.domain.member.Member;
import com.appleparty.ssily.dto.member.request.FindPwRequestDto;
import com.appleparty.ssily.dto.member.request.JoinMemberRequestDto;
import com.appleparty.ssily.dto.member.request.UpdateNicknameRequestDto;
import com.appleparty.ssily.dto.member.response.GetMemberResponseDto;
import com.appleparty.ssily.exception.member.*;
import com.appleparty.ssily.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;

    public boolean checkEmailDuplicate(String email){
        if(!ValidCheck.isEmailValid(email)){
            throw new InvalidEmailException();
        }
        return !memberRepository.existsByEmail(email);
    }

    public boolean checkNicknameDuplicate(String nickname){
        return !memberRepository.existsByNickname(nickname);
    }

    @Transactional
    public void updateNickname(UpdateNicknameRequestDto requestDto){
        if(!this.checkNicknameDuplicate(requestDto.getNickname())){
            throw new DuplicationNicknameException();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginMemberEmail = authentication.getName();
        Member member = memberRepository.findByEmail(loginMemberEmail).orElseThrow(MemberNotFoundException::new);
        member.updateNickname(requestDto.getNickname());
    }

    @Transactional
    public void join(JoinMemberRequestDto requestDto){
        boolean isPossibleEmail = this.checkEmailDuplicate(requestDto.getEmail());
        if(!isPossibleEmail){
            throw new DuplicateEmailException();
        }

        boolean isPossibleNickname = this.checkNicknameDuplicate(requestDto.getNickname());
        if(!isPossibleNickname){
            throw new DuplicationNicknameException();
        }

        Member member = requestDto.toEntity(passwordEncoder.encode(requestDto.getPassword()));
        memberRepository.save(member);
    }

    public GetMemberResponseDto getMember(long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
        return GetMemberResponseDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .nickname(member.getNickname())
                .level(member.getLevel())
                .exp(member.getExp())
                .record(member.getRecord())
                .build();
    }

    public GetMemberResponseDto searchMyInfoByToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Member member = memberRepository.findByEmail(authentication.getName()).orElseThrow(MemberNotFoundException::new);

        return GetMemberResponseDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .nickname(member.getNickname())
                .level(member.getLevel())
                .exp(member.getExp())
                .record(member.getRecord())
                .build();
    }

    @Transactional
    public void sendTempPwToEmail(FindPwRequestDto findPwRequestDto) {
        if(!ValidCheck.isEmailValid(findPwRequestDto.getEmail())) {
            throw new InvalidEmailException();
        }
        System.out.println(findPwRequestDto.getEmail()+"이메일!!");
        String tempPw= MailUtil.makeRandomNumber(12);
        String encTempPw=passwordEncoder.encode(tempPw);
        Member member = memberRepository.findByEmail(findPwRequestDto.getEmail()).orElseThrow(MemberNotFoundException::new);

        if(!findPwRequestDto.getName().equals(member.getName())) {
            throw new MemberNotFoundException();
        }

        javaMailSender.send(MailUtil.setMailForFindPw(findPwRequestDto.getEmail(), tempPw));
        member.updatePassword(encTempPw);
    }

}
