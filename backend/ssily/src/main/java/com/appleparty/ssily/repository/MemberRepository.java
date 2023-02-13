package com.appleparty.ssily.repository;

import com.appleparty.ssily.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<Member> findByEmail(String email);

    @Query("select m from Member m where m.nickname in :nicknames")
    List<Member> findMembersByNicknames(@Param("nicknames") List<String> nicknames);
}
