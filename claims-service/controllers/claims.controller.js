import dotenv from 'dotenv';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {ClaimModel} from '../models/claim.js';
import {ClaimStatus} from '../enums.js';

dotenv.config();

const getClaims = async (req, res) => {
  try {
    const claims = await ClaimModel.find();
    res.json(claims);
  } catch (err) {
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

const createClaim = async (req, res) => {
  try {
    const {userId, claimantName, policyNumber, claimType, incidentDate, description, documentKey} = req.body;
    if (
      // !userId ||
       !claimantName || !policyNumber || !claimType || !incidentDate || !description || !documentKey) {
      return res.status(400).json({error: 'All fields are required'});
    }

    const claim = new ClaimModel({userId, claimantName, policyNumber, claimType, incidentDate: new Date(incidentDate), description, documentKey});
    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

const getClaimById = async (req, res) => {
  try {
    const {id} = req.params;
    const claim = await ClaimModel.findById(id);
    if (!claim) return res.status(404).json({error: 'Claim not found'});
    res.json(claim);
  } catch (err) {
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

const updateStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;
    if (!Object.values(ClaimStatus).includes(status)) {
      return res.status(400).json({error: 'Invalid status'});
    }
    const claim = await ClaimModel.findById(id);
    if (!claim) return res.status(404).json({error: 'Claim not found'});
    claim.status = status;
    await claim.save();
    res.json(claim);
  } catch (err) {
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

const getUploadUrl = async (req, res) => {
  try {
    const {fileName, fileType} = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({error: 'fileName and fileType are required'});
    }

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
    });
    // const key = `claims/${req.user.id}/${Date.now()}-${fileName}`;
    // const key = `${process.env.AWS_BUCKET_NAME}/${fileName}`;
    const key = fileName;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {expiresIn: 3600});
    res.json({uploadUrl: uploadUrl, key: key});
  } catch (err) {
    res.status(500).json({error: `Server error: ${err.message}`});
  }
};

export {getClaims, createClaim, getClaimById, updateStatus, getUploadUrl};
