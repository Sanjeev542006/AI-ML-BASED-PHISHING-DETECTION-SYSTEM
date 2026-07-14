import { ShieldAlert } from 'lucide-react'
import { NavLink } from 'react-router-dom'
export function NotFoundPage(){return <div className="not-found"><div className="brand-mark"><ShieldAlert/></div><h1>404</h1><h2>This page is protected, but unavailable.</h2><p>The page you requested could not be found.</p><NavLink className="button" to="/">Return to dashboard</NavLink></div>}
