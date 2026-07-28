package com.phishshield.dto;
import java.util.List;
public record DashboardSummaryResponse(long totalScans, long safe, long low, long medium, long high, double averageRisk, double averageProcessingTimeMs, List<ScanResponse> recentScans) { }
