package com.verita.dto.content;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeContentDto {
    @Builder.Default
    private PersonalInfoDto personalInfo = new PersonalInfoDto();

    @Builder.Default
    private List<EducationDto> education = new ArrayList<>();

    @Builder.Default
    private List<SkillCategoryDto> skills = new ArrayList<>();

    @Builder.Default
    private List<ProjectDto> projects = new ArrayList<>();

    @Builder.Default
    private List<ExperienceDto> experience = new ArrayList<>();

    @Builder.Default
    private List<AchievementDto> achievements = new ArrayList<>();

    @Builder.Default
    private List<CertificationDto> certifications = new ArrayList<>();
}
