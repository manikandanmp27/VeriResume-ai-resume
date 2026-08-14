package com.verita.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(name = "job_title")
    private String jobTitle;

    private String company;

    @Column(name = "raw_job_description", columnDefinition = "TEXT", nullable = false)
    private String rawJobDescription;

    @Column(name = "important_skills", columnDefinition = "TEXT")
    private String importantSkillsJson;

    @Column(columnDefinition = "TEXT")
    private String technologiesJson;

    @Column(columnDefinition = "TEXT")
    private String qualificationsJson;

    @Column(columnDefinition = "TEXT")
    private String requirementsJson;

    @Column(name = "supported_requirements", columnDefinition = "TEXT")
    private String supportedRequirementsJson;

    @Column(name = "missing_requirements", columnDefinition = "TEXT")
    private String missingRequirementsJson;

    @Column(name = "match_score")
    @Builder.Default
    private Integer matchScore = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
