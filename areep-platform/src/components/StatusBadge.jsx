import { STATUS_LABELS } from '../lib/constants'

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABELS[status] || status}</span>
}
