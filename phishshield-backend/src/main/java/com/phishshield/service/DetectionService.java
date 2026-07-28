package com.phishshield.service;
import com.phishshield.dto.ScanResponse;
import com.phishshield.dto.ScanAnalysisResponse;
import java.util.List;
import java.util.UUID;
public interface DetectionService {
    ScanAnalysisResponse scanUrl(String email, String url);
    ScanAnalysisResponse scanText(String email, String text);
    List<ScanResponse> getHistory(String email);
    ScanResponse getScan(String email, UUID scanId);
    void deleteScan(String email, UUID scanId);
}
