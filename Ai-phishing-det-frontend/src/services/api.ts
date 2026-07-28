export interface User {
  id?: string
  firstName?: string
  lastName?: string
  email: string
  role?: string
  accountStatus?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: string
  email: string
  role: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

export interface ProfileResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  accountStatus: string
  createdAt?: string
  updatedAt?: string
}

export interface ScanAnalysisResponse {
  scanId: string
  riskScore: number
  status: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MALICIOUS'
  reasons: string[]
  confidence: number
}

export interface ScanResponse {
  id: string
  inputType: 'URL' | 'TEXT' | 'EMAIL' | 'SMS'
  originalInput: string
  status: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'MALICIOUS'
  riskScore: number
  processingTimeMs: number
  detectorType: string
  createdAt: string
  detectionResult?: {
    riskScore: number
    status: string
    reasons: string[]
    confidence: number
  }
}

export interface DashboardSummaryResponse {
  totalScans: number
  safe: number
  low: number
  medium: number
  high: number
  averageRisk: number
  averageProcessingTimeMs: number
  recentScans: ScanResponse[]
}

const API_BASE_URL = 'http://localhost:8080/api'

export function getAuthToken(): string | null {
  return localStorage.getItem('phishshield_access_token')
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('phishshield_refresh_token')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('phishshield_access_token', access)
  localStorage.setItem('phishshield_refresh_token', refresh)
}

export function clearTokens() {
  localStorage.removeItem('phishshield_access_token')
  localStorage.removeItem('phishshield_refresh_token')
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return {} as T
  }

  const json = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMsg = json.message || json.error || `HTTP ${response.status}`
    throw new Error(errorMsg)
  }

  return json as T
}

export const api = {
  // Auth
  async register(data: { firstName: string; lastName: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (res.data) setTokens(res.data.accessToken, res.data.refreshToken)
    return res.data
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (res.data) setTokens(res.data.accessToken, res.data.refreshToken)
    return res.data
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await request<void>('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        })
      } catch {
        // Ignore logout network errors
      }
    }
    clearTokens()
  },

  // User Profile
  async getProfile(): Promise<ProfileResponse> {
    const res = await request<ApiResponse<ProfileResponse>>('/user/profile')
    return res.data
  },

  async updateProfile(data: { firstName: string; lastName: string }): Promise<ProfileResponse> {
    const res = await request<ApiResponse<ProfileResponse>>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return res.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await request<void>('/user/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Scans
  async scanUrl(url: string): Promise<ScanAnalysisResponse> {
    const res = await request<ApiResponse<ScanAnalysisResponse>>('/scan/url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    })
    return res.data
  },

  async scanText(text: string): Promise<ScanAnalysisResponse> {
    const res = await request<ApiResponse<ScanAnalysisResponse>>('/scan/text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return res.data
  },

  async getHistory(): Promise<ScanResponse[]> {
    const res = await request<ApiResponse<ScanResponse[]>>('/scan/history')
    return res.data || []
  },

  async getScan(id: string): Promise<ScanResponse> {
    const res = await request<ApiResponse<ScanResponse>>(`/scan/${id}`)
    return res.data
  },

  async deleteScan(id: string): Promise<void> {
    await request<void>(`/scan/${id}`, { method: 'DELETE' })
  },

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const res = await request<ApiResponse<DashboardSummaryResponse>>('/dashboard/summary')
    return res.data
  },
}
