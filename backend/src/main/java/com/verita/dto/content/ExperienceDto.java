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
public class ExperienceDto {
    private String id;
    private String company;
    private String position;
    private String location;
    private String startDate;
    private String endDate;
    private boolean current;
    private String naturalDescription;
    @Builder.Default
    private List<String> bulletPoints = new ArrayList<>();
}
