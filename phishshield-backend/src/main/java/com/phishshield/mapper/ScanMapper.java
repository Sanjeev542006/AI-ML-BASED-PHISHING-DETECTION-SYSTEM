package com.phishshield.mapper;
import com.phishshield.dto.DetectionResultResponse;
import com.phishshield.dto.ScanResponse;
import com.phishshield.entity.DetectionResult;
import com.phishshield.entity.ScanHistory;
import org.springframework.stereotype.Component;
@Component public class ScanMapper {
    public ScanResponse toResponse(ScanHistory scan) { DetectionResult result=scan.getDetectionResult();return new ScanResponse(scan.getId(),scan.getInputType(),scan.getOriginalInput(),scan.getScanStatus(),scan.getRiskScore(),scan.getProcessingTimeMs(),scan.getDetectorType(),scan.getCreatedAt(),new DetectionResultResponse(result.getId(),result.getConfidence(),result.getExplanation(),result.getSuspiciousFeatures(),result.getModelVersion(),result.getCreatedAt())); }
}
