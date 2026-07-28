package com.phishshield.dto;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
public record DetectionResultResponse(UUID id, double confidence, Map<String,Object> explanation, List<String> suspiciousFeatures, String modelVersion, Instant createdAt) { }
