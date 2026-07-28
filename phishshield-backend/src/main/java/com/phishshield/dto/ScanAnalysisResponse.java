package com.phishshield.dto;
import com.phishshield.entity.ScanStatus;
import java.util.List;
import java.util.UUID;
/** Compact response designed for browser-extension URL checks. */
public record ScanAnalysisResponse(UUID scanId, int riskScore, ScanStatus status, List<String> reasons, double confidence) { }
