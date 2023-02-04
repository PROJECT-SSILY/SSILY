package com.appleparty.ssily.controller;

import com.appleparty.ssily.common.response.ResponseService;
import com.appleparty.ssily.common.result.ListResult;
import com.appleparty.ssily.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final ResponseService responseService;

    @GetMapping("/words")
    public ListResult pickWords(){
        List<String> words=gameService.pickWords();
        return responseService.getListResult(words);
    }
}
