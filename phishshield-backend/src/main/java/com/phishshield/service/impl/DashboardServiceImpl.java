package com.phishshield.service.impl;
import com.phishshield.dto.DashboardSummaryResponse;
import com.phishshield.exception.ResourceNotFoundException;
import com.phishshield.mapper.ScanMapper;
import com.phishshield.repository.DashboardSummaryProjection;
import com.phishshield.repository.ScanHistoryRepository;
import com.phishshield.repository.UserRepository;
import com.phishshield.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Slf4j @RequiredArgsConstructor @Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final UserRepository users; private final ScanHistoryRepository scans; private final ScanMapper mapper;
    @Override public DashboardSummaryResponse getSummary(String email) {
        var user=users.findByEmailIgnoreCase(email).orElseThrow(()->new ResourceNotFoundException("User not found"));
        DashboardSummaryProjection summary=scans.summarizeByUserId(user.getId());
        var recent=scans.findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(0, 5)).stream().map(mapper::toResponse).toList();
        log.debug("Dashboard summary calculated for user {}", user.getId());
        return new DashboardSummaryResponse(summary.getTotalScans(),summary.getSafeCount(),summary.getLowCount(),summary.getMediumCount(),summary.getHighCount(),summary.getAverageRisk(),summary.getAverageProcessingTimeMs(),recent);
    }
}
