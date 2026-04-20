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
    <main className='claims-page'>
      <nav className='claims-nav'>
        <a className='claims-brand' href='#'>
          Claims Intake
        </a>
        <div className='claims-user'>
          <p className='claims-user-email'>{currentUser?.email ?? 'Unknown user'}</p>
          <button
            type='button'
            className='claims-logout'
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </nav>
      <div className='claims-header'>
        <h1>All Claims</h1>
        <button type='button' className='btn btn-secondary' onClick={() => navigate('/claims/new')}>
          + New claim
        </button>
      </div>
      <div className='claims-cards'>
        <ClaimCard text='Total claims' number={claims.length} />
        <ClaimCard text='Approved today' number={claims.filter((claim) => claim.status === 'Approved').length} />
        <ClaimCard text='Pending review' number={claims.filter((claim) => claim.status === 'Pending').length} />
      </div>
      <div className='claims-table-shell'>
        <table className='claims-table'>
          <thead>
            <tr>
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
                <td>#{claim.policyNumber}</td>
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
      </div>
    </main>
  );
};

export default Claims;
