import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
import {
  X,
  QrCode,
  Check,
  Download,
  Share2,
  MapPin,
  Briefcase,
  Loader2,
} from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  slugOrId: string;
  profilePictureUrl?: string;
  age?: number | string;
  location?: string;
  profession?: string;
}

// Utility to draw rounded rectangles on HTML5 Canvas
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

// Safely load an image with CORS anonymous headers
const loadImage = (url: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
};

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  displayName,
  slugOrId,
  profilePictureUrl,
  age,
  location,
  profession,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const publicProfileUrl = `${baseUrl}/${slugOrId || 'profile'}`;
  const qrTargetUrl = `${publicProfileUrl}?ref=qr_scan`;

  // High-res QR Code API generators
  const primaryQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&format=png&data=${encodeURIComponent(
    qrTargetUrl
  )}`;
  const fallbackQrUrl = `https://quickchart.io/qr?size=400&margin=2&text=${encodeURIComponent(
    qrTargetUrl
  )}`;
  const qrImageUrl = imgError ? fallbackQrUrl : primaryQrUrl;

  const displayAge = age
    ? String(age).toLowerCase().includes('yr')
      ? String(age)
      : `${age} Yrs`
    : '';

  const initials = displayName
    ? displayName
        .split(' ')
        .map((s) => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'TM';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
    } catch (e) {
      // Fallback
    }
  };

  const handleDownloadPlainQR = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `truemarriage_Plain_QR_${slugOrId || 'profile'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(qrImageUrl, '_blank');
    }
  };

  // Downloads the exact horizontal card preview shown on screen
  const handleDownloadQRCard = async () => {
    setIsGenerating(true);
    try {
      if (cardRef.current) {
        const dataUrl = await toPng(cardRef.current, {
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: '#ffffff',
        });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `truemarriage_Card_${(displayName || 'candidate').replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    } catch (err) {
      console.warn('html-to-image capture failed, using canvas fallback:', err);
    }

    // Direct Canvas Fallback with the exact same horizontal card layout
    try {
      const canvas = document.createElement('canvas');
      const width = 840;
      const height = 440;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        handleDownloadPlainQR();
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Background Fill with luxury white and card border
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 30);
      ctx.fill();

      ctx.strokeStyle = '#FFE4E6';
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 30);
      ctx.stroke();

      // Divider line between left and right
      const dividerX = 330;
      ctx.strokeStyle = '#FFE4E6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dividerX, 36);
      ctx.lineTo(dividerX, height - 36);
      ctx.stroke();

      // ──────────────────────────────────────────
      // LEFT SIDE: Logo, QR Code & Callout
      // ──────────────────────────────────────────
      const leftCenterX = dividerX / 2; // 165px

      // Logo icon
      const logoY = 46;
      const logoSize = 24;
      const logoX = leftCenterX - 56;
      ctx.fillStyle = '#F01472';
      drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 6);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TM', logoX + logoSize / 2, logoY + logoSize / 2);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TrueMarriage.in', logoX + logoSize + 8, logoY + logoSize / 2);

      // QR Code Box
      const qrBoxSize = 172;
      const qrBoxX = leftCenterX - qrBoxSize / 2;
      const qrBoxY = logoY + 38;

      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16);
      ctx.stroke();

      let qrImg: HTMLImageElement | null = null;
      try {
        qrImg = await loadImage(qrImageUrl);
      } catch (e) {}

      if (qrImg && qrImg.width > 0) {
        ctx.drawImage(qrImg, qrBoxX + 10, qrBoxY + 10, qrBoxSize - 20, qrBoxSize - 20);

        // Centered TM Badge
        const centerR = 14;
        ctx.beginPath();
        ctx.arc(qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize / 2, centerR, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#F01472';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#F01472';
        ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TM', qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize / 2);
      }

      // Scan Instructions
      const promptY = qrBoxY + qrBoxSize + 24;
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Scan to view biodata', leftCenterX, promptY);

      // Monospace URL (auto-scaled to never overflow or get cut off)
      const linkY = promptY + 20;
      ctx.fillStyle = '#E11D48';
      let urlFontSize = 11;
      ctx.font = `bold ${urlFontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      while (ctx.measureText(publicProfileUrl).width > 290 && urlFontSize > 7.5) {
        urlFontSize -= 0.5;
        ctx.font = `bold ${urlFontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      }
      ctx.fillText(publicProfileUrl, leftCenterX, linkY);

      // ──────────────────────────────────────────
      // RIGHT SIDE: Photo & Info
      // ──────────────────────────────────────────
      const rightStartX = dividerX + 35;
      const photoW = 144;
      const photoH = 180; // 4:5 aspect ratio
      const photoX = rightStartX;
      const photoY = 130;

      let candidateImg: HTMLImageElement | null = null;
      if (profilePictureUrl) {
        try {
          candidateImg = await loadImage(profilePictureUrl);
        } catch (e) {}
      }

      ctx.save();
      drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 18);
      ctx.clip();

      if (candidateImg && candidateImg.width > 0) {
        const imgW = candidateImg.naturalWidth || candidateImg.width;
        const imgH = candidateImg.naturalHeight || candidateImg.height;
        const srcAspect = imgW / imgH;
        const dstAspect = photoW / photoH;
        let sx = 0, sy = 0, sWidth = imgW, sHeight = imgH;
        if (srcAspect > dstAspect) {
          sWidth = imgH * dstAspect;
          sx = (imgW - sWidth) / 2;
        } else {
          sHeight = imgW / dstAspect;
          sy = (imgH - sHeight) / 2;
        }
        ctx.drawImage(candidateImg, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);
      } else {
        ctx.fillStyle = '#FFE4E6';
        ctx.fillRect(photoX, photoY, photoW, photoH);
        ctx.fillStyle = '#E11D48';
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, photoX + photoW / 2, photoY + photoH / 2);
      }
      ctx.restore();

      // Photo white border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 18);
      ctx.stroke();

      // Green checkmark circle on photo
      const badgeX = photoX + photoW - 12;
      const badgeY = photoY + photoH - 12;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#059669';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(badgeX - 5, badgeY);
      ctx.lineTo(badgeX - 1, badgeY + 4);
      ctx.lineTo(badgeX + 6, badgeY - 4);
      ctx.stroke();

      // Candidate Text Details (to the right of photo)
      const textStartX = photoX + photoW + 24;
      let curTextY = photoY + 28;

      // Candidate Name
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(displayName, textStartX, curTextY);

      // Age Line
      if (displayAge) {
        curTextY += 26;
        ctx.font = '600 15px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(`${displayAge} •`, textStartX, curTextY);
      }

      // Location Line
      if (location) {
        curTextY += 24;
        ctx.font = '600 15px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(`📍  ${location}`, textStartX, curTextY);
      }

      // Profession Line
      if (profession) {
        curTextY += 24;
        ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#BE123C';
        ctx.fillText(`💼  ${profession}`, textStartX, curTextY);
      }

      // Divider line
      curTextY += 24;
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(textStartX, curTextY);
      ctx.lineTo(width - 40, curTextY);
      ctx.stroke();

      curTextY += 18;
      ctx.font = '500 12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Direct contact • TrueMarriage.in', textStartX, curTextY);

      // Download file as PNG
      canvas.toBlob((blob) => {
        if (!blob) {
          handleDownloadPlainQR();
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `truemarriage_Card_${(displayName || 'candidate').replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 'image/png');
    } catch (err) {
      console.error('Fallback canvas generation failed:', err);
      handleDownloadPlainQR();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName}'s Matrimonial Biodata`,
          text: `Check out ${displayName}'s verified matrimonial profile & biodata on TrueMarriage:`,
          url: publicProfileUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100010] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 leading-snug">
                Verified Biodata QR Card
              </h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Horizontal print card with QR code on left & candidate info on right
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Card Preview Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60 flex flex-col items-center">
          {/* Aesthetic Horizontal Card Preview Frame */}
          <div className="w-full overflow-x-auto flex justify-center py-1">
            <div
              ref={cardRef}
              className="w-[520px] sm:w-[560px] shrink-0 bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-100 shadow-xl relative"
            >
              <div className="grid grid-cols-12 gap-5 items-center">
                
                {/* LEFT SIDE: QR Code */}
                <div className="col-span-5 flex flex-col items-center text-center space-y-2.5 border-r border-rose-100 pr-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center font-bold text-[9px]">
                      TM
                    </div>
                    <span className="font-black text-xs text-slate-900">
                      TrueMarriage.in
                    </span>
                  </div>

                  <div className="relative p-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <img
                      src={qrImageUrl}
                      alt={`QR Code for ${displayName}`}
                      crossOrigin="anonymous"
                      onError={() => setImgError(true)}
                      className="w-36 h-36 rounded-xl object-contain bg-white"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-6 h-6 rounded-full bg-white border border-[#F01472] shadow-sm flex items-center justify-center text-[#F01472] font-black text-[8px]">
                        TM
                      </div>
                    </div>
                  </div>

                  <div className="space-y-0.5 w-full">
                    <p className="text-[11px] text-slate-700 font-bold">
                      Scan to view biodata
                    </p>
                    <p
                      className="text-[9.5px] text-rose-600 font-mono font-semibold break-all leading-tight max-w-full text-center px-1 notranslate"
                      translate="no"
                    >
                      {publicProfileUrl}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE: Candidate Photo & Info */}
                <div className="col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-3.5">
                    {/* Candidate 4:5 Portrait Photo */}
                    <div className="relative w-28 aspect-[4/5] shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gradient-to-br from-rose-100 to-purple-100 ring-2 ring-rose-200/60">
                      {profilePictureUrl ? (
                        <img
                          src={profilePictureUrl}
                          alt={displayName}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-rose-500 font-extrabold text-xl">
                          {initials}
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </div>

                    {/* Candidate Details */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-black text-base sm:text-lg text-slate-900 leading-tight truncate">
                        {displayName}
                      </h4>

                      <div className="space-y-1 text-xs">
                        {displayAge && (
                          <p className="font-semibold text-slate-600">
                            {displayAge} •
                          </p>
                        )}
                        {location && (
                          <p className="font-semibold text-slate-600 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">{location}</span>
                          </p>
                        )}
                        {profession && (
                          <p className="font-bold text-[#BE123C] flex items-center gap-1.5 truncate">
                            <Briefcase className="w-3 h-3 shrink-0" />
                            <span className="truncate">{profession}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                        <span>Direct contact • TrueMarriage.in</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[580px] space-y-2 pt-1">
            {/* Primary Button: Download Horizontal QR Card */}
            <button
              type="button"
              onClick={handleDownloadQRCard}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#F01472] via-[#E11D48] to-[#C80E5A] hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating QR...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download QR</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[#F01472] font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Online Biodata</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
