package com.verita.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ats_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(name = "version_id")
    private String versionId;

    @Column(name = "extracted_text", columnDefinition = "TEXT")
    private String extractedText;

    @Column(name = "detected_sections", columnDefinition = "TEXT")
    private String detectedSectionsJson;

    @Column(name = "extracted_skills", columnDefinition = "TEXT")
    private String extractedSkillsJson;

    @Column(name = "extracted_education", columnDefinition = "TEXT")
    private String extractedEducationJson;

    @Column(name = "extracted_experience", columnDefinition = "TEXT")
    private String extractedExperienceJson;

    @Column(name = "parsing_score")
    @Builder.Default
    private Integer parsingScore = 100;

    @Column(name = "formatting_warnings", columnDefinition = "TEXT")
    private String formattingWarningsJson;

    @Column(name = "parsing_problems", columnDefinition = "TEXT")
    private String parsingProblemsJson;

    @Column(name = "missing_sections", columnDefinition = "TEXT")
    private String missingSectionsJson;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
