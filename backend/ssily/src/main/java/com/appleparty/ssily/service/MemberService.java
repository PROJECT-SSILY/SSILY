package com.appleparty.ssily.service;

import com.appleparty.ssily.common.util.ValidCheck;
import com.appleparty.ssily.domain.member.Member;
import com.appleparty.ssily.dto.member.request.JoinMemberRequestDto;
import com.appleparty.ssily.exception.member.DuplicateEmailException;
import com.appleparty.ssily.exception.member.DuplicationNicknameException;
import com.appleparty.ssily.exception.member.InvalidEmailException;
import com.appleparty.ssily.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

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

}
