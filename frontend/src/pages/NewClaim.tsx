import React from 'react';
import FormField from '../components/FormField';
import {ClaimStatus, ClaimType, type Claim} from '../types';
import {useNavigate} from 'react-router-dom';
import FileInput from '../components/FileInput';
import {isUnauthenticatedError, useClaimsApi} from '../api/useClaimsApi';
import {useContext} from 'react';
import {AuthContext} from '../context';

const NewClaim = () => {
  const navigate = useNavigate();
  const {createClaim, getUploadUrl} = useClaimsApi();
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

  const [claim, setClaim] = React.useState<Claim>(defaultClaim);
  const [document, setDocument] = React.useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: keyof Claim) => {
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

  const handleSubmit: NonNullable<React.ComponentProps<'form'>['onSubmit']> = async (event) => {
    event.preventDefault();

    if (!claim.claimantName || !claim.policyNumber || !claim.claimType || !claim.incidentDate || !claim.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (!currentUser?.id) {
        navigate('/login');
        return;
      }

      if (!document) {
        createNewClaim(claim);
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
      createNewClaim(updatedClaim);
    } catch (err) {
      if (isUnauthenticatedError(err)) {
        navigate('/login');
        return;
      }
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
      return;
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
        <FormField label='Description' type='textarea' value={claim?.description || ''} onChange={(e) => handleChange(e, 'description')} />
        <FileInput file={document} setFile={setDocument} />
        <div className='new-claim-actions'>
          <button type='button' className='btn btn-secondary' onClick={handleCancel}>
            Cancel
          </button>
          <button type='submit' className='btn btn-primary'>
            Submit claim
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewClaim;
