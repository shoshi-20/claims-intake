import type {AIAssessment} from '../types';

interface AIAssessmentPanelProps {
  assessment: AIAssessment;
}

const AIAssessmentPanel: React.FC<AIAssessmentPanelProps> = ({assessment}) => {
  return (
    <section className='ai-assessment-panel'>
      <p className='ai-assessment-summary'>{assessment.summary}</p>
      <div className='ai-assessment-details'>
        <div>
          <h4>Risk factors</h4>
          {assessment.riskFactors.length > 0 ? (
            <ul className='ai-assessment-list'>
              {assessment.riskFactors.map((factor, index) => (
                <li key={`${factor}-${index}`}>{factor}</li>
              ))}
            </ul>
          ) : (
            <p>No specific risk factors flagged.</p>
          )}
        </div>
        <div>
          <h4>Suggested action</h4>
          <p>{assessment.suggestedAction}</p>
        </div>
        <div>
          <h4>Completeness score</h4>
          <p>{assessment.completenessScore}%</p>
        </div>
        <div>
          <h4>Analyzed</h4>
          <p>{new Date(assessment.analyzedAt).toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
};

export default AIAssessmentPanel;
