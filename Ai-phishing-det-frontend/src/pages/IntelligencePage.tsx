import { useEffect, useState } from 'react'
import { Download, Search, SlidersHorizontal, LoaderCircle, Trash2 } from 'lucide-react'
import { Badge, Card, PageHeader } from '../components/ui'
import { api, type ScanResponse } from '../services/api'

function mapStatusToBadgeLevel(status: string): 'High' | 'Medium' | 'Low' {
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

export function IntelligencePage({ reports = false }: { reports?: boolean }) {
  const [scans, setScans] = useState<ScanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const loadData = () => {
    setLoading(true)
    api
      .getHistory()
      .then((data) => {
        setScans(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this scan entry from database?')) {
      try {
        await api.deleteScan(id)
        setScans((prev) => prev.filter((s) => s.id !== id))
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Failed to delete entry')
      }
    }
  }

  const exportCSV = () => {
    const headers = reports
      ? ['Report ID', 'Target Input', 'Type', 'Risk Level', 'Risk Score', 'Created At']
      : ['Scan ID', 'Domain / Target', 'Input Type', 'Verdict', 'Risk Score', 'Created At']

    const rows = scans.map((s, idx) => [
      reports ? `RPT-${String(1000 + idx)}` : s.id,
      `"${s.originalInput.replace(/"/g, '""')}"`,
      s.inputType,
      s.status,
      s.riskScore,
      s.createdAt,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `phishshield_${reports ? 'reports' : 'threat_intelligence'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter items
  const filtered = scans.filter((s) => {
    const matchesSearch =
      s.originalInput.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.inputType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.status.toLowerCase().includes(searchTerm.toLowerCase())

    const level = mapStatusToBadgeLevel(s.status)
    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'HIGH' && level === 'High') ||
      (riskFilter === 'MEDIUM' && level === 'Medium') ||
      (riskFilter === 'LOW' && level === 'Low')

    return matchesSearch && matchesRisk
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <>
      <PageHeader
        eyebrow={reports ? 'SECURITY REPORTING' : 'GLOBAL THREAT FEED'}
        title={reports ? 'Threat Reports' : 'Threat Intelligence'}
      >
        <button className="button" onClick={exportCSV}>
          <Download size={16} />
          Export CSV
        </button>
      </PageHeader>

      <Card className="data-card">
        <div className="toolbar">
          <div className="search">
            <Search size={17} />
            <input
              placeholder={`Search ${reports ? 'reports' : 'domains, inputs, or threats'}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <SlidersHorizontal size={15} color="#94a3b8" />
            <select
              className="filter"
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value)
                setCurrentPage(1)
              }}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk / Threats</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low / Safe</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: '#94a3b8' }}>
            <LoaderCircle className="spin" size={24} />
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#718096', fontSize: '13px' }}>
            {scans.length === 0
              ? 'No threat intelligence data recorded yet.'
              : 'No results match your search and filter criteria.'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{reports ? 'REPORT ID' : 'TARGET / DOMAIN'}</th>
                  <th>{reports ? 'TARGET INPUT' : 'CHANNEL'}</th>
                  <th>RISK SCORE</th>
                  <th>VERDICT</th>
                  <th>TIMESTAMP</th>
                  <th style={{ textAlign: 'right', paddingRight: '16px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((scan, idx) => {
                  const level = mapStatusToBadgeLevel(scan.status)
                  const displayId = reports ? `RPT-${String(4830 - idx).padStart(4, '0')}` : scan.originalInput
                  const targetSub = scan.originalInput.length > 50 ? `${scan.originalInput.substring(0, 50)}...` : scan.originalInput
                  const timeStr = scan.createdAt ? new Date(scan.createdAt).toLocaleString() : 'Recent'

                  return (
                    <tr key={scan.id}>
                      <td>
                        <b title={scan.originalInput}>{reports ? displayId : targetSub}</b>
                      </td>
                      <td>{reports ? targetSub : scan.inputType}</td>
                      <td>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, color: '#e2e8f0' }}>
                          {scan.riskScore}/100
                        </span>
                      </td>
                      <td>
                        <Badge level={level}>{level}</Badge>
                      </td>
                      <td>{timeStr}</td>
                      <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                        <button
                          className="row-action"
                          onClick={() => handleDelete(scan.id)}
                          title="Delete record from database"
                          style={{ cursor: 'pointer', padding: '4px' }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#718096')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > pageSize && (
          <div className="pagination">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} results
            </span>
            <div>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={currentPage === pageNum ? 'active' : ''}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
