import React from 'react';

interface ClaimCardProps {
  text: string;
  number: number;
}

const ClaimCard: React.FC<ClaimCardProps> = ({text, number}) => {
  return (
    <div
      style={{
        border: '1px solid #000',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px',
        width: '200px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      }}
    >
      <h2>{number}</h2>
      <p>{text}</p>
    </div>
  );
};

export default ClaimCard;
