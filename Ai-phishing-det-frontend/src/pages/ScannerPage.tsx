import { useEffect, useState } from 'react'
import { Activity, Bot, Globe2, LoaderCircle, Mail, MessageSquare, AlertCircle } from 'lucide-react'
import { Card, PageHeader } from '../components/ui'
import { ScanResult, type UnifiedScanResult } from '../components/ScanResult'
import { api, type ScanAnalysisResponse } from '../services/api'

type Kind = 'URL' | 'Email' | 'SMS'

const copy = {
  URL: ['URL Scanner', 'Paste a link to inspect it against live threat signals.', 'https://example.com/login'],
  Email: ['Email Scanner', 'Paste an email to identify phishing indicators and malicious links.', 'Paste the full email content, including headers if available...'],
  SMS: ['SMS Scanner', 'Analyze suspicious messages, delivery notices, and payment alerts.', 'Paste the SMS message here...'],
} as const

function mapStatusToLevel(status: string): 'High' | 'Medium' | 'Low' {
  switch (status?.toUpperCase()) {
    case 'HIGH':
    case 'MALICIOUS':
      return 'High'
    case 'MEDIUM':
      return 'Medium'
    default:
      return 'Low'
  }
}

export function ScannerPage({ kind }: { kind: Kind }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<UnifiedScanResult | null>(null)
  const [title, description, placeholder] = copy[kind]
  const Icon = kind === 'URL' ? Globe2 : kind === 'Email' ? Mail : MessageSquare

  // Reset all state whenever switching tabs/kind
  useEffect(() => {
    setValue('')
    setResult(null)
    setError('')
    setLoading(false)
  }, [kind])

  const analyze = async () => {
    if (!value.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      let res: ScanAnalysisResponse
      if (kind === 'URL') {
        res = await api.scanUrl(value.trim())
      } else {
        res = await api.scanText(value.trim())
      }

      const mappedLevel = mapStatusToLevel(res.status)
      const confValue = res.confidence > 1 ? res.confidence : Math.round(res.confidence * 100)

      setResult({
        risk: res.riskScore,
        confidence: confValue || 95,
        level: mappedLevel,
        reasons: res.reasons || [],
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to perform scan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="AI-POWERED DETECTION" title={title}>
        <span className="api-note">
          <Activity size={15} /> POST /api/scan/{kind === 'URL' ? 'url' : 'text'}
        </span>
      </PageHeader>

      <Card className="scanner">
        <div className="scanner-copy">
          <div className="scanner-icon">
            <Icon />
          </div>
          <div>
            <h2>Analyze {kind === 'URL' ? 'a suspicious link' : `a suspicious ${kind.toLowerCase()}`}</h2>
            <p>{description}</p>
          </div>
        </div>

        {kind === 'URL' ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={8}
          />
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#7f1d1d33', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginTop: '14px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="scanner-actions">
          <span>Analysis is powered by PhishShield backend detection engine.</span>
          <button className="button" disabled={loading || !value.trim()} onClick={analyze}>
            {loading ? <LoaderCircle className="spin" size={17} /> : <Bot size={17} />}{' '}
            {loading ? 'Analyzing…' : `Analyze ${kind}`}
          </button>
        </div>
      </Card>

      <ScanResult result={result} type={kind} />
    </>
  )
}
