package com.phishshield.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
public record UrlScanRequest(@NotBlank @Size(max=2048) @Pattern(regexp="(?i)^https?://.+", message="URL must start with http:// or https://") String url) { }
