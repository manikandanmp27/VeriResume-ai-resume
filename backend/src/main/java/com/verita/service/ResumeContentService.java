package com.verita.service;

import com.verita.dto.content.*;
import com.verita.entity.Resume;
import com.verita.repository.ResumeRepository;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeContentService {

    private final ResumeService resumeService;
    private final ResumeRepository resumeRepository;
    private final SourceFactService sourceFactService;

    @Transactional(readOnly = true)
    public ResumeContentDto getContent(String resumeId, String userId) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        return parseContent(resume.getContentJson());
    }

    @Transactional
    public ResumeContentDto updateFullContent(String resumeId, String userId, ResumeContentDto content) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        assignMissingIds(content);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updatePersonalInfo(String resumeId, String userId, PersonalInfoDto personalInfo) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        content.setPersonalInfo(personalInfo);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updateEducation(String resumeId, String userId, List<EducationDto> education) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        for (EducationDto edu : education) {
            if (edu.getId() == null || edu.getId().isBlank()) {
                edu.setId(UUID.randomUUID().toString());
            }
        }
        content.setEducation(education);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updateSkills(String resumeId, String userId, List<SkillCategoryDto> skills) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        content.setSkills(skills);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updateProjects(String resumeId, String userId, List<ProjectDto> projects) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        for (ProjectDto project : projects) {
            if (project.getId() == null || project.getId().isBlank()) {
                project.setId(UUID.randomUUID().toString());
            }
        }
        content.setProjects(projects);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updateExperience(String resumeId, String userId, List<ExperienceDto> experience) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        for (ExperienceDto exp : experience) {
            if (exp.getId() == null || exp.getId().isBlank()) {
                exp.setId(UUID.randomUUID().toString());
            }
        }
        content.setExperience(experience);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updateAchievements(String resumeId, String userId, List<AchievementDto> achievements) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        for (AchievementDto ach : achievements) {
            if (ach.getId() == null || ach.getId().isBlank()) {
                ach.setId(UUID.randomUUID().toString());
            }
        }
        content.setAchievements(achievements);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    @Transactional
    public ResumeContentDto updateCertifications(String resumeId, String userId, List<CertificationDto> certifications) {
        Resume resume = resumeService.getResumeEntity(resumeId, userId);
        ResumeContentDto content = parseContent(resume.getContentJson());
        for (CertificationDto cert : certifications) {
            if (cert.getId() == null || cert.getId().isBlank()) {
                cert.setId(UUID.randomUUID().toString());
            }
        }
        content.setCertifications(certifications);
        resume.setContentJson(JsonUtils.toJson(content));
        resumeRepository.save(resume);
        sourceFactService.syncFactsFromResumeContent(resume, content);
        return content;
    }

    private ResumeContentDto parseContent(String contentJson) {
        if (contentJson == null || contentJson.isBlank()) {
            return new ResumeContentDto();
        }
        ResumeContentDto content = JsonUtils.fromJson(contentJson, ResumeContentDto.class);
        return content != null ? content : new ResumeContentDto();
    }

    private void assignMissingIds(ResumeContentDto content) {
        if (content.getEducation() != null) {
            content.getEducation().forEach(e -> {
                if (e.getId() == null || e.getId().isBlank()) e.setId(UUID.randomUUID().toString());
            });
        }
        if (content.getProjects() != null) {
            content.getProjects().forEach(p -> {
                if (p.getId() == null || p.getId().isBlank()) p.setId(UUID.randomUUID().toString());
            });
        }
        if (content.getExperience() != null) {
            content.getExperience().forEach(e -> {
                if (e.getId() == null || e.getId().isBlank()) e.setId(UUID.randomUUID().toString());
            });
        }
        if (content.getAchievements() != null) {
            content.getAchievements().forEach(a -> {
                if (a.getId() == null || a.getId().isBlank()) a.setId(UUID.randomUUID().toString());
            });
        }
        if (content.getCertifications() != null) {
            content.getCertifications().forEach(c -> {
                if (c.getId() == null || c.getId().isBlank()) c.setId(UUID.randomUUID().toString());
            });
        }
    }
}
