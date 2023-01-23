package com.appleparty.ssily.service;

import com.appleparty.ssily.common.util.ValidCheck;
import com.appleparty.ssily.exception.member.InvalidEmailException;
import com.appleparty.ssily.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    public boolean checkEmailDuplicate(String email){
        if(!ValidCheck.isEmailValid(email)){
            throw new InvalidEmailException();
        }
        return !memberRepository.existsByEmail(email);
    }

    public boolean checkNicknameDuplicate(String nickname){
        return !memberRepository.existsByNickname(nickname);
    }

}
