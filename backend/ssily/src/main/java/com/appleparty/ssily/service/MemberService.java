package com.appleparty.ssily.service;

import com.appleparty.ssily.common.util.MailUtil;
import com.appleparty.ssily.common.util.ValidCheck;
import com.appleparty.ssily.domain.member.Member;
import com.appleparty.ssily.dto.member.request.*;
import com.appleparty.ssily.dto.member.response.GetMemberResponseDto;
import com.appleparty.ssily.exception.member.*;
import com.appleparty.ssily.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
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
    public void updatePassword(UpdatePasswordRequestDto requestDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginMemberEmail=authentication.getName();
        Member member = memberRepository.findByEmail(loginMemberEmail).orElseThrow(MemberNotFoundException::new);

        if(!passwordEncoder.matches(requestDto.getOldPassword(), member.getPassword())){
            throw new WrongPasswordException();
        }
        member.updatePassword(passwordEncoder.encode(requestDto.getNewPassword()));
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

        String tempPw= MailUtil.makeRandomNumber(12);
        String encTempPw=passwordEncoder.encode(tempPw);
        Member member = memberRepository.findByEmail(findPwRequestDto.getEmail()).orElseThrow(MemberNotFoundException::new);

        if(!findPwRequestDto.getName().equals(member.getName())) {
            throw new MemberNotFoundException();
        }

        javaMailSender.send(MailUtil.setMailForFindPw(findPwRequestDto.getEmail(), tempPw));
        member.updatePassword(encTempPw);
    }

    @Transactional
    public void deleteMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Member member = memberRepository.findByEmail(authentication.getName()).orElseThrow(MemberNotFoundException::new);

        memberRepository.delete(member);
    }

    @Transactional
    public void updateMemberState(MemberStateRequestDto requestDto){
        List<PlayerRequestDto> player = requestDto.getPlayer();

        List<String> nickNames = player.stream()
                .map(PlayerRequestDto::getNickname)
                .collect(Collectors.toList());

        List<Member> players = memberRepository.findMembersByNicknames(nickNames);
        List<String> winner = requestDto.getWinner();

        for(int i = 0; i < players.size(); i++){
            Member member = players.get(i);
            boolean isWin = false;

            String nickname = member.getNickname();
            for(int j = 0; j < winner.size(); j++){
                if(winner.get(j).equals(nickname)){
                    isWin = true;
                    break;
                }
            }

            for(int j = 0; j < player.size(); j++){
                PlayerRequestDto playerRequestDto = player.get(j);
                if(playerRequestDto.getNickname().equals(nickname)){
                    member.updateState(playerRequestDto.getExtraExp(), playerRequestDto.getLevelUp(), isWin);
                    break;
                }
            }
        }

    }
}
