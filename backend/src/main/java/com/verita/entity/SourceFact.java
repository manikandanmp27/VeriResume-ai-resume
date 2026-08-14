package com.verita.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.verita.entity.enums.FactCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "source_facts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceFact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FactCategory category;

    @Column(name = "raw_text", columnDefinition = "TEXT", nullable = false)
    private String rawText;

    @Column(name = "structured_fact", columnDefinition = "TEXT")
    private String structuredFact;

    @Column(name = "source_section")
    private String sourceSection; // e.g. "projects[0]", "experience[1]", "profile"

    @JsonIgnore
    @ManyToMany(mappedBy = "supportingFacts", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Claim> claims = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
