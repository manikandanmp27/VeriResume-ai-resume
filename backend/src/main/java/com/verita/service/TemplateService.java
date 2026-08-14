package com.verita.service;

import com.verita.dto.template.TemplateDto;
import com.verita.entity.enums.TemplateType;
import com.verita.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TemplateService {

    private final List<TemplateDto> templates = Arrays.asList(
            TemplateDto.builder()
                    .id(TemplateType.MODERN)
                    .name("Modern Slate")
                    .description("Clean modern design with subtle accent borders, structured sections, and optimized hierarchy.")
                    .atsFriendlinessScore(98)
                    .recommendedFor("Software Engineers, Fullstack Developers, Tech Leads")
                    .layoutStyle("Single column with accent header")
                    .keyFeatures(List.of("Clean section dividers", "High-contrast headings", "High ATS readability", "Compact bullet formatting"))
                    .build(),
            TemplateDto.builder()
                    .id(TemplateType.CLASSIC)
                    .name("Classic Ivy")
                    .description("Traditional serif layout following standard academic and corporate recruitment conventions.")
                    .atsFriendlinessScore(99)
                    .recommendedFor("Consultants, Managers, Data Scientists, Financial Engineers")
                    .layoutStyle("Traditional centered header, clean horizontal rules")
                    .keyFeatures(List.of("Conservative typography", "Universal parser compatibility", "Clear chronological flow"))
                    .build(),
            TemplateDto.builder()
                    .id(TemplateType.MINIMAL)
                    .name("Minimal Clean")
                    .description("Ultra-simplified, whitespace-focused layout designed for maximum text parsing reliability.")
                    .atsFriendlinessScore(100)
                    .recommendedFor("Junior Engineers, Students, General Tech Roles")
                    .layoutStyle("Minimalist single column")
                    .keyFeatures(List.of("Zero graphical interference", "Perfect for all automated ATS engines", "Effortless scannability"))
                    .build(),
            TemplateDto.builder()
                    .id(TemplateType.TECHNICAL)
                    .name("Technical Pro")
                    .description("Structured layout specifically emphasizing skills breakdown, project technologies, and engineering achievements.")
                    .atsFriendlinessScore(96)
                    .recommendedFor("DevOps, Cloud Engineers, Backend Specialists, Security Engineers")
                    .layoutStyle("Structured technical blocks with technology badges")
                    .keyFeatures(List.of("Categorized skills priority", "Highlighted tech tags", "System metrics focus"))
                    .build()
    );

    public List<TemplateDto> listTemplates() {
        return templates;
    }

    public TemplateDto getTemplate(String templateId) {
        try {
            TemplateType type = TemplateType.valueOf(templateId.toUpperCase());
            return templates.stream()
                    .filter(t -> t.getId() == type)
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Template not found: " + templateId));
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid template identifier: " + templateId);
        }
    }
}
