import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { generateCaptchaApi, verifyCaptchaApi } from '../../services/apiService';

interface CaptchaWidgetProps {
  onVerified: (captchaToken: string, userAnswer: string) => void;
  onReset?: () => void;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerified, onReset }) => {
  const [captchaData, setCaptchaData] = useState<{
    captcha_token: string;
    challenge_text: string;
    svg_data: string;
  } | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCaptcha = async () => {
    setLoading(true);
    setErrorMsg(null);
    setIsVerified(false);
    setAnswer('');
    if (onReset) onReset();
    try {
      const data = await generateCaptchaApi();
      if (data.success) {
        setCaptchaData(data);
      }
    } catch (err: any) {
      setErrorMsg('Failed to load CAPTCHA challenge.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleVerify = async () => {
    if (!captchaData || !answer.trim()) return;
    setVerifying(true);
    setErrorMsg(null);
    try {
      const res = await verifyCaptchaApi(captchaData.captcha_token, answer.trim());
      if (res.success && res.verified) {
        setIsVerified(true);
        onVerified(captchaData.captcha_token, answer.trim());
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect CAPTCHA answer.');
      setIsVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-purple-900/60 rounded-xl p-3.5 space-y-3 text-white shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Security CAPTCHA Verification</span>
        </div>
        <button
          type="button"
          onClick={loadCaptcha}
          disabled={loading || verifying}
          className="text-slate-400 hover:text-white transition p-1 cursor-pointer disabled:opacity-50"
          title="Refresh Challenge"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {captchaData && (
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg overflow-hidden border border-purple-800 shrink-0 bg-slate-950 flex items-center justify-center p-1"
            dangerouslySetInnerHTML={{ __html: captchaData.svg_data }}
          />
          <div className="flex-1 flex gap-1.5">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleVerify();
                }
              }}
              placeholder="Answer..."
              disabled={isVerified || verifying}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono text-center font-bold"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={!answer.trim() || isVerified || verifying}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                isVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#F01472] to-purple-600 text-white hover:opacity-90 disabled:opacity-50'
              }`}
            >
              {verifying ? '...' : isVerified ? 'Verified ✓' : 'Verify'}
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
