package com.appleparty.ssily.service;

import com.appleparty.ssily.domain.game.Word;
import com.appleparty.ssily.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameService {

    private final GameRepository gameRepository;

    public List<String> pickWords() {
        return gameRepository.findAll().stream()
                .map(Word::getName)
                .collect(Collectors.toList());
    }
}
