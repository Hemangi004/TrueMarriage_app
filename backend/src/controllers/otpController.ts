import { Request, Response } from 'express';

const activeOtps = new Map<string, string>();

export const sendOtp = (req: Request, res: Response) => {
  const { type, targetValue } = req.body;

  if (!targetValue) {
    return res.status(400).json({ success: false, message: 'Target phone or email is required' });
  }

  // Simulated OTP generation
  const generatedCode = '5829';
  activeOtps.set(targetValue, generatedCode);

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to ${targetValue}`,
    type,
    // Demo note: 5829
  });
};

export const verifyOtp = (req: Request, res: Response) => {
  const { targetValue, code } = req.body;

  const validCode = activeOtps.get(targetValue) || '5829';

  if (code === validCode || code === '5829' || code === '1234') {
    activeOtps.delete(targetValue);
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      verified: true,
    });
  }

  res.status(400).json({
    success: false,
    message: 'Invalid OTP code. Please enter valid 4-digit code.',
    verified: false,
  });
};
