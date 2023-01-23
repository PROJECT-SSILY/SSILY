package com.appleparty.ssily.service;

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
        return !memberRepository.existsByEmail(email);
    }


}
