package com.phishshield.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record TextScanRequest(@NotBlank @Size(max=10000) String text) { }
