CREATE INDEX idx_scan_history_user_risk_score ON scan_history(user_id, risk_score);
CREATE INDEX idx_scan_history_user_status ON scan_history(user_id, scan_status);
