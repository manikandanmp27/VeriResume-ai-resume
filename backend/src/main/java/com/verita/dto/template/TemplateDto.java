package com.verita.dto.template;

import com.verita.entity.enums.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateDto {
    private TemplateType id;
    private String name;
    private String description;
    private int atsFriendlinessScore; // e.g. 98, 95, 99, 94
    private String recommendedFor;
    private String layoutStyle;
    private List<String> keyFeatures;
}
