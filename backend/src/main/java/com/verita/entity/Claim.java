package com.verita.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.verita.entity.enums.ClaimStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(name = "version_id")
    private String versionId;

    @Column(name = "claim_text", columnDefinition = "TEXT", nullable = false)
    private String claimText;

    @Column(nullable = false)
    private String section; // e.g. "projects", "experience", "skills", "summary"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.UNVERIFIED;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "confidence_score")
    @Builder.Default
    private Double confidenceScore = 1.0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "claim_source_facts",
            joinColumns = @JoinColumn(name = "claim_id"),
            inverseJoinColumns = @JoinColumn(name = "fact_id")
    )
    @Builder.Default
    private List<SourceFact> supportingFacts = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
