package com.appleparty.ssily.service;

import com.appleparty.ssily.common.config.security.jwt.JwtTokenProvider;
import com.appleparty.ssily.common.util.MailUtil;
import com.appleparty.ssily.common.util.ValidCheck;
import com.appleparty.ssily.domain.member.Member;
import com.appleparty.ssily.dto.auth.request.EmailRequestDto;
import com.appleparty.ssily.dto.auth.request.LoginRequestDto;
import com.appleparty.ssily.dto.auth.response.LoginResponseDto;
import com.appleparty.ssily.exception.member.DuplicateEmailException;
import com.appleparty.ssily.exception.member.InvalidEmailException;
import com.appleparty.ssily.exception.member.MemberNotFoundException;
import com.appleparty.ssily.exception.member.WrongPasswordException;
import com.appleparty.ssily.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.appleparty.ssily.domain.redis.RedisKey.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final RedisService redisService;
    private final JavaMailSender javaMailSender;

    public LoginResponseDto login(LoginRequestDto requestDto){
        Member member = memberRepository.findByEmail(requestDto.getEmail()).orElseThrow(MemberNotFoundException::new);

        if(!passwordEncoder.matches(requestDto.getPassword(), member.getPassword())){
            throw new WrongPasswordException();
        }

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtTokenProvider.createAccessToken(authentication);

        return LoginResponseDto.builder()
                .accessToken(accessToken)
                .build();
    }

    @Transactional
    public void sendAuthToEmail(EmailRequestDto requestDto){
        if(!ValidCheck.isEmailValid(requestDto.getEmail())){
            throw new InvalidEmailException();
        }

        if(memberRepository.existsByEmail(requestDto.getEmail())){
            throw new DuplicateEmailException();
        }

        String authNumber = MailUtil.makeRandomNumber(10);
        redisService.setDataWithExpiration(EMAIL_AUTH.getKey() + requestDto.getEmail(), authNumber, 60 * 5L);

        javaMailSender.send(MailUtil.setMailForAuth(requestDto.getEmail(), authNumber));
    }
}
