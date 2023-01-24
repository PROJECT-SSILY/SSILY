package com.appleparty.ssily.common.config.security;

import com.appleparty.ssily.common.config.security.AccessDeniedHandler.JwtAccessDeniedHandler;
import com.appleparty.ssily.common.config.security.AuthenticationEntryPoint.JwtAuthenticationEntryPoint;
import com.appleparty.ssily.common.config.security.jwt.JwtExceptionFilter;
import com.appleparty.ssily.common.config.security.jwt.JwtSecurityConfig;
import com.appleparty.ssily.common.config.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtExceptionFilter jwtExceptionFilter;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers("/favicon.ico");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()

                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // 세션 사용 x

                .and()
                .authorizeRequests()
                .anyRequest().permitAll()

                .and()
                .apply(new JwtSecurityConfig(jwtTokenProvider, jwtExceptionFilter));
    }
}
