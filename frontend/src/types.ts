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

export type AIRiskLevel = 'Low' | 'Medium' | 'High';

export type AISuggestedAction = 'Fast-track' | 'Standard Review' | 'Flag for Investigation';

export interface AIAssessment {
  riskLevel: AIRiskLevel;
  riskFactors: string[];
  completenessScore: number;
  suggestedAction: AISuggestedAction;
  summary: string;
  analyzedAt: string;
}

export interface DescriptionHints {
  completeness: number;
  missing: string[];
  suggestions: string[];
  isReadyToSubmit: boolean;
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
  aiAssessment?: AIAssessment;
  status: ClaimStatus;
}
