package com.phishshield.repository;
import com.phishshield.entity.DetectionResult;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DetectionResultRepository extends JpaRepository<DetectionResult, UUID> { }
