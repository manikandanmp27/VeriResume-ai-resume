package com.verita.service;

import com.verita.dto.claim.ClaimDto;
import com.verita.dto.claim.FactLockOverviewDto;
import com.verita.dto.claim.UpdateClaimRequest;
import com.verita.dto.content.*;
import com.verita.dto.fact.SourceFactDto;
import com.verita.entity.Claim;
import com.verita.entity.Resume;
import com.verita.entity.SourceFact;
import com.verita.entity.enums.ClaimStatus;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.ClaimRepository;
import com.verita.repository.ResumeRepository;
import com.verita.repository.SourceFactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FactLockService {

    private final ClaimRepository claimRepository;
    private final ResumeRepository resumeRepository;
    private final SourceFactRepository sourceFactRepository;
    private final SourceFactService sourceFactService;

    @Transactional(readOnly = true)
    public FactLockOverviewDto getClaimsOverview(String resumeId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        List<Claim> claims = claimRepository.findByResumeIdOrderByCreatedAtAsc(resumeId);

        long total = claims.size();
        long verified = claims.stream().filter(c -> c.getStatus() == ClaimStatus.VERIFIED).count();
        long userConfirmed = claims.stream().filter(c -> c.getStatus() == ClaimStatus.USER_CONFIRMED).count();
        long unverified = claims.stream().filter(c -> c.getStatus() == ClaimStatus.UNVERIFIED).count();
        long rejected = claims.stream().filter(c -> c.getStatus() == ClaimStatus.REJECTED).count();

        double percentage = total > 0 ? ((double) (verified + userConfirmed) / total) * 100.0 : 100.0;

        List<ClaimDto> claimDtos = claims.stream().map(this::mapToDto).collect(Collectors.toList());

        return FactLockOverviewDto.builder()
                .resumeId(resumeId)
                .totalClaims(total)
                .verifiedCount(verified)
                .userConfirmedCount(userConfirmed)
                .unverifiedCount(unverified)
                .rejectedCount(rejected)
                .verificationPercentage(Math.round(percentage * 10.0) / 10.0)
                .claims(claimDtos)
                .build();
    }

    @Transactional(readOnly = true)
    public ClaimDto getClaim(String resumeId, String claimId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        Claim claim = claimRepository.findByIdAndResumeId(claimId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimId));
        return mapToDto(claim);
    }

    @Transactional
    public ClaimDto verifyClaim(String resumeId, String claimId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        Claim claim = claimRepository.findByIdAndResumeId(claimId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimId));

        claim.setStatus(ClaimStatus.USER_CONFIRMED);
        claim.setJustification("Confirmed and approved by user");
        Claim saved = claimRepository.save(claim);
        return mapToDto(saved);
    }

    @Transactional
    public ClaimDto rejectClaim(String resumeId, String claimId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        Claim claim = claimRepository.findByIdAndResumeId(claimId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimId));

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setJustification("Rejected by user during Fact Lock review");
        Claim saved = claimRepository.save(claim);
        return mapToDto(saved);
    }

    @Transactional
    public ClaimDto updateClaim(String resumeId, String claimId, String userId, UpdateClaimRequest request) {
        verifyResumeOwnership(resumeId, userId);
        Claim claim = claimRepository.findByIdAndResumeId(claimId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found: " + claimId));

        if (request.getClaimText() != null && !request.getClaimText().isBlank()) {
            claim.setClaimText(request.getClaimText().trim());
        }
        if (request.getStatus() != null) {
            claim.setStatus(request.getStatus());
        }
        if (request.getJustification() != null) {
            claim.setJustification(request.getJustification().trim());
        }
        if (request.getSupportingFactIds() != null) {
            List<SourceFact> facts = sourceFactRepository.findAllById(request.getSupportingFactIds());
            claim.setSupportingFacts(facts);
        }

        Claim saved = claimRepository.save(claim);
        return mapToDto(saved);
    }

    @Transactional
    public List<Claim> extractAndVerifyClaims(Resume resume, String versionId, ResumeContentDto content) {
        // Clear previous claims if regenerating for current version or build fresh
        List<SourceFact> sourceFacts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resume.getId());
        List<Claim> newClaims = new ArrayList<>();

        // Summary claims
        if (content.getPersonalInfo() != null && content.getPersonalInfo().getProfessionalSummary() != null) {
            String summary = content.getPersonalInfo().getProfessionalSummary().trim();
            if (!summary.isBlank()) {
                newClaims.addAll(evaluateClaimsForText(resume, versionId, summary, "Summary", sourceFacts));
            }
        }

        // Project bullet points and claims
        if (content.getProjects() != null) {
            for (ProjectDto project : content.getProjects()) {
                String sectionName = "Project: " + (project.getTitle() != null ? project.getTitle() : "Project");
                if (project.getBulletPoints() != null) {
                    for (String bullet : project.getBulletPoints()) {
                        if (bullet != null && !bullet.isBlank()) {
                            newClaims.addAll(evaluateClaimsForText(resume, versionId, bullet, sectionName, sourceFacts));
                        }
                    }
                }
            }
        }

        // Experience bullet points and claims
        if (content.getExperience() != null) {
            for (ExperienceDto exp : content.getExperience()) {
                String sectionName = "Experience: " + (exp.getCompany() != null ? exp.getCompany() : "Experience");
                if (exp.getBulletPoints() != null) {
                    for (String bullet : exp.getBulletPoints()) {
                        if (bullet != null && !bullet.isBlank()) {
                            newClaims.addAll(evaluateClaimsForText(resume, versionId, bullet, sectionName, sourceFacts));
                        }
                    }
                }
            }
        }

        // Skills claims
        if (content.getSkills() != null) {
            for (SkillCategoryDto cat : content.getSkills()) {
                if (cat.getSkills() != null) {
                    for (String skill : cat.getSkills()) {
                        if (skill != null && !skill.isBlank()) {
                            newClaims.addAll(evaluateClaimsForText(resume, versionId, "Proficient in " + skill, "Skills: " + cat.getCategory(), sourceFacts));
                        }
                    }
                }
            }
        }

        return claimRepository.saveAll(newClaims);
    }

    private List<Claim> evaluateClaimsForText(Resume resume, String versionId, String text, String section, List<SourceFact> facts) {
        List<Claim> claims = new ArrayList<>();
        List<SourceFact> matchingFacts = new ArrayList<>();

        // Detect potential hallucination indicators (e.g. specific percentage metrics or unstated tech)
        boolean hasUnverifiedMetrics = text.matches(".*\\d+%.*")
                || text.matches(".*\\b(reduced|increased|boosted|improved)\\b.*\\d+%.*");

        // Grounding match: check token overlap with source facts
        String cleanClaim = text.toLowerCase().replaceAll("[^a-z0-9 ]", " ");
        Set<String> claimTokens = Arrays.stream(cleanClaim.split("\\s+"))
                .filter(t -> t.length() > 3)
                .collect(Collectors.toSet());

        for (SourceFact fact : facts) {
            String cleanFact = fact.getRawText().toLowerCase().replaceAll("[^a-z0-9 ]", " ");
            Set<String> factTokens = Arrays.stream(cleanFact.split("\\s+"))
                    .filter(t -> t.length() > 3)
                    .collect(Collectors.toSet());

            long intersection = claimTokens.stream().filter(factTokens::contains).count();
            if (intersection >= 2 || (claimTokens.size() <= 2 && intersection >= 1)) {
                matchingFacts.add(fact);
            }
        }

        ClaimStatus status;
        String justification;
        double confidence;

        if (hasUnverifiedMetrics && matchingFacts.stream().noneMatch(f -> f.getRawText().matches(".*\\d+%.*"))) {
            status = ClaimStatus.UNVERIFIED;
            justification = "AI generated specific metric/percentage without direct user-provided evidence in source facts.";
            confidence = 0.45;
        } else if (!matchingFacts.isEmpty()) {
            status = ClaimStatus.VERIFIED;
            justification = "Verified against " + matchingFacts.size() + " user source fact(s).";
            confidence = 0.95;
        } else {
            status = ClaimStatus.UNVERIFIED;
            justification = "No supporting source fact found in user input. Requires user verification.";
            confidence = 0.50;
        }

        Claim claim = Claim.builder()
                .resume(resume)
                .versionId(versionId)
                .claimText(text.trim())
                .section(section)
                .status(status)
                .justification(justification)
                .confidenceScore(confidence)
                .supportingFacts(matchingFacts)
                .build();

        claims.add(claim);
        return claims;
    }

    private Resume verifyResumeOwnership(String resumeId, String userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));
        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this resume");
        }
        return resume;
    }

    public ClaimDto mapToDto(Claim claim) {
        List<SourceFactDto> supportingFactDtos = claim.getSupportingFacts() != null
                ? claim.getSupportingFacts().stream().map(sourceFactService::mapToDto).collect(Collectors.toList())
                : new ArrayList<>();

        return ClaimDto.builder()
                .id(claim.getId())
                .resumeId(claim.getResume().getId())
                .versionId(claim.getVersionId())
                .claimText(claim.getClaimText())
                .section(claim.getSection())
                .status(claim.getStatus())
                .justification(claim.getJustification())
                .confidenceScore(claim.getConfidenceScore())
                .supportingFacts(supportingFactDtos)
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt())
                .build();
    }
}
