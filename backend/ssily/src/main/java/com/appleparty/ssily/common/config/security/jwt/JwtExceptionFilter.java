package com.appleparty.ssily.common.config.security.jwt;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtExceptionFilter extends OncePerRequestFilter {

    private final ResponseService responseService;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            filterChain.doFilter(request, response);  // go to "JwtAuthenticationFilter"
        } catch (JwtException e){
            setErrorResponse(HttpStatus.UNAUTHORIZED, response, e);
        }
    }

    public void setErrorResponse(HttpStatus status, HttpServletResponse res, Throwable e) throws IOException{
        res.setStatus(status.value());
        res.setContentType("application/json; charset=UTF-8");

        Result result = responseService.getFailureResult(-99, e.getMessage());
        res.getWriter().write(objectMapper.writeValueAsString(result));
    }

}
