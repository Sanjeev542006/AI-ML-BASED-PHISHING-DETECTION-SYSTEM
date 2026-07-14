import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={`card ${className}`}>{children}</section> }
export function Badge({ children, level = 'Low' }: { children: ReactNode; level?: string }) { return <span className={`badge ${level.toLowerCase()}`}>{children}</span> }
export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) { return <div className="page-title"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1></div>{children}</div> }
export function SelectButton({ children }: { children: ReactNode }) { return <button className="select">{children}<ChevronDown size={14}/></button> }
