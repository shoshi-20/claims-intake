import React, {useEffect} from 'react';
import type {Claim} from '../types';
import StatusBadge from '../components/StatusBadge';
import {useNavigate} from 'react-router-dom';
import ClaimCard from '../components/ClaimCard';
import {isUnauthenticatedError, useClaimsApi} from '../api/useClaimsApi';
import {useContext} from 'react';
import {AuthContext} from '../context';

const Claims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = React.useState<Claim[]>([]);
  const {getClaims} = useClaimsApi();
  const {currentUser, logout} = useContext(AuthContext);

  useEffect(() => {
    //fetch claims from backend and display them in a table
    const fetchClaims = async () => {
      try {
        const response = await getClaims();
        setClaims(response);
      } catch (error) {
        if (isUnauthenticatedError(error)) {
          navigate('/login');
          return;
        }
        console.error('Failed to fetch claims', error);
      }
    };
    fetchClaims();
  }, [getClaims, navigate]);

  return (
    <>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          position: 'sticky',
          top: 0,
        }}
      >
        <a style={{textDecoration: 'none', color: 'black', fontWeight: 'bold'}} href='#'>
          Claims Intake
        </a>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <p style={{marginRight: '10px'}}>{currentUser?.email ?? 'Unknown user'}</p>
          <button
            style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer'}}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </nav>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px'}}>
        <h1>All Claims</h1>
        <button
          onClick={() => navigate('/claims/new')}
          style={{backgroundColor: 'white', border: '1px solid gray', borderRadius: '8px', cursor: 'pointer', padding: '10px'}}
        >
          + New claim
        </button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', padding: '20px'}}>
        <ClaimCard text='Total claims' number={claims.length} />
        <ClaimCard text='Approved today' number={claims.filter((claim) => claim.status === 'Approved').length} />
        <ClaimCard text='Pending review' number={claims.filter((claim) => claim.status === 'Pending').length} />
      </div>
      <table style={{width: '100%', borderCollapse: 'collapse', padding: '20px'}}>
        <thead>
          <tr style={{borderBottom: '2px solid black', padding: '10px'}}>
            <th>ID</th>
            <th>Claimant</th>
            <th>Type</th>
            <th>Filed</th>
            <th>Description</th>
            <th>Status</th>
            <th>Document</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.policyNumber}>
              <td>#{claim._id}</td>
              <td>{claim.claimantName}</td>
              <td>{claim.claimType}</td>
              <td>{new Date(claim.incidentDate).toLocaleDateString()}</td>
              <td>{claim.description}</td>
              <td>
                <StatusBadge status={claim.status} />
              </td>
              <td>{claim.documentKey}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Claims;
