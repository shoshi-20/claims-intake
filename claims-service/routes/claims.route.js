import {Router} from 'express';
import {getClaims, createClaim, getClaimById, updateStatus, getUploadUrl, checkDescription} from '../controllers/claims.controller.js';

const router = Router();

router.get('', getClaims);
router.post('', createClaim);
router.post('/upload-url', getUploadUrl);
router.post('/check-description', checkDescription);
router.get('/:id', getClaimById);
router.patch('/:id/status', updateStatus);

export default router;
