package com.verita.controller;

import com.verita.dto.dashboard.DashboardResponse;
import com.verita.security.SecurityUtils;
import com.verita.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for aggregated overview statistics and recent activities")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get aggregated dashboard statistics, recent resumes, and activities")
    public ResponseEntity<DashboardResponse> getDashboard() {
        String userId = SecurityUtils.getCurrentUserId();
        DashboardResponse response = dashboardService.getDashboardData(userId);
        return ResponseEntity.ok(response);
    }
}
