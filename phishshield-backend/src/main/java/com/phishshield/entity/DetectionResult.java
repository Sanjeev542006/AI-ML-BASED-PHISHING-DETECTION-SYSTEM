package com.phishshield.entity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
@Entity @Table(name="detection_results") @Getter @Setter @NoArgsConstructor
public class DetectionResult {
    @Id @GeneratedValue private UUID id;
    @OneToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="scan_id", nullable=false, unique=true) private ScanHistory scan;
    @Column(nullable=false) private double confidence;
    @JdbcTypeCode(SqlTypes.JSON) @Column(nullable=false, columnDefinition="jsonb") private Map<String, Object> explanation;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name="suspicious_features", nullable=false, columnDefinition="jsonb") private List<String> suspiciousFeatures;
    @Column(name="model_version", nullable=false, length=100) private String modelVersion;
    @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
    @PrePersist void beforeInsert() { createdAt=Instant.now(); }
}
