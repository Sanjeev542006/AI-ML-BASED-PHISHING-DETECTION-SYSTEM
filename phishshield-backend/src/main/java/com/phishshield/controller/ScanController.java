package com.phishshield.controller;
import com.phishshield.dto.*;
import com.phishshield.service.DetectionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/scan") @RequiredArgsConstructor
public class ScanController {
    private final DetectionService detectionService;
    @PostMapping("/url") public ResponseEntity<ApiResponse<ScanAnalysisResponse>> scanUrl(@AuthenticationPrincipal(expression="username") String email,@Valid @RequestBody UrlScanRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(detectionService.scanUrl(email,request.url())));}
    @PostMapping("/text") public ResponseEntity<ApiResponse<ScanAnalysisResponse>> scanText(@AuthenticationPrincipal(expression="username") String email,@Valid @RequestBody TextScanRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(detectionService.scanText(email,request.text())));}
    @GetMapping("/history") public ApiResponse<List<ScanResponse>> history(@AuthenticationPrincipal(expression="username") String email){return ApiResponse.success(detectionService.getHistory(email));}
    @GetMapping("/{id}") public ApiResponse<ScanResponse> get(@AuthenticationPrincipal(expression="username") String email,@PathVariable UUID id){return ApiResponse.success(detectionService.getScan(email,id));}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@AuthenticationPrincipal(expression="username") String email,@PathVariable UUID id){detectionService.deleteScan(email,id);}
}
