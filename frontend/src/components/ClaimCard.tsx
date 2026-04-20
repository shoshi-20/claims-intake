import React from 'react';

interface ClaimCardProps {
  text: string;
  number: number;
}

const ClaimCard: React.FC<ClaimCardProps> = ({text, number}) => {
  return (
    <div className='claim-card'>
      <p className='claim-card-number'>{number}</p>
      <p className='claim-card-text'>{text}</p>
    </div>
  );
};

export default ClaimCard;
