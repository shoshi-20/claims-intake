import {useEffect, useState, type ChangeEvent, type ComponentProps} from 'react';
import FormField from '../components/FormField';
import {ClaimStatus, ClaimType, type Claim, type DescriptionHints} from '../types';
import {useNavigate} from 'react-router-dom';
import FileInput from '../components/FileInput';
import {isUnauthenticatedError, useClaimsApi} from '../api/useClaimsApi';
import {useContext} from 'react';
import {AuthContext} from '../context';
import DescriptionHintsPanel from '../components/DescriptionHints';

const MIN_HINT_CHARACTERS = 50;
const HINT_DEBOUNCE_MS = 800;

const NewClaim = () => {
  const navigate = useNavigate();
  const {createClaim, getUploadUrl, checkDescriptionCompleteness} = useClaimsApi();
  const {currentUser} = useContext(AuthContext);

  const defaultClaim: Claim = {
    _id: '',
    userId: currentUser?.id || '',
    claimantName: '',
    policyNumber: '',
    claimType: ClaimType.AUTO,
    incidentDate: new Date(),
    description: '',
    status: ClaimStatus.PENDING,
  };

  const [claim, setClaim] = useState<Claim>(defaultClaim);
  const [document, setDocument] = useState<File | null>(null);
  const [hints, setHints] = useState<DescriptionHints | null>(null);
  const [isHintsLoading, setIsHintsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const description = claim.description?.trim() ?? '';
    if (description.length < MIN_HINT_CHARACTERS) {
      setHints(null);
      setIsHintsLoading(false);
      return;
    }

    let isCancelled = false;
    const timeout = setTimeout(async () => {
      try {
        setIsHintsLoading(true);
        const response = await checkDescriptionCompleteness(description, claim.claimType, claim.incidentDate.toISOString());
        if (!isCancelled) {
          setHints(response);
        }
      } catch (err) {
        if (!isCancelled) {
          setHints(null);
        }

        if (isUnauthenticatedError(err)) {
          navigate('/login');
          return;
        }

        console.error('Failed to check description completeness', err);
      } finally {
        if (!isCancelled) {
          setIsHintsLoading(false);
        }
      }
    }, HINT_DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [claim.description, claim.claimType, claim.incidentDate, checkDescriptionCompleteness, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: keyof Claim) => {
    if (field === 'documentKey' && e.target instanceof HTMLInputElement && e.target.files) {
      setDocument(e.target.files[0]);
      return;
    }
    const value = field === 'incidentDate' ? new Date(e.target.value) : e.target.value;
    setClaim({...claim, [field]: value});
  };

  const handleCancel = () => {
    setClaim(defaultClaim);
    setDocument(null);
    navigate('/claims');
  };

  const createNewClaim = async (newClaim: Claim) => {
    try {
      const response = await createClaim(newClaim);
      if (response?._id) {
        navigate('/claims');
        setClaim(defaultClaim);
        setDocument(null);
        setHints(null);
      } else {
        console.error('Failed to create claim');
      }
    } catch (err) {
      if (isUnauthenticatedError(err)) {
        navigate('/login');
        return;
      }
      throw err;
    }
  };

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();

    if (!claim.claimantName || !claim.policyNumber || !claim.claimType || !claim.incidentDate || !claim.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!currentUser?.id) {
        navigate('/login');
        return;
      }

      if (!document) {
        await createNewClaim(claim);
        return;
      }

      const fileName = document.name;
      const fileType = document.type;
      const {uploadUrl, key} = await getUploadUrl(fileName, fileType);

      if (!uploadUrl) throw new Error('Failed to get pre-signed URL');

      const uploadToAWSResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {'Content-Type': fileType},
        body: document,
      });

      if (!uploadToAWSResponse.ok) {
        throw new Error(`Failed to upload file to S3: ${uploadToAWSResponse.statusText}`);
      }

      const updatedClaim = {...claim, documentKey: key};
      await createNewClaim(updatedClaim);
    } catch (err) {
      if (isUnauthenticatedError(err)) {
        navigate('/login');
        return;
      }
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='new-claim-page'>
      <header className='new-claim-header'>
        <h1>New Claim</h1>
      </header>
      <form onSubmit={handleSubmit} className='new-claim-form'>
        <div className='new-claim-grid'>
          <FormField label='Claimant name' type='text' value={claim?.claimantName || ''} onChange={(e) => handleChange(e, 'claimantName')} />
          <FormField label='Policy number' type='text' value={claim?.policyNumber || ''} onChange={(e) => handleChange(e, 'policyNumber')} />
        </div>
        <div className='new-claim-grid'>
          <div className='form-field'>
            <label className='form-label' htmlFor='claim-type-field'>
              Claim type
            </label>
            <select id='claim-type-field' value={claim?.claimType || ''} onChange={(e) => handleChange(e, 'claimType')} className='form-select'>
              {Object.values(ClaimType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label='Incident Date'
            type='date'
            value={claim?.incidentDate.toISOString().split('T')[0] || ''}
            onChange={(e) => handleChange(e, 'incidentDate')}
          />
        </div>
        <FileInput file={document} setFile={setDocument} />
        <FormField label='Description' type='textarea' value={claim?.description || ''} onChange={(e) => handleChange(e, 'description')} />
        <DescriptionHintsPanel
          hints={hints}
          isLoading={isHintsLoading}
          minChars={MIN_HINT_CHARACTERS}
          currentLength={claim.description.trim().length}
        />
        <div className='new-claim-actions'>
          <button type='button' className='btn btn-secondary' onClick={handleCancel}>
            Cancel
          </button>
          <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting & analyzing...' : 'Submit claim'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewClaim;
