import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  Printer,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { fetchLegalDoc, type LegalTabType, type LegalDocResult } from '../../services/legalDocService';

export interface BaseLegalDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: LegalTabType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeLabel?: string;
  rawFileUrl: string;
}

export const BaseLegalDocModal: React.FC<BaseLegalDocModalProps> = ({
  isOpen,
  onClose,
  docType,
  title,
  subtitle,
  icon,
  rawFileUrl,
}) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<LegalDocResult | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const lastUpdated = useMemo(() => {
    if (!doc?.content) return null;
    const match = doc.content.match(/last updated:\s*([^\r\n<]+)/i);
    return match ? `Last Updated: ${match[1].trim()}` : null;
  }, [doc]);

  // Keyboard close (ESC) & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load document whenever docType changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchLegalDoc(docType)
      .then((data) => {
        if (isMounted) {
          setDoc(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load document.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, docType]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchLegalDoc(docType, true)
      .then((data) => {
        setDoc(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to reload document.');
        setLoading(false);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@truemarriage.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const renderTextContent = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let bulletGroup: string[] = [];

    const flushBullets = (key: number) => {
      if (bulletGroup.length > 0) {
        elements.push(
          <ul
            key={`bullets-${key}`}
            className="my-3 space-y-2 pl-4 sm:pl-6 text-slate-700 list-disc marker:text-[#F01472]"
          >
            {bulletGroup.map((b, i) => (
              <li key={i} className="text-xs sm:text-sm leading-relaxed font-normal">
                {b}
              </li>
            ))}
          </ul>
        );
        bulletGroup = [];
      }
    };

    let skippedTitle = false;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushBullets(idx);
        return;
      }

      // Skip redundant main title header in document body (modal header already displays it)
      if (
        !skippedTitle &&
        idx < 5 &&
        (trimmed.toLowerCase() === title.toLowerCase() ||
          trimmed.toLowerCase().includes('policy') ||
          trimmed.toLowerCase().includes('terms'))
      ) {
        skippedTitle = true;
        flushBullets(idx);
        return;
      }

      // Last updated badge is displayed in the sub-bar on the left
      if (trimmed.toLowerCase().startsWith('last updated:')) {
        flushBullets(idx);
        return;
      }

      // Main numbered section header (e.g. "1. Information We Collect" or "16. Contact Us")
      if (/^\d+\.\s+[A-Z]/.test(trimmed) || /^\d+\.\s+\w+/.test(trimmed)) {
        flushBullets(idx);
        elements.push(
          <div key={`sec-${idx}`} className="mt-8 mb-3 pt-5 border-t border-slate-100">
            <h2 className="text-base sm:text-lg font-[450] text-slate-950 flex items-center gap-2.5">
              <span className="w-1.5 h-4.5 rounded-full bg-[#F01472] shrink-0" />
              <span>{trimmed}</span>
            </h2>
          </div>
        );
        return;
      }

      // Sub-headings e.g. "A. Personal Information"
      if (/^[A-Z]\.\s+/.test(trimmed)) {
        flushBullets(idx);
        elements.push(
          <h3
            key={`sub-${idx}`}
            className="text-xs sm:text-sm font-[450] text-slate-900 mt-4 mb-2 pl-3 border-l-2 border-rose-300"
          >
            {trimmed}
          </h3>
        );
        return;
      }

      // Interactive Contact Details Rows
      if (trimmed.toLowerCase().startsWith('email:')) {
        flushBullets(idx);
        elements.push(
          <div
            key={`contact-email-${idx}`}
            className="my-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between gap-3 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2 text-slate-800 font-normal">
              <Mail className="w-4 h-4 text-[#F01472] shrink-0" />
              <span>{trimmed}</span>
            </div>
            <a
              href="mailto:support@truemarriage.in?subject=TrueMarriage%20Legal%20Inquiry"
              className="text-xs font-medium text-[#F01472] hover:underline shrink-0"
            >
              {t('Send Email')}
            </a>
          </div>
        );
        return;
      }

      if (trimmed.toLowerCase().startsWith('website:')) {
        flushBullets(idx);
        elements.push(
          <div
            key={`contact-web-${idx}`}
            className="my-1.5 text-xs sm:text-sm text-slate-700 flex items-center gap-1.5"
          >
            <span className="font-medium text-slate-900">{t('Official Website:')}</span>
            <a
              href="https://www.truemarriage.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F01472] hover:underline"
            >
              https://www.truemarriage.in
            </a>
          </div>
        );
        return;
      }

      // If line is very short (< 40 chars) without punctuation at end, treat as list item
      if (trimmed.length < 40 && !trimmed.endsWith('.') && !trimmed.endsWith(':') && idx > 5) {
        bulletGroup.push(trimmed);
        return;
      }

      flushBullets(idx);
      elements.push(
        <p key={`p-${idx}`} className="text-xs sm:text-sm text-slate-600 leading-relaxed my-2 font-normal">
          {trimmed}
        </p>
      );
    });

    flushBullets(lines.length);
    return elements;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100005] flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up border border-rose-100/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ────────────────────────────────────────── */}
        <div className="px-5 sm:px-7 py-4.5 bg-gradient-to-r from-[#FFF7F9] via-[#FFF2F6] to-[#FFF7F9] border-b border-rose-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#F01472] text-white flex items-center justify-center shadow-xs shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-[450] tracking-tight truncate text-slate-900">
                {title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5 font-normal">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center border border-rose-200/60 shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F01472]"
              title={t('Reload document')}
              aria-label="Reload policy file"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-rose-200/60 shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F01472]"
              aria-label={t('Close')}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Sub-bar: Last Updated Pill & Actions ─────────────────── */}
        <div className="px-5 sm:px-7 py-2 bg-rose-50/40 border-b border-rose-100/80 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-600 shrink-0">
          <div className="min-w-0">
            {lastUpdated ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/70 text-[11px] font-normal text-rose-800 shadow-2xs">
                <CheckCircle2 size={12} className="text-[#F01472] shrink-0" />
                <span className="truncate">{lastUpdated}</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-[#F01472] transition-colors cursor-pointer"
              title={t('Copy support email address')}
            >
              {copiedEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copiedEmail ? t('Copied!') : t('Copy Email')}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title={t('Print this policy')}
            >
              <Printer size={12} />
              <span>{t('Print')}</span>
            </button>

            <a
              href={rawFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#F01472] hover:underline"
            >
              <span>{t('Raw File')}</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

        {/* ── Content Body ─────────────────────────────────────────── */}
        <div className="p-6 sm:p-8 overflow-y-auto min-h-[300px] flex-1 bg-white selection:bg-rose-100 selection:text-rose-900">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 size={26} className="animate-spin text-[#F01472]" />
              <p className="text-xs font-normal text-slate-600">{t('Loading document...')}</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-3">
              <AlertCircle size={32} className="text-rose-500 mx-auto" />
              <p className="text-sm font-medium text-slate-800">{error}</p>
              <button
                type="button"
                onClick={handleRefresh}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition cursor-pointer"
              >
                {t('Try Again')}
              </button>
            </div>
          ) : doc ? (
            <div className="max-w-3xl mx-auto">
              {doc.type === 'html' ? (
                <div
                  className="prose prose-sm sm:prose max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-900 prose-headings:font-[450] prose-a:text-[#F01472] [&>h1:first-child]:hidden"
                  dangerouslySetInnerHTML={{ __html: doc.content }}
                />
              ) : (
                <div className="text-slate-700">{renderTextContent(doc.content)}</div>
              )}
            </div>
          ) : null}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-normal">
            <span>{t('Official Desk:')}</span>
            <a
              href="mailto:support@truemarriage.in"
              className="text-[#F01472] hover:underline font-medium"
            >
              support@truemarriage.in
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F01472] hover:bg-[#d01060] text-white font-medium text-xs shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F01472] focus-visible:ring-offset-1"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
