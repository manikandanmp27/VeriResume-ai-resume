package com.verita.repository;

import com.verita.entity.Claim;
import com.verita.entity.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, String> {
    List<Claim> findByResumeIdOrderByCreatedAtAsc(String resumeId);
    Optional<Claim> findByIdAndResumeId(String id, String resumeId);
    List<Claim> findByResumeIdAndStatus(String resumeId, ClaimStatus status);
    long countByResumeIdAndStatus(String resumeId, ClaimStatus status);
    long countByResumeId(String resumeId);
    void deleteByResumeId(String resumeId);
}
