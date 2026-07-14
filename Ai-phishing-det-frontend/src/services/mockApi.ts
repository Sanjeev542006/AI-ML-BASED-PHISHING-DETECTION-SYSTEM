export type ScanResult = { risk: number; confidence: number; level: 'High' | 'Medium' | 'Low'; reasons: string[] }

const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms))
export const mockApi = {
  async getDashboardStats() { await delay(300); return { urls: 1248, emails: 684, sms: 392, blocked: 86 } },
  async analyzeURL(value: string) { await delay(); return { risk: value.includes('google') ? 18 : 87, confidence: 96, level: value.includes('google') ? 'Low' : 'High', reasons: ['Suspicious brand impersonation pattern', 'Domain registered recently', 'Known credential-harvesting infrastructure'], whois: 'Registered 11 days ago · Privacy protected', ssl: 'Valid certificate · expires in 244 days', redirects: 2, keywords: ['verify', 'account', 'urgent'] } as ScanResult & Record<string, unknown> },
  async analyzeEmail(): Promise<ScanResult & Record<string, unknown>> { await delay(); return { risk: 82, confidence: 94, level: 'High', reasons: ['Display name differs from sender domain', 'Urgent payment language detected', 'Malicious URL found in message body'], sender: 'Microsoft Billing <billing@micros0ft-secure.com>', subject: 'Action required: your subscription will expire', urls: ['https://micros0ft-billing.com/verify'] } },
  async analyzeSMS(): Promise<ScanResult & Record<string, unknown>> { await delay(); return { risk: 76, confidence: 91, level: 'High', reasons: ['Delivery impersonation detected', 'URL uses a shortened redirect chain', 'Requests personal information'], expandedUrl: 'https://track-delivery-verify.info/parcel' } },
}
