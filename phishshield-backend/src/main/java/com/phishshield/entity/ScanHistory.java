package com.phishshield.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity @Table(name="scan_history") @Getter @Setter @NoArgsConstructor
public class ScanHistory extends BaseEntity {
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="user_id", nullable=false) private User user;
    @Enumerated(EnumType.STRING) @Column(name="input_type", nullable=false, length=20) private InputType inputType;
    @Column(name="original_input", nullable=false, columnDefinition="TEXT") private String originalInput;
    @Enumerated(EnumType.STRING) @Column(name="scan_status", nullable=false, length=30) private ScanStatus scanStatus;
    @Column(name="risk_score", nullable=false) private int riskScore;
    @Column(name="processing_time_ms", nullable=false) private long processingTimeMs;
    @Enumerated(EnumType.STRING) @Column(name="detector_type", nullable=false, length=30) private DetectorType detectorType;
    @OneToOne(mappedBy="scan", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY) private DetectionResult detectionResult;
}
