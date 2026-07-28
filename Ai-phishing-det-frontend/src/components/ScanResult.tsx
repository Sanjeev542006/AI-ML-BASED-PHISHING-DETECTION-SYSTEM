import { ShieldAlert } from 'lucide-react'
import { Card, Badge } from './ui'

export interface UnifiedScanResult {
  risk: number
  confidence: number
  level: 'High' | 'Medium' | 'Low' | 'Safe' | 'Malicious'
  reasons: string[]
  details?: Record<string, string | number>
}

export function ScanResult({ result, type }: { result: UnifiedScanResult | null; type: string }) {
  if (!result) return null

  const levelClass = (result.level || 'Low').toLowerCase()

  return (
    <Card className="result">
      <div className="result-main">
        <div className={`score ${levelClass}`}>
          <span>RISK SCORE</span>
          <strong>
            {result.risk}
            <small>/100</small>
          </strong>
        </div>
        <div>
          <Badge level={result.level}>{result.level} RISK</Badge>
          <h2>{type} analysis complete</h2>
          <p>
            Confidence score: <b>{Math.round(result.confidence)}%</b> · Our detection engine found indicators requiring review.
          </p>
        </div>
      </div>
      <div className="reasons">
        <h3>Detection signals</h3>
        {result.reasons && result.reasons.length > 0 ? (
          result.reasons.map((reason) => (
            <div key={reason}>
              <ShieldAlert size={16} />
              {reason}
            </div>
          ))
        ) : (
          <div style={{ color: '#86efac' }}>No malicious indicators detected. Input appears safe.</div>
        )}
      </div>
      {result.details && Object.keys(result.details).length > 0 && (
        <div className="detail-grid">
          {Object.entries(result.details).map(([key, val]) => (
            <div key={key}>
              <span>{key.toUpperCase()}</span>
              <b>{String(val)}</b>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
