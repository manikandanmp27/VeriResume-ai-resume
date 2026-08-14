package com.verita.dto.version;

import com.verita.entity.enums.VersionType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVersionRequest {

    @NotBlank(message = "Version name is required")
    private String versionName;

    @Builder.Default
    private VersionType versionType = VersionType.USER_EDITED;

    private String changeSummary;
}
