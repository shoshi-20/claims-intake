import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
  const statusColors: Record<string, {light: string; dark: string}> = {
    Pending: {light: 'lightyellow', dark: 'orange'},
    Approved: {light: 'lightgreen', dark: 'darkgreen'},
    'In review': {light: 'lightblue', dark: 'darkblue'},
    Rejected: {light: 'lightcoral', dark: 'darkred'},
  };
  return (
    <div
      style={{
        color: statusColors[status]?.dark || 'black',
        backgroundColor: statusColors[status]?.light || 'lightgray',
        padding: '4px',
        borderRadius: '4px',
        textAlign: 'center',
      }}
    >
      {status}
    </div>
  );
};

export default StatusBadge;
