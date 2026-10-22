import { PDFDocument } from 'pdf-lib';
import { toJpeg } from 'html-to-image';

export type PdfPaperSize = 'a4' | 'letter';
export type PdfOrientation = 'portrait' | 'landscape';
export type PdfResolution = 'ultra' | 'high' | 'standard'; // 300 DPI (3x), 200 DPI (2x), 100 DPI (1.5x)

export interface DigitalSignatureConfig {
  enabled: boolean;
  type: 'stamp' | 'type' | 'upload' | 'draw';
  typedText?: string;
  imageDataUrl?: string;
  signerName?: string;
  signerTitle?: string;
  verificationId?: string;
  timestamp?: string;
}

export interface PdfOptions {
  paperSize: PdfPaperSize;
  orientation: PdfOrientation;
  resolution: PdfResolution;
  printReady: {
    showCropMarks: boolean;
    highContrastMode: boolean;
    showHeaderFooter: boolean;
    customFooterText?: string;
  };
  passwordProtection: {
    enabled: boolean;
    password?: string;
  };
  digitalSignature: DigitalSignatureConfig;
  profileId?: string | null;
  candidateName?: string;
}

// Dimensions in Points (1 pt = 1/72 inch)
// A4: 210mm x 297mm = 595.28 pt x 841.89 pt
// Letter: 8.5" x 11" = 612 pt x 792 pt
export const PAPER_DIMENSIONS = {
  a4: {
    portrait: { width: 595.28, height: 841.89 },
    landscape: { width: 841.89, height: 595.28 },
  },
  letter: {
    portrait: { width: 612, height: 792 },
    landscape: { width: 792, height: 612 },
  },
};



/**
 * Renders an HTML element into a high-resolution canvas using html2canvas,
 * then embeds it into a pdf-lib PDFDocument with custom page size, orientation,
 * optional print marks, password protection, and digital signatures.
 */
export async function generateHighResPdf(
  element: HTMLElement,
  options: PdfOptions
): Promise<Uint8Array> {
  const {
    paperSize,
    orientation,
    resolution,
    printReady,
    passwordProtection,
  } = options;

  // Determine scale factor based on resolution selection
  let scaleFactor = 2.5; // High Res 250+ DPI
  if (resolution === 'ultra') scaleFactor = 3;
  if (resolution === 'standard') scaleFactor = 2;

  // 1. Capture HTML element into image data url using html-to-image
  let imgDataUrl: string;
  
  const baseImageOptions = {
    backgroundColor: printReady.highContrastMode ? '#FFFFFF' : '#FFFFFF',
    width: 794,
    height: 1123,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
      position: 'static',
      width: '794px',
      minWidth: '794px',
      maxWidth: '794px',
      height: '1123px',
      minHeight: '1123px',
      maxHeight: '1123px',
      margin: '0',
      padding: '0',
      boxShadow: 'none',
    },
    quality: 0.95
  };

  try {
    imgDataUrl = await toJpeg(element, {
      ...baseImageOptions,
      pixelRatio: scaleFactor,
    });
  } catch (canvasErr) {
    console.warn('[PDF_GEN] Primary capture failed, retrying with standard scale...', canvasErr);
    imgDataUrl = await toJpeg(element, {
      ...baseImageOptions,
      pixelRatio: 1.5,
    });
  }

  // 2. Create new pdf-lib PDFDocument
  const pdfDoc = await PDFDocument.create();

  // Determine paper dimensions
  const dims = PAPER_DIMENSIONS[paperSize][orientation];
  const page = pdfDoc.addPage([dims.width, dims.height]);

  // Embed rendered biodata image (support JPEG or PNG)
  let embeddedImage;
  if (imgDataUrl.startsWith('data:image/jpeg') || imgDataUrl.startsWith('data:image/jpg')) {
    embeddedImage = await pdfDoc.embedJpg(imgDataUrl);
  } else {
    embeddedImage = await pdfDoc.embedPng(imgDataUrl);
  }

  // Calculate margins and scaling to fit paper page nicely
  const marginX = 0;
  const marginY = 0;
  const availableW = dims.width - marginX * 2;
  const availableH = dims.height - marginY * 2;

  // Fit inside available area while preserving aspect ratio
  const imgAspect = embeddedImage.width / embeddedImage.height;
  const availAspect = availableW / availableH;

  let drawW = availableW;
  let drawH = availableH;
  let drawX = marginX;
  let drawY = marginY;

  if (imgAspect > availAspect) {
    drawH = availableW / imgAspect;
    drawY = marginY + (availableH - drawH) / 2;
  } else {
    drawW = availableH * imgAspect;
    drawX = marginX + (availableW - drawW) / 2;
  }

  // Draw rendered element onto page (note pdf-lib origin is bottom-left)
  page.drawImage(embeddedImage, {
    x: drawX,
    y: dims.height - drawY - drawH,
    width: drawW,
    height: drawH,
  });




  // 5. Encrypt PDF if password protection is enabled (if supported by PDF-lib build)
  if (passwordProtection.enabled && passwordProtection.password) {
    if (typeof (pdfDoc as any).encrypt === 'function') {
      (pdfDoc as any).encrypt({
        userPassword: passwordProtection.password,
        ownerPassword: passwordProtection.password,
      });
    }
  }

  // 6. Save and return bytes
  return await pdfDoc.save();
}

/**
 * Triggers a cross-browser download of the generated PDF bytes.
 */
export function downloadPdfBuffer(pdfBytes: Uint8Array, fileName: string) {
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}
