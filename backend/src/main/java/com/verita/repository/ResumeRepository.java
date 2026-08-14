package com.verita.repository;

import com.verita.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, String> {
    List<Resume> findByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<Resume> findByIdAndUserId(String id, String userId);
    long countByUserId(String userId);
    List<Resume> findTop5ByUserIdOrderByUpdatedAtDesc(String userId);
}
