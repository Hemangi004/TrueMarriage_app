// Service to dynamically fetch and parse legal documents (txt or docx) from /public

export type LegalTabType = 'privacy' | 'terms' | 'refund';

export interface LegalDocResult {
  title: string;
  type: 'html' | 'text';
  content: string;
  lastFetched: Date;
}

const CACHE = new Map<LegalTabType, LegalDocResult>();

const TAB_FILES: Record<LegalTabType, { txt: string[]; docx: string[]; defaultTitle: string }> = {
  privacy: {
    txt: ['/privacy-policy.txt', '/privacy policy.txt'],
    docx: [],
    defaultTitle: 'Privacy Policy',
  },
  terms: {
    txt: ['/terms-and-conditions.txt', '/terms and conditions.txt'],
    docx: [],
    defaultTitle: 'Terms & Conditions',
  },
  refund: {
    txt: ['/refund-policy.txt', '/refund policy.txt'],
    docx: [],
    defaultTitle: 'Refund & Cancellation Policy',
  },
};

export async function fetchLegalDoc(tab: LegalTabType, forceRefresh = false): Promise<LegalDocResult> {
  if (!forceRefresh && CACHE.has(tab)) {
    return CACHE.get(tab)!;
  }

  const config = TAB_FILES[tab];
  const cacheBuster = `?t=${Date.now()}`;

  // 1. Try fetching .txt files first
  for (const path of config.txt) {
    try {
      const res = await fetch(`${path}${cacheBuster}`);
      if (res.ok) {
        const text = await res.text();
        // Ensure it's not an HTML 404 page returned by SPA routing fallback
        if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
          const result: LegalDocResult = {
            title: config.defaultTitle,
            type: 'text',
            content: text,
            lastFetched: new Date(),
          };
          CACHE.set(tab, result);
          return result;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 2. Try fetching .docx files if .txt is not found
  for (const docxPath of config.docx) {
    try {
      const res = await fetch(`${docxPath}${cacheBuster}`);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer.byteLength > 100) {
          try {
            const mammoth = await import('mammoth');
            const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
            const result: LegalDocResult = {
              title: config.defaultTitle,
              type: 'html',
              content: html,
              lastFetched: new Date(),
            };
            CACHE.set(tab, result);
            return result;
          } catch (mErr) {
            console.warn('Mammoth docx parse fallback:', mErr);
          }
        }
      }
    } catch {
      // Continue
    }
  }

  throw new Error(`Could not load ${config.defaultTitle} document from public folder.`);
}
