import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
  const statusClassName = status.toLowerCase().replace(/\s+/g, '-');
  const knownStatuses: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    'in-review': 'info',
    rejected: 'danger',
  };
  const badgeClassName = knownStatuses[statusClassName] ? `badge-${knownStatuses[statusClassName]}` : 'badge-unknown';

  return <div className={`badge ${badgeClassName}`}>{status}</div>;
};

export default StatusBadge;
