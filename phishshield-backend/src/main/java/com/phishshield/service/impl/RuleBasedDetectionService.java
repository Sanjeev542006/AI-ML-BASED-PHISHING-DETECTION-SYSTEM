package com.phishshield.service.impl;

import com.phishshield.dto.ScanResponse;
import com.phishshield.dto.ScanAnalysisResponse;
import com.phishshield.entity.*;
import com.phishshield.exception.ResourceNotFoundException;
import com.phishshield.mapper.ScanMapper;
import com.phishshield.repository.ScanHistoryRepository;
import com.phishshield.repository.UserRepository;
import com.phishshield.service.DetectionService;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RuleBasedDetectionService implements DetectionService {
    private static final Set<String> KEYWORDS = Set.of("login", "verify", "account", "update", "secure", "password", "bank", "payment", "reward", "free");
    private static final Set<String> SHORTENERS = Set.of("bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "ow.ly", "buff.ly", "shorturl.at");
    private static final Pattern URL_PATTERN = Pattern.compile("(?i)https?://[^\\s<>\\\"]+");
    private final UserRepository users;
    private final ScanHistoryRepository scans;
    private final ScanMapper mapper;

    @Override public ScanAnalysisResponse scanUrl(String email, String url) { return persist(email, InputType.URL, url.trim(), assessUrl(url.trim())); }
    @Override public ScanAnalysisResponse scanText(String email, String text) { return persist(email, InputType.TEXT, text.trim(), assessText(text.trim())); }
    @Override @Transactional(readOnly = true) public List<ScanResponse> getHistory(String email) { User user=currentUser(email); return scans.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(mapper::toResponse).toList(); }
    @Override @Transactional(readOnly = true) public ScanResponse getScan(String email, UUID scanId) { User user=currentUser(email); return mapper.toResponse(findOwnedScan(user.getId(), scanId)); }
    @Override public void deleteScan(String email, UUID scanId) { User user=currentUser(email); scans.delete(findOwnedScan(user.getId(), scanId)); }

    private ScanAnalysisResponse persist(String email, InputType type, String input, Assessment assessment) {
        Instant started = Instant.now(); User user=currentUser(email);
        ScanHistory scan = new ScanHistory(); scan.setUser(user); scan.setInputType(type); scan.setOriginalInput(input); scan.setRiskScore(assessment.riskScore()); scan.setScanStatus(statusFor(assessment.riskScore())); scan.setDetectorType(DetectorType.RULE_BASED); scan.setProcessingTimeMs(Math.max(1, Duration.between(started, Instant.now()).toMillis()));
        DetectionResult result = new DetectionResult(); result.setScan(scan); result.setConfidence(assessment.confidence()); result.setExplanation(Map.of("summary", assessment.summary(), "rulesEvaluated", assessment.rulesEvaluated())); result.setSuspiciousFeatures(assessment.reasons()); result.setModelVersion("rule-engine-1.0"); scan.setDetectionResult(result);
        ScanHistory stored=scans.save(scan); log.debug("{} scan persisted for user {} with score {}", type, user.getId(), stored.getRiskScore());
        return new ScanAnalysisResponse(stored.getId(), stored.getRiskScore(), stored.getScanStatus(), stored.getDetectionResult().getSuspiciousFeatures(), stored.getDetectionResult().getConfidence());
    }
    private User currentUser(String email) { return users.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
    private ScanHistory findOwnedScan(UUID userId, UUID id) { return scans.findByIdAndUserId(id,userId).orElseThrow(() -> new ResourceNotFoundException("Scan not found")); }
    private ScanStatus statusFor(int score) { return score>=70 ? ScanStatus.MALICIOUS : score>=35 ? ScanStatus.SUSPICIOUS : ScanStatus.SAFE; }

    private Assessment assessText(String text) {
        Matcher matcher=URL_PATTERN.matcher(text); List<String> urls=new ArrayList<>(); while(matcher.find()) urls.add(matcher.group());
        Assessment strongest=new Assessment(0, new ArrayList<>(), "No suspicious indicators found", 0, 0.62); for(String url:urls){Assessment candidate=assessUrl(url);if(candidate.riskScore()>strongest.riskScore())strongest=candidate;}
        String lowered=text.toLowerCase(Locale.ROOT); Set<String> textFeatures=new LinkedHashSet<>(strongest.reasons()); int score=strongest.riskScore();
        for(String keyword:KEYWORDS) if(lowered.contains(keyword) && !textFeatures.contains("Suspicious keyword: " + keyword)){score+=4;textFeatures.add("Suspicious keyword: " + keyword);}
        if(urls.isEmpty() && (lowered.contains("urgent") || lowered.contains("immediately"))){score+=10;textFeatures.add("Urgency language detected");}
        return assessment(score,textFeatures, urls.isEmpty()?"Text evaluated using heuristic rules":"Text and embedded URLs evaluated using heuristic rules", urls.size());
    }
    private Assessment assessUrl(String value) {
        Set<String> reasons=new LinkedHashSet<>(); int score=0; String lower=value.toLowerCase(Locale.ROOT); String host="";
        try { URI uri=URI.create(value); host=uri.getHost()==null?"":uri.getHost().toLowerCase(Locale.ROOT); if(!"https".equalsIgnoreCase(uri.getScheme())){score+=20;reasons.add("URL does not use HTTPS");} } catch(IllegalArgumentException ex){score+=35;reasons.add("Malformed URL structure");}
        if(value.length()>75){score+=10;reasons.add("Unusually long URL");}
        if(host.matches("^(?:\\d{1,3}\\.){3}\\d{1,3}$")){score+=25;reasons.add("IP address used instead of domain name");}
        if(value.contains("@")){score+=15;reasons.add("@ symbol may hide the true destination");}
        for(String keyword:KEYWORDS)if(lower.contains(keyword)){score+=6;reasons.add("Suspicious keyword: "+keyword);}
        if(SHORTENERS.contains(host)){score+=15;reasons.add("URL shortening service detected");}
        if(!host.isBlank() && host.split("\\.").length>3){score+=10;reasons.add("Multiple subdomains detected");}
        return assessment(score,reasons,"URL evaluated using heuristic rules",1);
    }
    private Assessment assessment(int rawScore, Set<String> reasons, String summary, int rulesEvaluated) { int score=Math.min(rawScore,100); double confidence=Math.min(0.98,0.62+(reasons.size()*0.045)); return new Assessment(score,List.copyOf(reasons),summary,rulesEvaluated,confidence); }
    private record Assessment(int riskScore, List<String> reasons, String summary, int rulesEvaluated, double confidence) { }
}
