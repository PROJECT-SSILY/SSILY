package com.appleparty.ssily.common.config.security.member;

import com.appleparty.ssily.domain.member.Member;
import com.appleparty.ssily.exception.member.MemberNotFoundException;
import com.appleparty.ssily.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(username).orElseThrow(MemberNotFoundException::new);

        return MemberDetails.builder()
                .id(member.getId())
                .email(member.getEmail())
                .password(member.getPassword())
                .role(member.getRole())
                .build();
    }
}
