CREATE TABLE scan_history (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input_type VARCHAR(20) NOT NULL,
    original_input TEXT NOT NULL,
    scan_status VARCHAR(30) NOT NULL,
    risk_score INTEGER NOT NULL,
    processing_time_ms BIGINT NOT NULL,
    detector_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_scan_history_user_created_at ON scan_history(user_id, created_at DESC);

CREATE TABLE detection_results (
    id UUID PRIMARY KEY,
    scan_id UUID NOT NULL UNIQUE REFERENCES scan_history(id) ON DELETE CASCADE,
    confidence DOUBLE PRECISION NOT NULL,
    explanation JSONB NOT NULL,
    suspicious_features JSONB NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
