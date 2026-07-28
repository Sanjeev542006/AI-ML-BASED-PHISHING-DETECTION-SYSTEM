package com.phishshield.repository;
import com.phishshield.entity.ScanHistory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
public interface ScanHistoryRepository extends JpaRepository<ScanHistory, UUID> {
    List<ScanHistory> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<ScanHistory> findByIdAndUserId(UUID id, UUID userId);
    List<ScanHistory> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    @Query(value = "SELECT COUNT(*) AS totalScans, " +
            "COALESCE(SUM(CASE WHEN risk_score = 0 THEN 1 ELSE 0 END), 0) AS safeCount, " +
            "COALESCE(SUM(CASE WHEN risk_score BETWEEN 1 AND 34 THEN 1 ELSE 0 END), 0) AS lowCount, " +
            "COALESCE(SUM(CASE WHEN risk_score BETWEEN 35 AND 69 THEN 1 ELSE 0 END), 0) AS mediumCount, " +
            "COALESCE(SUM(CASE WHEN risk_score >= 70 THEN 1 ELSE 0 END), 0) AS highCount, " +
            "COALESCE(AVG(risk_score), 0) AS averageRisk, " +
            "COALESCE(AVG(processing_time_ms), 0) AS averageProcessingTimeMs " +
            "FROM scan_history WHERE user_id = :userId", nativeQuery = true)
    DashboardSummaryProjection summarizeByUserId(UUID userId);
}
