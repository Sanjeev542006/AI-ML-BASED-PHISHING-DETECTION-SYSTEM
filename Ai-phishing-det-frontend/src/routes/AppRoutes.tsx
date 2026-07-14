import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ScannerPage } from '../pages/ScannerPage'
import { IntelligencePage } from '../pages/IntelligencePage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
export function AppRoutes(){return <BrowserRouter><AppLayout><Routes><Route path="/" element={<DashboardPage/>}/><Route path="/url-scanner" element={<ScannerPage kind="URL"/>}/><Route path="/email-scanner" element={<ScannerPage kind="Email"/>}/><Route path="/sms-scanner" element={<ScannerPage kind="SMS"/>}/><Route path="/threat-intelligence" element={<IntelligencePage/>}/><Route path="/analytics" element={<AnalyticsPage/>}/><Route path="/reports" element={<IntelligencePage reports/>}/><Route path="/settings" element={<SettingsPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></AppLayout></BrowserRouter>}
