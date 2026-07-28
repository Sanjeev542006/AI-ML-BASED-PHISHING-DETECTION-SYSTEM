import { useState, type ReactNode } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Search, ShieldCheck, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { navigation } from '../constants/navigation'
import { useAuth } from '../context/AuthContext'

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.email ? user.email.substring(0, 2).toUpperCase() : 'PS'
  }

  const getDisplayName = () => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }
    return user?.email || 'User'
  }

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={close} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={22} color="white" />
          </div>
          <span>PhishShield</span>
          <small>AI</small>
          <button className="mobile-close" onClick={close}>
            <X />
          </button>
        </div>
        <div className="workspace">
          <span>WORKSPACE</span>
          <button>
            Security Operations <ChevronDown size={14} />
          </button>
        </div>
        <nav>
          {navigation.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={close}>
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Threat Intelligence' && <i>3</i>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
              <div className="avatar">{getInitials()}</div>
              <div style={{ minWidth: 0 }}>
                <b style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{getDisplayName()}</b>
                <span style={{ fontSize: '10px', color: '#718096' }}>{user?.role || 'User'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'none',
                border: 0,
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'grid',
                placeItems: 'center',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const title = navigation.find((item) => item[1] === location.pathname)?.[0] ?? 'Workspace'

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.email ? user.email.substring(0, 2).toUpperCase() : 'PS'
  }

  return (
    <div className="app">
      <Sidebar open={open} close={() => setOpen(false)} />
      <main>
        <header>
          <button className="menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div className="crumb">
            Security Operations <span>/</span>
            <b>{title}</b>
          </div>
          <div className="header-actions">
            <button>
              <Search size={19} />
            </button>
            <button className="notification">
              <Bell size={19} />
              <i />
            </button>
            <div className="header-avatar">{getInitials()}</div>
          </div>
        </header>
        <div className="content">{children}</div>
        <footer>© 2026 PhishShield AI • AI-powered protection for a safer web</footer>
      </main>
    </div>
  )
}
