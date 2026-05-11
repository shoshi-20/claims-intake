import mongoose from 'mongoose';
import {ClaimType, ClaimStatus, riskLevels, suggestedActions} from '../enums.js';

const Claim = new mongoose.Schema({
  userId: String,
  claimantName: String,
  policyNumber: String,
  claimType: {type: String, enum: Object.values(ClaimType)},
  incidentDate: Date,
  description: String,
  documentKey: String,
  aiAssessment: {
    riskLevel: {type: String, enum: Object.values(riskLevels)},
    riskFactors: {type: [String], default: []},
    completenessScore: Number,
    suggestedAction: {type: String, enum: Object.values(suggestedActions)},
    summary: String,
    analyzedAt: Date,
  },
  status: {type: String, default: ClaimStatus.Pending, enum: Object.values(ClaimStatus)},
  createdAt: {type: Date, default: Date.now},
});

export const ClaimModel = mongoose.model('Claim', Claim);
