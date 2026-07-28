package com.phishshield.repository;
public interface DashboardSummaryProjection { long getTotalScans(); long getSafeCount(); long getLowCount(); long getMediumCount(); long getHighCount(); double getAverageRisk(); double getAverageProcessingTimeMs(); }
