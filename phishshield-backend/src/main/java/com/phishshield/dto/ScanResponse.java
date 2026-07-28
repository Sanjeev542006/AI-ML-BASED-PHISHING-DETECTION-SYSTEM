package com.phishshield.dto;
import com.phishshield.entity.DetectorType;
import com.phishshield.entity.InputType;
import com.phishshield.entity.ScanStatus;
import java.time.Instant;
import java.util.UUID;
public record ScanResponse(UUID id, InputType inputType, String originalInput, ScanStatus status, int riskScore, long processingTimeMs, DetectorType detectorType, Instant createdAt, DetectionResultResponse detectionResult) { }
