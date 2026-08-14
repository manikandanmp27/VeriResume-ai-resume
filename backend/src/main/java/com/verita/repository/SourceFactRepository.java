package com.verita.repository;

import com.verita.entity.SourceFact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SourceFactRepository extends JpaRepository<SourceFact, String> {
    List<SourceFact> findByResumeIdOrderByCreatedAtAsc(String resumeId);
    Optional<SourceFact> findByIdAndResumeId(String id, String resumeId);
    void deleteByResumeId(String resumeId);
}
