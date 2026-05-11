import type {DescriptionHints as DescriptionHintsType} from '../types';

interface DescriptionHintsProps {
  hints: DescriptionHintsType | null;
  isLoading: boolean;
  minChars: number;
  currentLength: number;
}

const DescriptionHints: React.FC<DescriptionHintsProps> = ({hints, isLoading, minChars, currentLength}) => {
  if (currentLength < minChars) {
    return <p className='description-hints-empty'>Add at least {minChars} characters to get AI feedback.</p>;
  }

  if (isLoading) {
    return <p className='description-hints-loading'>Analyzing description quality...</p>;
  }

  if (!hints) {
    return null;
  }

  return (
    <section className='description-hints'>
      <div className='description-hints-header'>
        <h3>AI description feedback</h3>
        <span className='description-hints-score'>{hints.completeness}% complete</span>
      </div>
      <div className='description-hints-bar'>
        <div className='description-hints-bar-fill' style={{width: `${hints.completeness}%`}} />
      </div>
      <p className={hints.isReadyToSubmit ? 'description-hints-ready' : 'description-hints-not-ready'}>
        {hints.isReadyToSubmit ? 'Looks ready to submit.' : 'Add more details before submitting.'}
      </p>
      {hints.missing.length > 0 && (
        <div>
          <h4>Missing details</h4>
          <ul className='description-hints-list'>
            {hints.missing.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {hints.suggestions.length > 0 && (
        <div>
          <h4>Suggestions</h4>
          <ul className='description-hints-list'>
            {hints.suggestions.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default DescriptionHints;
