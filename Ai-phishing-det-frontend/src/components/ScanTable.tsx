import { MoreHorizontal } from 'lucide-react'
import { Badge } from './ui'
const scans=[['secure-paypal-verification.com','URL Scanner','High','2 min ago'],['Invoice payment request','Email Scanner','High','18 min ago'],['Your parcel is waiting','SMS Scanner','Medium','42 min ago'],['accounts.google.com','URL Scanner','Low','1 hr ago']]
export function ScanTable(){return <div className="table-wrap"><table><thead><tr><th>SCANNED TARGET</th><th>SOURCE</th><th>RISK</th><th>TIME</th><th/></tr></thead><tbody>{scans.map(([target,source,risk,time])=><tr key={target}><td><b>{target}</b></td><td>{source}</td><td><Badge level={risk}>{risk}</Badge></td><td>{time}</td><td><button className="row-action"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div>}
