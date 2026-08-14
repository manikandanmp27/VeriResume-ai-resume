package com.verita.repository;

import com.verita.entity.ResumeVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeVersionRepository extends JpaRepository<ResumeVersion, String> {
    List<ResumeVersion> findByResumeIdOrderByVersionNumberDesc(String resumeId);
    Optional<ResumeVersion> findByIdAndResumeId(String id, String resumeId);
    Optional<ResumeVersion> findTopByResumeIdOrderByVersionNumberDesc(String resumeId);
    long countByResumeId(String resumeId);
}
