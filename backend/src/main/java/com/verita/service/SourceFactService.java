package com.verita.service;

import com.verita.dto.content.*;
import com.verita.dto.fact.CreateFactRequest;
import com.verita.dto.fact.SourceFactDto;
import com.verita.dto.fact.UpdateFactRequest;
import com.verita.entity.Resume;
import com.verita.entity.SourceFact;
import com.verita.entity.enums.FactCategory;
import com.verita.exception.ForbiddenException;
import com.verita.exception.ResourceNotFoundException;
import com.verita.repository.ResumeRepository;
import com.verita.repository.SourceFactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SourceFactService {

    private final SourceFactRepository sourceFactRepository;
    private final ResumeRepository resumeRepository;

    @Transactional(readOnly = true)
    public List<SourceFactDto> listFacts(String resumeId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        return sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resumeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SourceFactDto createFact(String resumeId, String userId, CreateFactRequest request) {
        Resume resume = verifyResumeOwnership(resumeId, userId);

        SourceFact fact = SourceFact.builder()
                .resume(resume)
                .category(request.getCategory())
                .rawText(request.getRawText().trim())
                .structuredFact(request.getStructuredFact() != null ? request.getStructuredFact().trim() : request.getRawText().trim())
                .sourceSection(request.getSourceSection())
                .build();

        SourceFact saved = sourceFactRepository.save(fact);
        return mapToDto(saved);
    }

    @Transactional
    public SourceFactDto updateFact(String resumeId, String factId, String userId, UpdateFactRequest request) {
        verifyResumeOwnership(resumeId, userId);
        SourceFact fact = sourceFactRepository.findByIdAndResumeId(factId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Source fact not found: " + factId));

        if (request.getCategory() != null) {
            fact.setCategory(request.getCategory());
        }
        if (request.getRawText() != null && !request.getRawText().isBlank()) {
            fact.setRawText(request.getRawText().trim());
        }
        if (request.getStructuredFact() != null) {
            fact.setStructuredFact(request.getStructuredFact().trim());
        }
        if (request.getSourceSection() != null) {
            fact.setSourceSection(request.getSourceSection().trim());
        }

        SourceFact saved = sourceFactRepository.save(fact);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteFact(String resumeId, String factId, String userId) {
        verifyResumeOwnership(resumeId, userId);
        SourceFact fact = sourceFactRepository.findByIdAndResumeId(factId, resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Source fact not found: " + factId));
        sourceFactRepository.delete(fact);
    }

    @Transactional
    public void syncFactsFromResumeContent(Resume resume, ResumeContentDto content) {
        if (content == null) return;

        List<SourceFact> existingFacts = sourceFactRepository.findByResumeIdOrderByCreatedAtAsc(resume.getId());
        List<SourceFact> newFacts = new ArrayList<>();

        // Profile / Personal info
        if (content.getPersonalInfo() != null) {
            PersonalInfoDto pi = content.getPersonalInfo();
            if (pi.getProfessionalSummary() != null && !pi.getProfessionalSummary().isBlank()) {
                addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.GENERAL,
                        pi.getProfessionalSummary(), "User professional summary: " + pi.getProfessionalSummary(), "personalInfo.summary");
            }
        }

        // Education
        if (content.getEducation() != null) {
            for (EducationDto edu : content.getEducation()) {
                String raw = String.format("%s at %s (%s - %s) Grade: %s",
                        edu.getDegree() != null ? edu.getDegree() : "",
                        edu.getInstitution() != null ? edu.getInstitution() : "",
                        edu.getStartDate() != null ? edu.getStartDate() : "",
                        edu.getEndDate() != null ? edu.getEndDate() : "",
                        edu.getGradeOrCgpa() != null ? edu.getGradeOrCgpa() : "").trim();
                if (!raw.isBlank()) {
                    addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.EDUCATION,
                            raw, "Education: " + raw, "education." + edu.getId());
                }
            }
        }

        // Skills
        if (content.getSkills() != null) {
            for (SkillCategoryDto sc : content.getSkills()) {
                if (sc.getSkills() != null && !sc.getSkills().isEmpty()) {
                    String raw = String.format("%s: %s", sc.getCategory(), String.join(", ", sc.getSkills()));
                    addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.SKILL,
                            raw, "Skills: " + raw, "skills." + sc.getCategory());
                }
            }
        }

        // Projects
        if (content.getProjects() != null) {
            for (ProjectDto p : content.getProjects()) {
                if (p.getTitle() != null && !p.getTitle().isBlank()) {
                    String raw = String.format("Project %s (Role: %s, Tech: %s): %s",
                            p.getTitle(),
                            p.getRole() != null ? p.getRole() : "",
                            p.getTechnologies() != null ? String.join(", ", p.getTechnologies()) : "",
                            p.getNaturalDescription() != null ? p.getNaturalDescription() : "").trim();
                    addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.PROJECT,
                            raw, "Project: " + raw, "projects." + p.getId());
                }
            }
        }

        // Experience
        if (content.getExperience() != null) {
            for (ExperienceDto exp : content.getExperience()) {
                if (exp.getCompany() != null && !exp.getCompany().isBlank()) {
                    String raw = String.format("%s at %s (%s - %s): %s",
                            exp.getPosition() != null ? exp.getPosition() : "",
                            exp.getCompany(),
                            exp.getStartDate() != null ? exp.getStartDate() : "",
                            exp.isCurrent() ? "Present" : (exp.getEndDate() != null ? exp.getEndDate() : ""),
                            exp.getNaturalDescription() != null ? exp.getNaturalDescription() : "").trim();
                    addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.EXPERIENCE,
                            raw, "Experience: " + raw, "experience." + exp.getId());
                }
            }
        }

        // Achievements
        if (content.getAchievements() != null) {
            for (AchievementDto ach : content.getAchievements()) {
                if (ach.getTitle() != null && !ach.getTitle().isBlank()) {
                    String raw = String.format("Achievement: %s by %s (%s) - %s",
                            ach.getTitle(),
                            ach.getIssuer() != null ? ach.getIssuer() : "",
                            ach.getDate() != null ? ach.getDate() : "",
                            ach.getDescription() != null ? ach.getDescription() : "").trim();
                    addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.ACHIEVEMENT,
                            raw, raw, "achievements." + ach.getId());
                }
            }
        }

        // Certifications
        if (content.getCertifications() != null) {
            for (CertificationDto cert : content.getCertifications()) {
                if (cert.getName() != null && !cert.getName().isBlank()) {
                    String raw = String.format("Certification: %s by %s (%s)",
                            cert.getName(),
                            cert.getIssuer() != null ? cert.getIssuer() : "",
                            cert.getIssueDate() != null ? cert.getIssueDate() : "").trim();
                    addFactIfNotExists(existingFacts, newFacts, resume, FactCategory.CERTIFICATION,
                            raw, raw, "certifications." + cert.getId());
                }
            }
        }

        if (!newFacts.isEmpty()) {
            sourceFactRepository.saveAll(newFacts);
        }
    }

    private void addFactIfNotExists(List<SourceFact> existing, List<SourceFact> newFacts, Resume resume,
                                    FactCategory category, String rawText, String structured, String section) {
        boolean alreadyExists = existing.stream().anyMatch(f -> f.getRawText().equalsIgnoreCase(rawText.trim()))
                || newFacts.stream().anyMatch(f -> f.getRawText().equalsIgnoreCase(rawText.trim()));
        if (!alreadyExists) {
            newFacts.add(SourceFact.builder()
                    .resume(resume)
                    .category(category)
                    .rawText(rawText.trim())
                    .structuredFact(structured.trim())
                    .sourceSection(section)
                    .build());
        }
    }

    private Resume verifyResumeOwnership(String resumeId, String userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found: " + resumeId));
        if (!resume.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access this resume");
        }
        return resume;
    }

    public SourceFactDto mapToDto(SourceFact fact) {
        return SourceFactDto.builder()
                .id(fact.getId())
                .resumeId(fact.getResume().getId())
                .category(fact.getCategory())
                .rawText(fact.getRawText())
                .structuredFact(fact.getStructuredFact())
                .sourceSection(fact.getSourceSection())
                .createdAt(fact.getCreatedAt())
                .build();
    }
}
