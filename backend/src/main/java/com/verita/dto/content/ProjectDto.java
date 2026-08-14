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
public class ProjectDto {
    private String id;
    private String title;
    private String role;
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    private String naturalDescription; // User's conversational/raw description
    @Builder.Default
    private List<String> bulletPoints = new ArrayList<>(); // AI generated or edited action bullets
    private String link;
    private String startDate;
    private String endDate;
}
