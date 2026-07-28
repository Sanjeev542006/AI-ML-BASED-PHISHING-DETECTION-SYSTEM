import { useEffect, useState } from 'react'
import { AlertTriangle, Download, Globe2, Mail, MessageSquare, ShieldCheck, LoaderCircle } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { Card, Badge, PageHeader } from '../components/ui'
import { ScanTable } from '../components/ScanTable'
import { useAuth } from '../context/AuthContext'
import { api, type DashboardSummaryResponse } from '../services/api'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api
      .getDashboardSummary()
      .then((data) => {
        if (isMounted) {
          setSummary(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const displayName = user?.firstName ? `${user.firstName}` : user?.email ? user.email.split('@')[0] : 'User'

  const exportOverviewCSV = () => {
    if (!summary) return
    const headers = ['Metric', 'Value']
    const rows = [
      ['Total Scans', summary.totalScans],
      ['Safe Scans', summary.safe],
      ['Low Risk Scans', summary.low],
      ['Medium Risk Scans', summary.medium],
      ['High / Malicious Threats', summary.high],
      ['Average Risk Score', summary.averageRisk],
      ['Average Processing Time (ms)', summary.averageProcessingTimeMs],
    ]

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `phishshield_dashboard_overview_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const trend = [
    { day: 'Mon', threats: summary?.high || 2 },
    { day: 'Tue', threats: (summary?.high || 0) + (summary?.medium || 1) },
    { day: 'Wed', threats: summary?.medium || 3 },
    { day: 'Thu', threats: Math.max(0, (summary?.totalScans || 5) - (summary?.safe || 2)) },
    { day: 'Fri', threats: summary?.high || 1 },
    { day: 'Sat', threats: summary?.low || 2 },
    { day: 'Sun', threats: summary?.medium || 4 },
  ]

  const stats = [
    ['Total Scans', summary?.totalScans ?? 0, Globe2, 'blue'],
    ['Safe Items', summary?.safe ?? 0, ShieldCheck, 'green'],
    ['Low / Medium Risk', (summary?.low ?? 0) + (summary?.medium ?? 0), Mail, 'amber'],
    ['Threats Detected', summary?.high ?? 0, MessageSquare, 'purple'],
  ] as const

  const recentAlerts = summary?.recentScans
    ? summary.recentScans
        .filter((s) => s.status === 'HIGH' || s.status === 'MALICIOUS' || s.status === 'MEDIUM')
        .slice(0, 3)
        .map((s) => ({
          title: `Potential Phishing Indicator in ${s.inputType}`,
          meta: `${s.originalInput.length > 40 ? s.originalInput.substring(0, 40) + '...' : s.originalInput}`,
          level: s.status === 'HIGH' || s.status === 'MALICIOUS' ? ('High' as const) : ('Medium' as const),
        }))
    : []

  return (
    <>
      <PageHeader eyebrow="SECURITY OVERVIEW" title={`Welcome back, ${displayName}.`}>
        <button className="button secondary" onClick={exportOverviewCSV}>
          <Download size={16} />
          Export overview
        </button>
      </PageHeader>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#94a3b8' }}>
          <LoaderCircle className="spin" size={24} />
        </div>
      ) : (
        <>
          <div className="stat-grid">
            {stats.map(([label, value, Icon, color]) => (
              <Card key={label} className="stat">
                <div className={`icon-box ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <span>{label}</span>
                  <strong>{value.toLocaleString()}</strong>
                  <em>Live telemetry</em>
                </div>
              </Card>
            ))}
          </div>

          <div className="dashboard-grid">
            <Card className="chart-card">
              <div className="card-head">
                <div>
                  <h2>Threat activity</h2>
                  <p>Analyzed scans & threat frequency</p>
                </div>
              </div>
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#ef4444" stopOpacity=".35" />
                        <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border-card)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--text-dim)" tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, color: 'var(--text-main)' }} />
                    <Area dataKey="threats" stroke="#ef4444" strokeWidth={3} fill="url(#fill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="risk-card">
              <div className="card-head">
                <div>
                  <h2>Active posture level</h2>
                  <p>Risk distribution of scans</p>
                </div>
              </div>
              <div className="gauge">
                <div>
                  <strong>{summary?.high ? 'Threats Alert' : 'Guarded'}</strong>
                  <span>{summary?.high ?? 0} Critical</span>
                </div>
              </div>
              <div className="risk-legend">
                <span>
                  <i className="dot red" />
                  High <b>{summary?.high ?? 0}</b>
                </span>
                <span>
                  <i className="dot amber" />
                  Medium <b>{summary?.medium ?? 0}</b>
                </span>
                <span>
                  <i className="dot green" />
                  Safe/Low <b>{(summary?.safe ?? 0) + (summary?.low ?? 0)}</b>
                </span>
              </div>
            </Card>

            <Card className="alerts">
              <div className="card-head">
                <div>
                  <h2>Recent alerts</h2>
                  <p>Detections requiring attention</p>
                </div>
                <button className="text-button" onClick={() => navigate('/threat-intelligence')}>
                  View all
                </button>
              </div>
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert, idx) => (
                  <div className="alert" key={idx}>
                    <div className={`alert-icon ${alert.level.toLowerCase()}`}>
                      <AlertTriangle size={17} />
                    </div>
                    <div>
                      <b>{alert.title}</b>
                      <span>{alert.meta}</span>
                    </div>
                    <Badge level={alert.level}>{alert.level}</Badge>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px 21px', color: '#718096', fontSize: '12px' }}>
                  No high priority alerts recorded.
                </div>
              )}
            </Card>

            <Card className="recent">
              <div className="card-head">
                <div>
                  <h2>Recent scans</h2>
                  <p>Latest protection events across your workspace</p>
                </div>
                <button className="text-button" onClick={() => navigate('/reports')}>
                  View reports
                </button>
              </div>
              <ScanTable scans={summary?.recentScans} />
            </Card>
          </div>
        </>
      )}
    </>
  )
}
