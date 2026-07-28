import { useState, type FormEvent } from 'react'
import { Activity, Bell, LockKeyhole, Moon, ShieldCheck, LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, PageHeader } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const tabs = [
  ['Profile', LockKeyhole],
  ['Appearance', Moon],
  ['Notifications', Bell],
  ['API status', Activity],
  ['About PhishShield', ShieldCheck],
] as const

export function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState(0)

  // Profile Form state
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passMessage, setPassMessage] = useState('')
  const [passError, setPassError] = useState('')
  const [savingPass, setSavingPass] = useState(false)

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    setProfileMessage('')
    setProfileError('')
    setSavingProfile(true)
    try {
      await api.updateProfile({ firstName, lastName })
      await refreshUser()
      setProfileMessage('Profile updated successfully.')
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPassMessage('')
    setPassError('')

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long')
      return
    }

    setSavingPass(true)
    try {
      await api.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setPassMessage('Password changed successfully.')
    } catch (err: unknown) {
      setPassError(err instanceof Error ? err.message : 'Failed to change password. Check your current password.')
    } finally {
      setSavingPass(false)
    }
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.email ? user.email.substring(0, 2).toUpperCase() : 'PS'
  }

  return (
    <>
      <PageHeader eyebrow="WORKSPACE" title="Settings" />

      <div className="settings-layout">
        <Card className="settings-nav">
          {tabs.map(([label, Icon], index) => (
            <button
              className={activeTab === index ? 'selected' : ''}
              key={label}
              onClick={() => setActiveTab(index)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </Card>

        <Card className="settings-content">
          {activeTab === 0 && (
            <>
              <h2>Profile settings</h2>
              <p>Manage your identity and workspace preferences.</p>

              <div className="profile">
                <div className="large-avatar">{getInitials()}</div>
                <div>
                  <b>
                    {user?.firstName} {user?.lastName}
                  </b>
                  <span>{user?.email}</span>
                  <span style={{ fontSize: '10px', color: '#60a5fa' }}>{user?.role}</span>
                </div>
              </div>

              {profileMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#14532d33', border: '1px solid #14532d', color: '#86efac', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginTop: '16px' }}>
                  <CheckCircle2 size={16} />
                  <span>{profileMessage}</span>
                </div>
              )}

              {profileError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#7f1d1d33', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginTop: '16px' }}>
                  <AlertCircle size={16} />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-grid">
                  <label>
                    First name
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </label>
                  <label>
                    Last name
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </label>
                  <label>
                    Work email
                    <input value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </label>
                  <label>
                    Role
                    <input value={user?.role || 'USER'} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </label>
                </div>
                <button type="submit" className="button" disabled={savingProfile}>
                  {savingProfile ? <LoaderCircle className="spin" size={16} /> : null}
                  {savingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </form>

              <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #293a54' }}>
                <h3 style={{ fontSize: '15px', color: '#e2e8f0', marginBottom: '8px' }}>Security & Password</h3>
                <p style={{ color: '#8292a9', fontSize: '12px', marginBottom: '16px' }}>Update your account password</p>

                {passMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#14532d33', border: '1px solid #14532d', color: '#86efac', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                    <CheckCircle2 size={16} />
                    <span>{passMessage}</span>
                  </div>
                )}

                {passError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#7f1d1d33', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                    <AlertCircle size={16} />
                    <span>{passError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword}>
                  <div className="form-grid">
                    <label>
                      Current Password
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                      />
                    </label>
                    <label>
                      New Password
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="••••••••"
                      />
                    </label>
                  </div>
                  <button type="submit" className="button secondary" disabled={savingPass}>
                    {savingPass ? <LoaderCircle className="spin" size={16} /> : null}
                    {savingPass ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab !== 0 && (
            <div style={{ padding: '20px 0', color: '#8292a9', fontSize: '13px' }}>
              Settings tab "{tabs[activeTab][0]}" active.
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
