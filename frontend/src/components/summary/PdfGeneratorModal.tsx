import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  FileText,
  Lock,
  PenTool,
  CheckCircle2,
  Printer,
  Sparkles,
  Download,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
} from 'lucide-react';
import type {
  PdfPaperSize,
  PdfOrientation,
  PdfResolution,
  DigitalSignatureConfig,
  PdfOptions,
} from '../../utils/pdfGenerator';
import { generateHighResPdf, downloadPdfBuffer } from '../../utils/pdfGenerator';
import { recordDownloadedTemplate } from '../../services/templateService';

interface PdfGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetElement: HTMLElement | null;
  candidateName?: string;
  profileId?: string | null;
  templateId?: string | null;
  templateName?: string | null;
}

export const PdfGeneratorModal: React.FC<PdfGeneratorModalProps> = ({
  isOpen,
  onClose,
  targetElement,
  candidateName = 'Biodata Candidate',
  profileId = null,
  templateId = null,
  templateName = null,
}) => {
  // Config State
  const [paperSize, setPaperSize] = useState<PdfPaperSize>('a4');
  const [orientation, setOrientation] = useState<PdfOrientation>('portrait');
  const [resolution, setResolution] = useState<PdfResolution>('ultra');

  // Print Ready State
  const [showCropMarks, setShowCropMarks] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const [customFooterText, setCustomFooterText] = useState('TrueMarriage Verified Biodata • Strictly Confidential');

  // Password Protection State
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Digital Signature State
  const [sigEnabled, setSigEnabled] = useState(true);
  const [sigType, setSigType] = useState<'stamp' | 'type' | 'upload' | 'draw'>('stamp');
  const [typedText, setTypedText] = useState(candidateName);
  const [uploadedSigUrl, setUploadedSigUrl] = useState<string | null>(null);
  const [drawnSigUrl, setDrawnSigUrl] = useState<string | null>(null);

  // Canvas ref for drawing signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Progress / Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'layout' | 'print' | 'security' | 'signature'>('layout');

  // Initialize Canvas context when switching to 'draw' tab
  useEffect(() => {
    if (sigType === 'draw' && canvasRef.current) {
      const cvs = canvasRef.current;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [sigType, activeTab]);

  if (!isOpen) return null;

  // Signature Canvas Helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const rect = cvs.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const rect = cvs.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    setDrawnSigUrl(canvasRef.current.toDataURL('image/png'));
  };

  const clearCanvas = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
    }
    setDrawnSigUrl(null);
  };

  const handleSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedSigUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate & Download PDF
  const handleGeneratePdf = async () => {
    if (!targetElement) {
      alert('Error: Preview element not ready for PDF rendering.');
      return;
    }

    if (enablePassword && !password.trim()) {
      alert('Please enter a password or disable Password Protection before exporting.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Capturing 300 DPI high-resolution canvas...');

    try {
      // Determine active image data url for signature
      let activeImgDataUrl: string | undefined = undefined;
      if (sigType === 'upload') activeImgDataUrl = uploadedSigUrl || undefined;
      if (sigType === 'draw') activeImgDataUrl = drawnSigUrl || undefined;

      const digitalSigConfig: DigitalSignatureConfig = {
        enabled: sigEnabled,
        type: sigType,
        typedText: typedText || candidateName,
        signerName: typedText || candidateName,
        imageDataUrl: activeImgDataUrl,
        verificationId: profileId || `TRUE-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      };

      const pdfOptions: PdfOptions = {
        paperSize,
        orientation,
        resolution,
        printReady: {
          showCropMarks,
          highContrastMode,
          showHeaderFooter,
          customFooterText,
        },
        passwordProtection: {
          enabled: enablePassword,
          password: enablePassword ? password : undefined,
        },
        digitalSignature: digitalSigConfig,
        profileId,
        candidateName,
      };

      setStatusMessage('Building encrypted PDF structure & digital stamp...');
      const pdfBytes = await generateHighResPdf(targetElement, pdfOptions);

      setStatusMessage('Finalizing document...');
      const sanitizeName = (candidateName || 'biodata').replace(/[^a-zA-Z0-9_\-]/g, '_');
      const filename = `truemarriage_Biodata_${sanitizeName}_${paperSize.toUpperCase()}_${orientation}.pdf`;

      downloadPdfBuffer(pdfBytes, filename);
      const targetTplId = templateId || localStorage.getItem('last_used_template_id') || localStorage.getItem('selected_template_id');
      const targetTplName = templateName || localStorage.getItem('last_used_template_name');
      if (targetTplId) {
        recordDownloadedTemplate(targetTplId, targetTplName || undefined);
      }
      setStatusMessage('PDF Downloaded successfully!');
      setTimeout(() => {
        setIsGenerating(false);
        setStatusMessage(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('PDF Generation failed:', err);
      alert(`Failed to generate PDF: ${err?.message || err}`);
      setIsGenerating(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100002] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-rose-50/50 via-purple-50/30 to-pink-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                High Resolution PDF Generator
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Configure resolution, A4/Letter size, portrait/landscape, print mode & digital signature
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100:bg-gray-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'layout', label: 'Paper & Resolution', icon: FileText },
            { id: 'print', label: 'Print Ready', icon: Printer },
            { id: 'security', label: 'Password Protection', icon: Lock },
            { id: 'signature', label: 'Digital Signature', icon: PenTool },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-rose-600 text-rose-600 bg-white shadow-xs'
                    : 'border-transparent text-gray-500 hover:text-gray-800:text-gray-300'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* TAB 1: PAPER & RESOLUTION */}
          {activeTab === 'layout' && (
            <div className="space-y-5">
              {/* Resolution selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  1. Resolution & Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'ultra', label: '300 DPI (Ultra HD)', badge: 'Recommended', desc: 'Vector sharp printing' },
                    { id: 'high', label: '200 DPI (High Res)', badge: 'Balanced', desc: 'Optimized file size' },
                    { id: 'standard', label: '100 DPI (Standard)', badge: 'Compact', desc: 'Fast rendering' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setResolution(res.id as any)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        resolution === res.id
                          ? 'border-rose-600 bg-rose-50/40 text-rose-600'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black">{res.label}</span>
                        {resolution === res.id && <CheckCircle2 size={14} className="text-rose-600" />}
                      </div>
                      <span className="text-[10px] text-gray-400 block">{res.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Size selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  2. Paper Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'a4', label: 'A4 Paper', dims: '210 × 297 mm', badge: 'Standard International' },
                    { id: 'letter', label: 'Letter Size', dims: '8.5 × 11 inches', badge: 'US & Canada Standard' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaperSize(p.id as any)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                        paperSize === p.id
                          ? 'border-rose-600 bg-rose-50/40'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-extrabold text-gray-900">{p.label}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{p.dims} • {p.badge}</div>
                      </div>
                      {paperSize === p.id && <CheckCircle2 size={16} className="text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  3. Orientation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'portrait', label: 'Portrait (Vertical)', icon: '📄', desc: 'Standard single / dual column vertical' },
                    { id: 'landscape', label: 'Landscape (Horizontal)', icon: '📑', desc: 'Wide horizontal layout spread' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOrientation(o.id as any)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                        orientation === o.id
                          ? 'border-rose-600 bg-rose-50/40'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{o.icon}</span>
                        <div>
                          <div className="text-xs font-extrabold text-gray-900">{o.label}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{o.desc}</div>
                        </div>
                      </div>
                      {orientation === o.id && <CheckCircle2 size={16} className="text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRINT READY */}
          {activeTab === 'print' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-amber-800">
                <Printer className="w-5 h-5 shrink-0 text-amber-600" />
                <span>
                  Print Ready features prepare your PDF document for high-volume commercial print shops or home printers.
                </span>
              </div>

              {/* Crop Marks Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-white">
                <div>
                  <div className="text-xs font-bold text-gray-900">Crop & Bleed Marks</div>
                  <div className="text-[11px] text-gray-400">Adds corner crop indicators for precision cutting</div>
                </div>
                <input
                  type="checkbox"
                  checked={showCropMarks}
                  onChange={(e) => setShowCropMarks(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 cursor-pointer"
                />
              </div>

              {/* High Contrast Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-white">
                <div>
                  <div className="text-xs font-bold text-gray-900">High-Contrast Monochrome Print Mode</div>
                  <div className="text-[11px] text-gray-400">Enforces solid white background & high contrast text for clear printing</div>
                </div>
                <input
                  type="checkbox"
                  checked={highContrastMode}
                  onChange={(e) => setHighContrastMode(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Header & Footer Page Numbers Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-white">
                <div>
                  <div className="text-xs font-bold text-gray-900">Header & Footer Metadata</div>
                  <div className="text-[11px] text-gray-400">Prints Profile ID header, page numbering & timestamp footer</div>
                </div>
                <input
                  type="checkbox"
                  checked={showHeaderFooter}
                  onChange={(e) => setShowHeaderFooter(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 cursor-pointer"
                />
              </div>

              {showHeaderFooter && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Custom Footer Text
                  </label>
                  <input
                    type="text"
                    value={customFooterText}
                    onChange={(e) => setCustomFooterText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="e.g. TrueMarriage Certified • Strictly Confidential"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PASSWORD PROTECTION */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-purple-200 bg-purple-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Lock size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-purple-950">
                      AES Encrypted PDF Password Protection
                    </div>
                    <div className="text-[11px] text-purple-700">
                      Prevents unauthorized viewing or opening of your matrimonial details
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              {enablePassword && (
                <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3 animate-fadeIn">
                  <label className="block text-xs font-bold text-gray-700">
                    Set PDF Open Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter strong password (e.g. Secret123)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-xs text-gray-900 pr-10 focus:outline-none focus:border-rose-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                    <ShieldCheck size={12} />
                    Anyone opening this PDF will be prompted to enter this password.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIGITAL SIGNATURE */}
          {activeTab === 'signature' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <PenTool size={16} className="text-rose-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Enable Digital Signature / Verification</div>
                    <div className="text-[11px] text-gray-400">Embed signature or cryptographic verification stamp on PDF</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sigEnabled}
                  onChange={(e) => setSigEnabled(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 cursor-pointer"
                />
              </div>

              {sigEnabled && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Signature Type Pills */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'stamp', label: 'Verified Stamp', icon: '🛡️' },
                      { id: 'type', label: 'Typed Script', icon: '✍️' },
                      { id: 'upload', label: 'Upload Image', icon: '🖼️' },
                      { id: 'draw', label: 'Draw Pad', icon: '🎨' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSigType(type.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          sigType === type.id
                            ? 'border-rose-600 bg-rose-50 text-rose-600 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-base">{type.icon}</div>
                        <div className="text-[11px]">{type.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Stamp Option */}
                  {sigType === 'stamp' && (
                    <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 text-xs space-y-2">
                      <div className="font-extrabold text-rose-600 flex items-center gap-1.5">
                        <CheckCircle2 size={15} />
                        Automated System Cryptographic Verification Stamp
                      </div>
                      <p className="text-gray-600 text-[11px]">
                        Embeds a official verification stamp containing your Candidate Name ({candidateName}), Profile ID ({profileId || 'TRUE-AUTOSIG'}), and today's verification timestamp.
                      </p>
                    </div>
                  )}

                  {/* Typed Script Option */}
                  {sigType === 'type' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700">
                        Type Signature Name
                      </label>
                      <input
                        type="text"
                        value={typedText}
                        onChange={(e) => setTypedText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-[#1E3A8A] font-serif text-lg italic bg-gray-50 focus:outline-none focus:border-rose-600"
                        placeholder="e.g. Ananya Sharma"
                      />
                    </div>
                  )}

                  {/* Upload Image Option */}
                  {sigType === 'upload' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-gray-700">
                        Upload Signature PNG/JPEG File
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureFileUpload}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 cursor-pointer"
                      />
                      {uploadedSigUrl && (
                        <div className="p-2 border border-gray-200 rounded-xl max-w-[200px] bg-white">
                          <img src={uploadedSigUrl} alt="Signature Preview" className="max-h-16 mx-auto object-contain" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Draw Signature Option */}
                  {sigType === 'draw' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700">
                          Draw Signature on Touch/Mouse Pad
                        </label>
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-bold"
                        >
                          <RotateCcw size={12} /> Clear
                        </button>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={120}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-28 touch-none cursor-crosshair"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
            <Zap size={13} className="text-amber-500" />
            <span>Format: <b>{paperSize.toUpperCase()}</b> • <b>{orientation.toUpperCase()}</b> • <b>{resolution.toUpperCase()}</b></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGeneratePdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-extrabold shadow-md shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Generate & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="bg-rose-50 border-t border-rose-100 text-rose-900 px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F01472]" />
              <span>{statusMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
