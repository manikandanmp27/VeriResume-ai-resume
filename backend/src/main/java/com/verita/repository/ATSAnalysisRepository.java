package com.verita.repository;

import com.verita.entity.ATSAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ATSAnalysisRepository extends JpaRepository<ATSAnalysis, String> {
    List<ATSAnalysis> findByResumeIdOrderByCreatedAtDesc(String resumeId);
    Optional<ATSAnalysis> findTopByResumeIdOrderByCreatedAtDesc(String resumeId);
}
