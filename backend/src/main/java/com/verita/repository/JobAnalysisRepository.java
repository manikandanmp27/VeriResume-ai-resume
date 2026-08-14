package com.verita.repository;

import com.verita.entity.JobAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobAnalysisRepository extends JpaRepository<JobAnalysis, String> {
    List<JobAnalysis> findByResumeIdOrderByCreatedAtDesc(String resumeId);
    Optional<JobAnalysis> findTopByResumeIdOrderByCreatedAtDesc(String resumeId);
}
