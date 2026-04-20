import React from 'react';
import FormField from '../components/FormField';
import {ClaimStatus, ClaimType, type Claim} from '../types';
import {useNavigate} from 'react-router-dom';
import {createClaim, getUploadUrl} from '../api/claimsApi';
import FileInput from '../components/FileInput';

const NewClaim = () => {
  const defaultClaim: Claim = {
    id: '',
    userId: '',
    claimantName: '',
    policyNumber: '',
    claimType: ClaimType.AUTO,
    incidentDate: new Date(),
    description: '',
    status: ClaimStatus.PENDING,
  };
  const navigate = useNavigate();
  const [claim, setClaim] = React.useState<Claim>(defaultClaim);
  const [document, setDocument] = React.useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Claim) => {
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
    const response = await createClaim(newClaim);
    // eslint-disable-next-line no-debugger
    debugger;
    if (response?._id) {
      navigate('/claims');
      setClaim(defaultClaim);
      setDocument(null);
    } else {
      console.error('Failed to create claim');
    }
  };

  const handleSubmit = async () => {
    // eslint-disable-next-line no-debugger
    debugger;
    if (!claim.claimantName || !claim.policyNumber || !claim.claimType || !claim.incidentDate || !claim.description) {
      alert('Please fill in all required fields');
      return;
    }
    try {
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
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
      return;
    }
  };

  return (
    <div>
      <h1>New Claim</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #000',
          borderRadius: '8px',
          padding: '20px',
          margin: '0 auto',
        }}
      >
        <div style={{display: 'flex', gap: '20px', width: '100%'}}>
          <FormField label='Claimant name' type='text' value={claim?.claimantName || ''} onChange={(e) => handleChange(e, 'claimantName')} />
          <FormField label='Policy number' type='text' value={claim?.policyNumber || ''} onChange={(e) => handleChange(e, 'policyNumber')} />
        </div>
        <div style={{display: 'flex', gap: '20px', width: '100%'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginBottom: '15px',
              width: '100%',
            }}
          >
            <label>Claim type</label>
            <select
              value={claim?.claimType || ''}
              onChange={(e) => handleChange(e, 'claimType')}
              style={{border: '1px solid #000', borderRadius: '4px', padding: '8px', width: '100%'}}
            >
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
        {/* <FormField
          label='Attach supporting document'
          type='file'
          value=''
          onChange={(e) => handleChange(e, 'documentKey')}
          inputStyle={{border: 'dashed'}}
        /> */}
        <FileInput file={document} setFile={setDocument} />
        <div style={{display: 'flex', gap: '20px', alignSelf: 'flex-end'}}>
          <button
            onClick={handleCancel}
            style={{backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Cancel
          </button>
          <button
            type='submit'
            style={{backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Submit claim
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewClaim;
