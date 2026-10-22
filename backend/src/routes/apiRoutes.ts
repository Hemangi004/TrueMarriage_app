import { Router } from 'express';
import { saveBiodata, getBiodata, publishBiodata } from '../controllers/biodataController';
import { sendOtp, verifyOtp } from '../controllers/otpController';
import { generateAiContent } from '../controllers/aiController';

const router = Router();

// Biodata endpoints
router.post('/biodata', saveBiodata);
router.get('/biodata/:id', getBiodata);
router.post('/biodata/publish', publishBiodata);

// OTP Verification endpoints
router.post('/verify/otp/send', sendOtp);
router.post('/verify/otp/confirm', verifyOtp);

// AI Assistant endpoints
router.post('/ai/generate', generateAiContent);

export default router;
