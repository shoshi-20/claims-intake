import type {AIRiskLevel} from '../types';

interface AIRiskBadgeProps {
  riskLevel?: AIRiskLevel;
  onClick?: () => void;
}

const labelClassMap: Record<Exclude<AIRiskLevel, never>, string> = {
  Low: 'badge-success',
  Medium: 'badge-warning',
  High: 'badge-danger',
};

const AIRiskBadge: React.FC<AIRiskBadgeProps> = ({riskLevel, onClick}) => {
  if (!riskLevel) {
    return <span className='badge badge-unknown'>Not analyzed</span>;
  }

  const className = `badge ${labelClassMap[riskLevel]}`;

  if (!onClick) {
    return <span className={className}>{riskLevel}</span>;
  }

  return (
    <button type='button' className={`${className} ai-risk-badge-button`} onClick={onClick}>
      {riskLevel}⇓
    </button>
  );
};

export default AIRiskBadge;
