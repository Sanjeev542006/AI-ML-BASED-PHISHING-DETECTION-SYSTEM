package com.phishshield.controller;
import com.phishshield.dto.ApiResponse;
import com.phishshield.dto.DashboardSummaryResponse;
import com.phishshield.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController @RequestMapping("/dashboard") @RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/summary") public ApiResponse<DashboardSummaryResponse> summary(@AuthenticationPrincipal(expression="username") String email) { return ApiResponse.success(dashboardService.getSummary(email)); }
}
