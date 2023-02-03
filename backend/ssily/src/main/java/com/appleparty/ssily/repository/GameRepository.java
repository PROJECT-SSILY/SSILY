package com.appleparty.ssily.repository;

import com.appleparty.ssily.domain.game.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface GameRepository extends JpaRepository<Word, Long> {
    ArrayList<Word> findAll();
}
