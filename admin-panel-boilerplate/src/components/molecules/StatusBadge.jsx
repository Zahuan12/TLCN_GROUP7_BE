import { Badge } from '../ui/badge';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

/**
 * StatusBadge - Smart badge with color mapping based on status
 * 
 * @param {Object} props
 * @param {string} props.status - Status value (e.g., 'PENDING', 'APPROVED')
 * @param {string} props.className - Additional classes
 */
export default function StatusBadge({ status, className }) {
  if (!status) return null;

  const variant = STATUS_COLORS[status] || 'secondary';
  const label = STATUS_LABELS[status] || status;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

