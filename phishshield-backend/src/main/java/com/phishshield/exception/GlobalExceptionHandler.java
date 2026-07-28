package com.phishshield.exception;

import com.phishshield.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
        Map<String,String> errors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) errors.put(error.getField(), error.getDefaultMessage());
        return response(HttpStatus.BAD_REQUEST, "Validation failed", errors);
    }
    @ExceptionHandler(ConflictException.class) ResponseEntity<ApiError> conflict(ConflictException ex) { return response(HttpStatus.CONFLICT, ex.getMessage(), Map.of()); }
    @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiError> notFound(ResourceNotFoundException ex) { return response(HttpStatus.NOT_FOUND, ex.getMessage(), Map.of()); }
    @ExceptionHandler(UnauthorizedException.class) ResponseEntity<ApiError> unauthorized(UnauthorizedException ex) { return response(HttpStatus.UNAUTHORIZED, ex.getMessage(), Map.of()); }
    private ResponseEntity<ApiError> response(HttpStatus status, String message, Map<String,String> errors) { return ResponseEntity.status(status).body(new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, errors)); }
}
