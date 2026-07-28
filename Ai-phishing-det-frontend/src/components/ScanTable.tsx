import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Trash2, LoaderCircle } from 'lucide-react'
import { Badge } from './ui'
import { api, type ScanResponse } from '../services/api'

function formatTime(dateStr?: string): string {
  if (!dateStr) return 'Just now'
  try {
    const d = new Date(dateStr)
    const diffMs = Date.now() - d.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hr ago`
    return d.toLocaleDateString()
  } catch {
    return dateStr
  }
}

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

function formatSource(inputType?: string): string {
  switch (inputType?.toUpperCase()) {
    case 'URL':
      return 'URL Scanner'
    case 'EMAIL':
      return 'Email Scanner'
    case 'SMS':
      return 'SMS Scanner'
    default:
      return 'Text Scanner'
  }
}

export function ScanTable({ scans: initialScans }: { scans?: ScanResponse[] }) {
  const [scans, setScans] = useState<ScanResponse[]>(initialScans || [])
  const [loading, setLoading] = useState(!initialScans)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const loadHistory = () => {
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
    if (initialScans) {
      setScans(initialScans)
      setLoading(false)
      return
    }
    loadHistory()
  }, [initialScans])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scan from database?')) {
      try {
        await api.deleteScan(id)
        setScans((prev) => prev.filter((s) => s.id !== id))
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Failed to delete scan')
      }
    }
  }

  // Filter scans based on search and risk filter
  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.originalInput.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.inputType.toLowerCase().includes(searchTerm.toLowerCase())

    const level = mapStatusToBadgeLevel(s.status)
    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'HIGH' && level === 'High') ||
      (riskFilter === 'MEDIUM' && level === 'Medium') ||
      (riskFilter === 'LOW' && level === 'Low')

    return matchesSearch && matchesRisk
  })

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filteredScans.length / pageSize))
  const paginatedScans = filteredScans.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      <div className="toolbar" style={{ padding: '0 21px', marginTop: '10px' }}>
        <div className="search">
          <Search size={16} />
          <input
            placeholder="Search scanned targets or sources..."
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
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Safe / Low Risk</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '30px', color: '#94a3b8' }}>
          <LoaderCircle className="spin" size={20} />
        </div>
      ) : paginatedScans.length === 0 ? (
        <div style={{ padding: '24px 21px', color: '#718096', fontSize: '12px', textAlign: 'center' }}>
          {scans.length === 0
            ? 'No scan history available yet. Run a scan from the URL, Email, or SMS scanner!'
            : 'No scans match your current filter criteria.'}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SCANNED TARGET</th>
                <th>SOURCE</th>
                <th>RISK SCORE</th>
                <th>RISK LEVEL</th>
                <th>TIME</th>
                <th style={{ textAlign: 'right', paddingRight: '16px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScans.map((scan) => {
                const level = mapStatusToBadgeLevel(scan.status)
                const source = formatSource(scan.inputType)
                const targetText =
                  scan.originalInput.length > 45 ? `${scan.originalInput.substring(0, 45)}...` : scan.originalInput

                return (
                  <tr key={scan.id}>
                    <td>
                      <b title={scan.originalInput}>{targetText}</b>
                    </td>
                    <td>{source}</td>
                    <td>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, color: '#e2e8f0' }}>
                        {scan.riskScore}/100
                      </span>
                    </td>
                    <td>
                      <Badge level={level}>{level}</Badge>
                    </td>
                    <td>{formatTime(scan.createdAt)}</td>
                    <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                      <button
                        className="row-action"
                        onClick={() => handleDelete(scan.id)}
                        title="Delete scan from database"
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

      {filteredScans.length > pageSize && (
        <div className="pagination" style={{ padding: '0 21px 14px' }}>
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredScans.length)} of {filteredScans.length} scans
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
    </div>
  )
}
