import {useCallback, useContext, useMemo} from 'react';
import {AuthContext} from '../context';
import {
  checkDescriptionCompleteness as checkDescriptionCompletenessRequest,
  createClaim as createClaimRequest,
  getClaims as getClaimsRequest,
  getUploadUrl as getUploadUrlRequest,
} from './claims.api';
import type {Claim, ClaimType} from '../types';

const UNAUTHENTICATED = 'UNAUTHENTICATED';

export const useClaimsApi = () => {
  const {token} = useContext(AuthContext);

  const requireToken = useCallback(() => {
    if (!token) {
      throw new Error(UNAUTHENTICATED);
    }
    return token;
  }, [token]);

  const getClaims = useCallback(() => getClaimsRequest(requireToken()), [requireToken]);

  const createClaim = useCallback((claim: Claim) => createClaimRequest(claim, requireToken()), [requireToken]);

  const getUploadUrl = useCallback((fileName: string, fileType: string) => getUploadUrlRequest(fileName, fileType, requireToken()), [requireToken]);

  const checkDescriptionCompleteness = useCallback(
    (description: string, claimType: ClaimType, incidentDate: string) =>
      checkDescriptionCompletenessRequest(description, claimType, incidentDate, requireToken()),
    [requireToken],
  );

  return useMemo(
    () => ({
      getClaims,
      createClaim,
      getUploadUrl,
      checkDescriptionCompleteness,
    }),
    [getClaims, createClaim, getUploadUrl, checkDescriptionCompleteness],
  );
};

export const isUnauthenticatedError = (error: unknown) => {
  return error instanceof Error && error.message === UNAUTHENTICATED;
};
