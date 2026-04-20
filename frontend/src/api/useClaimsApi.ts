import {useContext} from 'react';
import {AuthContext} from '../context';
import {createClaim as createClaimRequest, getClaims as getClaimsRequest, getUploadUrl as getUploadUrlRequest} from './claims.api';
import type {Claim} from '../types';

const UNAUTHENTICATED = 'UNAUTHENTICATED';

export const useClaimsApi = () => {
  const {token} = useContext(AuthContext);

  const requireToken = () => {
    if (!token) {
      throw new Error(UNAUTHENTICATED);
    }
    return token;
  };

  return {
    getClaims: () => getClaimsRequest(requireToken()),
    createClaim: (claim: Claim) => createClaimRequest(claim, requireToken()),
    getUploadUrl: (fileName: string, fileType: string) => getUploadUrlRequest(fileName, fileType, requireToken()),
  };
};

export const isUnauthenticatedError = (error: unknown) => {
  return error instanceof Error && error.message === UNAUTHENTICATED;
};
