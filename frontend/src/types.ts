export enum ClaimStatus {
  PENDING = 'Pending',
  IN_REVIEW = 'In Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum ClaimType {
  AUTO = 'Auto',
  HOME = 'Home',
  HEALTH = 'Health',
}

export interface Claim {
  _id?: string;
  userId: string;
  claimantName: string;
  policyNumber: string;
  claimType: ClaimType;
  incidentDate: Date;
  description: string;
  documentKey?: string;
  status: ClaimStatus;
}
