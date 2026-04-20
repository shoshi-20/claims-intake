import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
  const statusClassName = status.toLowerCase().replace(/\s+/g, '-');
  const knownStatuses = new Set(['pending', 'approved', 'in-review', 'rejected']);
  const badgeClassName = knownStatuses.has(statusClassName) ? `status-badge-${statusClassName}` : 'status-badge-unknown';

  return <div className={`status-badge ${badgeClassName}`}>{status}</div>;
};

export default StatusBadge;
