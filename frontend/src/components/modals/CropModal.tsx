import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Crop,
  X,
  Check,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Loader2,
  FlipHorizontal,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';
import { verifyPhotoApi } from '../../services/apiService';

// Fixed aspect ratio matching Discover page card and Profile modal: 4:5 portrait
const ASPECT_RATIO = 4 / 5; // 0.8

export interface PhotoFilter {
  id: string;
  name: string;
  css: string;
  description: string;
}

const PHOTO_FILTERS: PhotoFilter[] = [
  { id: 'normal', name: 'Original', css: 'none', description: 'No filter' },
  { id: 'warm', name: 'Warm Glow', css: 'brightness(1.04) contrast(1.05) saturate(1.15) sepia(0.12)', description: 'Golden skin radiance' },
  { id: 'vivid', name: 'Vivid & Crisp', css: 'contrast(1.14) saturate(1.25) brightness(1.02)', description: 'Punchy vibrant colors' },
  { id: 'soft', name: 'Studio Soft', css: 'brightness(1.06) contrast(0.96) saturate(1.05)', description: 'Gentle portrait tone' },
  { id: 'cool', name: 'Cool Breeze', css: 'brightness(1.02) contrast(1.04) saturate(0.9) hue-rotate(185deg)', description: 'Fresh clean tone' },
  { id: 'bw', name: 'Classic B&W', css: 'grayscale(100%) contrast(1.15) brightness(1.05)', description: 'Timeless monochrome' },
  { id: 'sepia', name: 'Vintage Sepia', css: 'sepia(0.4) contrast(1.05) brightness(0.98)', description: 'Warm nostalgic feel' },
  { id: 'dramatic', name: 'Dramatic', css: 'contrast(1.22) saturate(0.92) brightness(0.96)', description: 'Deep cinema contrast' },
];

export const CropModal: React.FC = () => {
  const {
    cropModalOpen,
    setCropModalOpen,
    tempImageSrc,
    formData,
    updateFormData,
    cropCallback,
    setCropCallback,
    activeFilterId,
  } = useBiodata();

  // Crop box dimensions on screen (4:5 ratio)
  // 224px wide x 280px high (compact, fits all screens)
  const cropBoxW = 224;
  const cropBoxH = Math.round(cropBoxW / ASPECT_RATIO); // 280px (exact 4:5 ratio)

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PhotoFilter>(PHOTO_FILTERS[0]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // References for drag & pinch tracking
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cropBoxRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Reset controls when a new image opens
  useEffect(() => {
    if (cropModalOpen && tempImageSrc) {
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      const targetFilterId = activeFilterId || formData?.profilePhotoFilter || 'normal';
      const existingFilter = PHOTO_FILTERS.find((f) => f.id === targetFilterId) || PHOTO_FILTERS[0];
      setActiveFilter(existingFilter);
      setIsFilterDropdownOpen(false);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
      setVerificationError(null);
      pinchStartRef.current = null;

      const img = new Image();
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = tempImageSrc;
    }
  }, [cropModalOpen, tempImageSrc, activeFilterId, formData?.profilePhotoFilter]);

  // Compute effective image dimensions accounting for 90°/270° rotation
  const isRotated90or270 = rotation % 180 !== 0;
  const effectiveW = isRotated90or270 ? naturalSize.height : naturalSize.width;
  const effectiveH = isRotated90or270 ? naturalSize.width : naturalSize.height;

  // Minimum scale so image completely fills the 4:5 crop box (object-fit: cover)
  const baseScale =
    effectiveW > 0 && effectiveH > 0
      ? Math.max(cropBoxW / effectiveW, cropBoxH / effectiveH)
      : 1;

  // Boundary clamp helper: ensures image edges never expose empty whitespace
  const clampPan = useCallback(
    (targetX: number, targetY: number, targetZoom = zoom, targetRot = rotation) => {
      const isRot = targetRot % 180 !== 0;
      const effW = isRot ? naturalSize.height : naturalSize.width;
      const effH = isRot ? naturalSize.width : naturalSize.height;
      if (effW <= 0 || effH <= 0) return { x: 0, y: 0 };

      const bScale = Math.max(cropBoxW / effW, cropBoxH / effH);
      const totalScale = bScale * targetZoom;

      const renderedW = effW * totalScale;
      const renderedH = effH * totalScale;

      const maxPanX = Math.max(0, (renderedW - cropBoxW) / 2);
      const maxPanY = Math.max(0, (renderedH - cropBoxH) / 2);

      return {
        x: Math.min(maxPanX, Math.max(-maxPanX, targetX)),
        y: Math.min(maxPanY, Math.max(-maxPanY, targetY)),
      };
    },
    [cropBoxW, cropBoxH, naturalSize, zoom, rotation]
  );

  // Auto-clamp pan whenever zoom or rotation changes
  useEffect(() => {
    setPan((prev) => clampPan(prev.x, prev.y, zoom, rotation));
  }, [zoom, rotation, clampPan]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newRawX = dragStartRef.current.panX + dx;
      const newRawY = dragStartRef.current.panY + dy;
      setPan(clampPan(newRawX, newRawY));
    },
    [isDragging, clampPan]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch Drag & Pinch-to-Zoom Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.touches[0].clientX,
        mouseY: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartRef.current = { dist, zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.mouseX;
      const dy = e.touches[0].clientY - dragStartRef.current.mouseY;
      const newRawX = dragStartRef.current.panX + dx;
      const newRawY = dragStartRef.current.panY + dy;
      setPan(clampPan(newRawX, newRawY));
    } else if (e.touches.length === 2 && pinchStartRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scaleFactor = currentDist / pinchStartRef.current.dist;
      const targetZoom = Math.min(3.5, Math.max(1, parseFloat((pinchStartRef.current.zoom * scaleFactor).toFixed(2))));
      setZoom(targetZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartRef.current = null;
  };

  // Lock document body scroll while modal is open
  useEffect(() => {
    if (!cropModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [cropModalOpen]);

  // Native non-passive wheel and gesture listeners.
  // React's JSX onWheel is passive by default in React 17+, which causes e.preventDefault()
  // to be ignored, allowing laptop trackpad pinch gestures (wheel with ctrlKey=true) to zoom the whole browser page.
  // Attaching a native listener with { passive: false } allows e.preventDefault() to strictly cancel the browser page zoom.
  useEffect(() => {
    if (!cropModalOpen) return;
    const stage = stageRef.current;
    if (!stage) return;

    const onNativeWheel = (e: WheelEvent) => {
      // Prevent browser default page zoom (occurs when ctrlKey is true on trackpad pinch)
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey) {
        // Laptop Trackpad Pinch Gesture (Chrome / Edge / Safari send wheel with ctrlKey=true)
        const zoomDelta = -e.deltaY * 0.012;
        setZoom((prev) => {
          const next = Math.min(3.5, Math.max(1, parseFloat((prev + zoomDelta).toFixed(2))));
          return next;
        });
      } else {
        // Standard mouse wheel or two-finger scroll
        const zoomDelta = e.deltaY > 0 ? -0.08 : 0.08;
        setZoom((prev) => {
          const next = Math.min(3.5, Math.max(1, parseFloat((prev + zoomDelta).toFixed(2))));
          return next;
        });
      }
    };

    const onNativeGesture = (e: Event) => {
      // Safari / WebKit gesture events on macOS
      e.preventDefault();
      e.stopPropagation();
    };

    stage.addEventListener('wheel', onNativeWheel, { passive: false });
    stage.addEventListener('gesturestart', onNativeGesture, { passive: false });
    stage.addEventListener('gesturechange', onNativeGesture, { passive: false });
    stage.addEventListener('gestureend', onNativeGesture, { passive: false });

    // Also prevent ctrlKey page-zoom anywhere across the entire modal dialog
    const modalEl = containerRef.current;
    const onModalCtrlWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (modalEl) {
      modalEl.addEventListener('wheel', onModalCtrlWheel, { passive: false });
    }

    return () => {
      stage.removeEventListener('wheel', onNativeWheel);
      stage.removeEventListener('gesturestart', onNativeGesture);
      stage.removeEventListener('gesturechange', onNativeGesture);
      stage.removeEventListener('gestureend', onNativeGesture);
      if (modalEl) {
        modalEl.removeEventListener('wheel', onModalCtrlWheel);
      }
    };
  }, [cropModalOpen]);

  // Click outside to close filter dropdown
  useEffect(() => {
    if (!isFilterDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  // Keyboard accessibility: Escape to cancel, Enter to save
  useEffect(() => {
    if (!cropModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Enter' && !isProcessing) {
        handleApplyCrop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cropModalOpen, isProcessing]);

  const handleClose = () => {
    setCropModalOpen(false);
    if (setCropCallback) setCropCallback(null);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setActiveFilter(PHOTO_FILTERS[0]);
    setIsFilterDropdownOpen(false);
    setPan({ x: 0, y: 0 });
  };

  const handleRotate90 = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
  };

  const handleRotateCcw90 = () => {
    const nextRot = (rotation - 90 + 360) % 360;
    setRotation(nextRot);
  };

  const handleToggleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  const handleUseOriginal = async () => {
    if (!tempImageSrc) return;
    setIsProcessing(true);
    setVerificationError(null);

    // If a filter or flip is active, render through canvas maintaining original aspect ratio
    if (activeFilter.css !== 'none' || flipH || rotation !== 0) {
      const img = new Image();
      if (tempImageSrc.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = async () => {
        try {
          const isRot = rotation % 180 !== 0;
          const targetW = isRot ? img.naturalHeight : img.naturalWidth;
          const targetH = isRot ? img.naturalWidth : img.naturalHeight;
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            updateFormData({ profilePictureUrl: tempImageSrc });
            if (cropCallback) cropCallback(tempImageSrc);
            handleClose();
            return;
          }
          ctx.translate(targetW / 2, targetH / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          if (flipH) ctx.scale(-1, 1);
          if (activeFilter.css !== 'none') ctx.filter = activeFilter.css;
          ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
          ctx.filter = 'none';
          const filteredUrl = canvas.toDataURL('image/jpeg', 0.94);
          await verifyPhotoApi(filteredUrl);
          updateFormData({
            profilePictureUrl: filteredUrl,
            originalProfilePictureUrl: tempImageSrc,
            profilePhotoFilter: activeFilter.id,
          });
          if (cropCallback) cropCallback(filteredUrl, tempImageSrc, activeFilter.id);
          handleClose();
        } catch {
          updateFormData({
            profilePictureUrl: tempImageSrc,
            originalProfilePictureUrl: tempImageSrc,
            profilePhotoFilter: 'normal',
          });
          if (cropCallback) cropCallback(tempImageSrc, tempImageSrc, 'normal');
          handleClose();
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        handleClose();
      };
      img.src = tempImageSrc;
      return;
    }

    try {
      await verifyPhotoApi(tempImageSrc);
      updateFormData({
        profilePictureUrl: tempImageSrc,
        originalProfilePictureUrl: tempImageSrc,
        profilePhotoFilter: 'normal',
      });
      if (cropCallback) {
        cropCallback(tempImageSrc, tempImageSrc, 'normal');
      }
      handleClose();
    } catch (verifyErr: any) {
      setVerificationError(
        verifyErr.message || 'No human face detected. Please upload a clear portrait photo showing your face.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCrop = () => {
    if (!tempImageSrc) return;
    setIsProcessing(true);
    setVerificationError(null);

    const img = new Image();
    if (tempImageSrc.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = async () => {
      try {
        // High-DPI master output resolution (exact 4:5 aspect ratio: 1080 x 1350 px)
        const targetW = 1080;
        const targetH = 1350;

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          await handleUseOriginal();
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Crisp white fallback background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);

        // Translate origin to center of canvas
        ctx.translate(targetW / 2, targetH / 2);

        // Scale ratio between screen crop box and high-res canvas
        const scaleMultiplier = targetW / cropBoxW;

        // Apply pan offset scaled to canvas coordinates
        ctx.translate(pan.x * scaleMultiplier, pan.y * scaleMultiplier);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply flip on vertical axis
        if (flipH) {
          ctx.scale(-1, 1);
        }

        // Apply photo filter if selected
        if (activeFilter && activeFilter.css !== 'none') {
          ctx.filter = activeFilter.css;
        }

        // Draw image at scaled dimensions
        const drawScale = baseScale * zoom * scaleMultiplier;
        const drawW = img.naturalWidth * drawScale;
        const drawH = img.naturalHeight * drawScale;

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        // Reset filter
        ctx.filter = 'none';

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.94);

        // Validate human face using OpenCV
        try {
          await verifyPhotoApi(croppedDataUrl);
          updateFormData({
            profilePictureUrl: croppedDataUrl,
            originalProfilePictureUrl: tempImageSrc,
            profilePhotoFilter: activeFilter.id,
          });
          if (cropCallback) {
            cropCallback(croppedDataUrl, tempImageSrc, activeFilter.id);
          }
          handleClose();
        } catch (verifyErr: any) {
          setVerificationError(
            verifyErr.message || 'No human face detected. Please upload a clear portrait photo showing your face.'
          );
        }
      } catch (err) {
        console.warn('Canvas export error, falling back to original:', err);
        await handleUseOriginal();
      } finally {
        setIsProcessing(false);
      }
    };

    img.onerror = () => {
      setIsProcessing(false);
      handleUseOriginal();
    };

    img.src = tempImageSrc;
  };

  if (!cropModalOpen || !tempImageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[100050] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none touch-none"
      style={{ touchAction: 'none' }}
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className="bg-white text-slate-900 rounded-3xl max-w-[390px] w-full overflow-hidden shadow-2xl border border-purple-100/80 flex flex-col relative animate-scaleUp touch-none"
        style={{ touchAction: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F01472] to-[#C80E5A] text-white flex items-center justify-center font-black shadow-md shadow-rose-500/20 shrink-0">
              <Crop size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-[#1e1b4b] tracking-tight">
                  Crop Profile Photo
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-[#F01472] text-[10px] font-extrabold border border-rose-200/70">
                  4:5 Portrait
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Optimized for Discover feed and profile view
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Verification Error Alert */}
        {verificationError && (
          <div className="mx-4 mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shadow-xs">
            <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-900 text-[11px] tracking-tight">Photo Rejected</p>
              <p className="text-[11px] text-rose-700 leading-snug mt-0.5">{verificationError}</p>
            </div>
          </div>
        )}

        {/* Studio Viewport Area */}
        <div
          ref={stageRef}
          style={{ touchAction: 'none' }}
          className="relative w-full py-3.5 flex flex-col items-center justify-center bg-white border-y border-slate-100 overflow-hidden touch-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-rose-50/50 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Crop Viewport Box (Exact 4:5 aspect ratio) */}
          <div
            ref={cropBoxRef}
            style={{ width: `${cropBoxW}px`, height: `${cropBoxH}px`, touchAction: 'none' }}
            className={`relative rounded-2xl overflow-hidden shadow-xl ring-2 ring-[#F01472] select-none touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Image Layer with Transforms */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              }}
            >
              {tempImageSrc && (
                <img
                  src={tempImageSrc}
                  alt="Crop Preview"
                  draggable={false}
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scale(${baseScale * zoom})`,
                    transformOrigin: 'center center',
                    filter: activeFilter.css,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    transition: isDragging ? 'none' : 'transform 0.12s ease-out',
                  }}
                  className="pointer-events-none select-none max-w-none max-h-none"
                />
              )}
            </div>

            {/* Rule of Thirds Grid Lines (Softly illuminated during interaction) */}
            <div
              className={`absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none transition-opacity duration-300 ${
                isDragging || isHovered ? 'opacity-40' : 'opacity-20'
              }`}
            >
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Viewfinder L-Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-sm pointer-events-none drop-shadow-md" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-sm pointer-events-none drop-shadow-md" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-sm pointer-events-none drop-shadow-md" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-sm pointer-events-none drop-shadow-md" />

            {/* Centered Guide Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40 pointer-events-none" />
          </div>

          {/* Floating Guidance Chip */}
          <div className="mt-2.5 px-3 py-0.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-600 text-[10px] font-semibold flex items-center gap-1.5 shadow-xs">
            <Move size={10} className="text-[#F01472]" />
            <span>Drag photo to position · Scroll or pinch to zoom</span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 space-y-2">
          {/* Zoom Slider Row */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1 text-slate-700 text-[11px] font-bold">
                <ZoomIn size={12} className="text-[#F01472]" /> Zoom Level
              </span>
              <span className="px-1.5 py-0.2 rounded bg-rose-50 text-[#F01472] text-[10px] font-mono font-bold border border-rose-200/60">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, parseFloat((prev - 0.1).toFixed(2))))}
                disabled={zoom <= 1}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-slate-100 transition cursor-pointer"
                title="Zoom Out (-10%)"
              >
                <ZoomOut size={13} />
              </button>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F01472] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3.5, parseFloat((prev + 0.1).toFixed(2))))}
                disabled={zoom >= 3.5}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-slate-100 transition cursor-pointer"
                title="Zoom In (+10%)"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Action Tools Row */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRotate90}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                title="Rotate 90° Clockwise"
                aria-label="Rotate 90° Clockwise"
              >
                <RotateCw size={13} className="text-[#F01472]" />
              </button>

              <button
                type="button"
                onClick={handleRotateCcw90}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                title="Rotate 90° Counter-Clockwise"
                aria-label="Rotate 90° Counter-Clockwise"
              >
                <RotateCcw size={13} />
              </button>

              <button
                type="button"
                onClick={handleToggleFlipH}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 ${
                  flipH
                    ? 'bg-rose-50 text-[#F01472] border border-rose-300 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Flip on Vertical Axis (Horizontal Mirror)"
                aria-label="Flip on Vertical Axis"
              >
                <FlipHorizontal size={14} />
              </button>

              {/* Filter Button & Dropdown */}
              <div className="relative" ref={filterDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 ${
                    activeFilter.id !== 'normal'
                      ? 'bg-rose-50 text-[#F01472] border border-rose-300 shadow-xs ring-1 ring-rose-400'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={activeFilter.id !== 'normal' ? `Filter: ${activeFilter.name}` : 'Photo Filters'}
                  aria-label="Photo Filters"
                >
                  <Sparkles size={14} className={activeFilter.id !== 'normal' ? 'text-[#F01472]' : 'text-slate-700'} />
                </button>

                {/* Dropdown Menu */}
                {isFilterDropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-2xl shadow-2xl border border-purple-100/90 py-1.5 z-50 animate-scaleUp overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1">
                        <Sparkles size={11} className="text-[#F01472]" /> Filters
                      </span>
                      {activeFilter.id !== 'normal' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveFilter(PHOTO_FILTERS[0]);
                            setIsFilterDropdownOpen(false);
                          }}
                          className="text-[10px] text-[#F01472] hover:underline normal-case font-bold"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 py-0.5">
                      {PHOTO_FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => {
                            setActiveFilter(filter);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left flex items-center justify-between transition cursor-pointer hover:bg-rose-50/50 ${
                            activeFilter.id === filter.id
                              ? 'bg-rose-50/80 font-bold text-[#F01472]'
                              : 'text-slate-700'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs truncate">{filter.name}</span>
                            <span className="text-[9px] text-slate-400 font-normal truncate">
                              {filter.description}
                            </span>
                          </div>
                          {activeFilter.id === filter.id && (
                            <Check size={13} className="text-[#F01472] shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer active:scale-95"
                title="Reset all adjustments"
                aria-label="Reset"
              >
                <span>Reset</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleUseOriginal}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#F01472] underline transition cursor-pointer"
              title="Skip crop and keep full photo"
            >
              Keep Full Photo
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:from-[#d61265] hover:to-[#b00c4f] text-white font-bold text-xs shadow-md shadow-rose-500/25 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Check size={13} className="stroke-[3]" />
                <span>Apply & Save Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
