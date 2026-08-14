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
public class SkillCategoryDto {
    private String category; // e.g. "Programming Languages", "Frameworks & Libraries", "Tools & Platforms", "Database", "Soft Skills"
    @Builder.Default
    private List<String> skills = new ArrayList<>();
}
