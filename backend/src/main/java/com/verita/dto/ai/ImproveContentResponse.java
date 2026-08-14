package com.verita.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImproveContentResponse {
    private String originalText;
    private String improvedText;
    private String explanation;
    private boolean changed;
}
