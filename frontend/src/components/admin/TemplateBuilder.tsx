import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  RotateCcw,
  RotateCw,
  Plus,
  Type,
  Image as ImageIcon,
  Minus,
  Square,
  Sparkles,
  Move,
  Trash2,
  Copy,
  Layers,
  Palette,
  Sliders,
  CheckCircle,
  Grid,
  Shield,
  Sun,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  AlertTriangle,
  X,
  Maximize2,
  Minimize2,
  Upload,
} from 'lucide-react';
import type {
  TemplateItem,
  TemplateElement,
  TemplateLayoutJSON,
} from '../../services/templateService';
import {
  BiodataRenderer,
  SAMPLE_FEMALE_PHOTOS,
  SAMPLE_MALE_PHOTOS,
  BUILTIN_DECORATION_SVGS,
} from '../rendering/BiodataRenderer';
import { toJpeg } from 'html-to-image';
import { TEN_DUMMY_PROFILES } from '../../utils/dummyBiodataProfiles';
import {
  adminUpdateTemplateApi,
  adminUploadTemplateThumbnailApi,
  fetchCategoriesApi,
  DEFAULT_MARATHI_BIODATA_ELEMENTS,
  DEFAULT_ENGLISH_BIODATA_ELEMENTS,
  type CategoryItem,
} from '../../services/templateService';

interface TemplateBuilderProps {
  template: TemplateItem;
  onBack: () => void;
  onSaved?: (updated: TemplateItem) => void;
}

const DYNAMIC_FIELDS_CATALOG = [
  // Personal
  { label: 'Full Name', value: '{{personalDetails.fullName}}', binding: 'personalDetails.fullName', category: 'Personal' },
  { label: 'Date of Birth', value: '{{personalDetails.dateOfBirth}}', binding: 'personalDetails.dateOfBirth', category: 'Personal' },
  { label: 'Time of Birth', value: '{{personalDetails.timeOfBirth}}', binding: 'personalDetails.timeOfBirth', category: 'Personal' },
  { label: 'Place of Birth', value: '{{personalDetails.placeOfBirth}}', binding: 'personalDetails.placeOfBirth', category: 'Personal' },
  { label: 'Height', value: '{{personalDetails.height}}', binding: 'personalDetails.height', category: 'Personal' },
  { label: 'Weight', value: '{{personalDetails.weight}}', binding: 'personalDetails.weight', category: 'Personal' },
  { label: 'Complexion', value: '{{personalDetails.complexion}}', binding: 'personalDetails.complexion', category: 'Personal' },
  { label: 'Blood Group', value: '{{personalDetails.bloodGroup}}', binding: 'personalDetails.bloodGroup', category: 'Personal' },
  { label: 'Marital Status', value: '{{personalDetails.maritalStatus}}', binding: 'personalDetails.maritalStatus', category: 'Personal' },
  { label: 'Mother Tongue', value: '{{personalDetails.motherTongue}}', binding: 'personalDetails.motherTongue', category: 'Personal' },
  { label: 'Profile Photo Slot', value: '', binding: 'personalDetails.photoUrl', category: 'Personal' },

  // Horoscope & Cultural
  { label: 'Religion', value: '{{personalDetails.religion}}', binding: 'personalDetails.religion', category: 'Horoscope' },
  { label: 'Caste', value: '{{personalDetails.caste}}', binding: 'personalDetails.caste', category: 'Horoscope' },
  { label: 'Kuldevata / Kuldaivat', value: '{{personalDetails.kuldaivat}}', binding: 'personalDetails.kuldaivat', category: 'Horoscope' },
  { label: 'Gotra', value: '{{personalDetails.gotra}}', binding: 'personalDetails.gotra', category: 'Horoscope' },
  { label: 'Rashi', value: '{{personalDetails.rashi}}', binding: 'personalDetails.rashi', category: 'Horoscope' },
  { label: 'Nakshatra', value: '{{personalDetails.nakshatra}}', binding: 'personalDetails.nakshatra', category: 'Horoscope' },
  { label: 'Gan', value: '{{personalDetails.gan}}', binding: 'personalDetails.gan', category: 'Horoscope' },
  { label: 'Nadi', value: '{{personalDetails.nadi}}', binding: 'personalDetails.nadi', category: 'Horoscope' },
  { label: 'Manglik', value: '{{personalDetails.manglik}}', binding: 'personalDetails.manglik', category: 'Horoscope' },
  { label: 'Religious Shloka Header', value: '{{pageHeader.deity}}', binding: 'pageHeader.deity', category: 'Horoscope' },
  { label: 'Religious Symbol / Motif', value: '{{pageHeader.deityIcon}}', binding: 'pageHeader.deityIcon', category: 'Horoscope' },

  // Education & Career
  { label: 'Education / Degree', value: '{{educationOccupation.education}}', binding: 'educationOccupation.education', category: 'Education' },
  { label: 'Occupation', value: '{{educationOccupation.occupation}}', binding: 'educationOccupation.occupation', category: 'Career' },
  { label: 'Company Name', value: '{{educationOccupation.companyName}}', binding: 'educationOccupation.companyName', category: 'Career' },
  { label: 'Annual Income', value: '{{educationOccupation.annualIncome}}', binding: 'educationOccupation.annualIncome', category: 'Career' },
  { label: 'Work Location', value: '{{educationOccupation.workLocation}}', binding: 'educationOccupation.workLocation', category: 'Career' },

  // Family
  { label: 'Father Name', value: '{{familyDetails.fatherName}}', binding: 'familyDetails.fatherName', category: 'Family' },
  { label: 'Father Occupation', value: '{{familyDetails.fatherOccupation}}', binding: 'familyDetails.fatherOccupation', category: 'Family' },
  { label: 'Mother Name', value: '{{familyDetails.motherName}}', binding: 'familyDetails.motherName', category: 'Family' },
  { label: 'Mother Occupation', value: '{{familyDetails.motherOccupation}}', binding: 'familyDetails.motherOccupation', category: 'Family' },
  { label: 'Brothers', value: '{{familyDetails.brothers}}', binding: 'familyDetails.brothers', category: 'Family' },
  { label: 'Sisters', value: '{{familyDetails.sisters}}', binding: 'familyDetails.sisters', category: 'Family' },
  { label: 'Family Type', value: '{{familyDetails.familyType}}', binding: 'familyDetails.familyType', category: 'Family' },
  { label: 'Native Place', value: '{{familyDetails.nativePlace}}', binding: 'familyDetails.nativePlace', category: 'Family' },

  // Contact
  { label: 'Primary Contact / Mobile', value: '{{contactDetails.primaryContact}}', binding: 'contactDetails.primaryContact', category: 'Contact' },
  { label: 'Secondary Contact', value: '{{contactDetails.secondaryContact}}', binding: 'contactDetails.secondaryContact', category: 'Contact' },
  { label: 'Email Address', value: '{{contactDetails.email}}', binding: 'contactDetails.email', category: 'Contact' },
  { label: 'Residence Address', value: '{{contactDetails.residenceAddress}}', binding: 'contactDetails.residenceAddress', category: 'Contact' },
];

const DECORATION_PRESETS = [
  { key: 'ganesh', name: 'Ganesh Symbol', category: 'Religious' },
  { key: 'om', name: 'Om Symbol', category: 'Religious' },
  { key: 'shloka', name: 'Sanskrit Shloka Header', category: 'Headers' },
  { key: 'mandala', name: 'Royal Mandala', category: 'Ornaments' },
  { key: 'floral_corner', name: 'Floral Corner Motif', category: 'Borders' },
  { key: 'golden_frame', name: 'Golden Parchment Frame', category: 'Borders' },
  { key: 'ring', name: 'Wedding Rings', category: 'Ornaments' },
  { key: 'lotus', name: 'Divine Lotus', category: 'Ornaments' },
];

const FONT_FAMILIES = [
  { name: 'Playfair Display', font: 'Playfair Display, serif' },
  { name: 'Inter (Modern Sans)', font: 'Inter, sans-serif' },
  { name: 'Cinzel (Royal Serif)', font: 'Cinzel, serif' },
  { name: 'Great Vibes (Script)', font: 'Great Vibes, cursive' },
  { name: 'Roboto', font: 'Roboto, sans-serif' },
  { name: 'Georgia', font: 'Georgia, serif' },
];

interface AlignmentGuide {
  type: 'x' | 'y';
  position: number;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  template,
  onBack,
  onSaved,
}) => {
  // Layout State: Initialize with standard layout if empty
  const [layout, setLayout] = useState<TemplateLayoutJSON>(() => {
    const existing = template.layout_json;
    const initialElements =
      existing?.elements && existing.elements.length > 0
        ? existing.elements
        : DEFAULT_MARATHI_BIODATA_ELEMENTS;

    return {
      page: existing?.page || {
        width: 794,
        height: 1123,
        background: template.default_bg || '#FFFFFF',
        backgroundType: 'color',
        padding: 32,
        fontFamily: template.font_family || 'Playfair Display',
      },
      elements: initialElements,
    };
  });

  // Selection & Tools State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'elements' | 'fields' | 'decorations' | 'background' | 'layers'>('fields');
  const [selectedDummyIndex, setSelectedDummyIndex] = useState<number>(() => {
    const savedIdx = (template.layout_json?.page as any)?.selectedDummyIndex;
    if (typeof savedIdx === 'number' && savedIdx >= 0 && savedIdx < TEN_DUMMY_PROFILES.length) {
      return savedIdx;
    }
    const savedName = (template.layout_json?.page as any)?.sampleData?.personalDetails?.fullName;
    if (savedName) {
      const foundIdx = TEN_DUMMY_PROFILES.findIndex((p) => p.data.personalDetails.fullName === savedName);
      if (foundIdx >= 0) return foundIdx;
    }
    return 0;
  });

  const handleCycleDummyData = (newIndex?: number) => {
    const nextIdx = newIndex !== undefined ? newIndex : (selectedDummyIndex + 1) % TEN_DUMMY_PROFILES.length;
    setSelectedDummyIndex(nextIdx);
    setLayout((prev) => ({
      ...prev,
      page: {
        ...prev.page,
        selectedDummyIndex: nextIdx,
        sampleData: TEN_DUMMY_PROFILES[nextIdx].data,
      } as any,
    }));
  };

  const [previewModeOnly, setPreviewModeOnly] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  const calculateFitScale = useCallback(() => {
    if (viewportRef.current) {
      const availableH = viewportRef.current.clientHeight - 48;
      const availableW = viewportRef.current.clientWidth - 48;
      const fitY = availableH / 1123;
      const fitX = availableW / 794;
      const fit = Math.min(fitX, fitY);
      return Math.max(0.25, Math.min(Number(fit.toFixed(2)), 1.2));
    }
    const availableH = typeof window !== 'undefined' ? window.innerHeight - 120 : 700;
    const fit = availableH / 1123;
    return Math.max(0.25, Math.min(Number(fit.toFixed(2)), 1.2));
  }, []);

  const [zoomScale, setZoomScale] = useState<number>(() => calculateFitScale());
  const [saving, setSaving] = useState(false);
  const [copiedElements, setCopiedElements] = useState<TemplateElement[]>([]);

  const handleFitToScreen = useCallback(() => {
    setZoomScale(calculateFitScale());
  }, [calculateFitScale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setZoomScale(calculateFitScale());
    }, 100);
    const handleResize = () => {
      setZoomScale(calculateFitScale());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateFitScale]);

  // Toggles
  const [showGrid, setShowGrid] = useState(false);
  const [showSafeArea, setShowSafeArea] = useState(true);
  const [snapToGrid, _setSnapToGrid] = useState(true);
  const [snapToElements, setSnapToElements] = useState(true);

  // Alignment Guides
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);

  // Pre-Publish Validation Modal
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [validationIssues, setValidationIssues] = useState<{ id?: string; level: 'error' | 'warning'; message: string }[]>([]);
  const [_categories, _setCategories] = useState<CategoryItem[]>([]);
  const [publishMetadata, setPublishMetadata] = useState({
    name: template.name,
    description: template.description || '',
    category_ids: template.categories?.map((c) => c.id) || [],
    pricing_type: template.pricing_type || 'FREE',
    badge: template.badge || '',
    thumbnail_url: template.thumbnail_url || '',
  });

  // History Stack
  const [history, setHistory] = useState<TemplateLayoutJSON[]>([layout]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    isDragging: boolean;
    isResizing: boolean;
    resizeHandle?: string;
    startX: number;
    startY: number;
    initialElements: { id: string; x: number; y: number; width: number; height: number }[];
  }>({
    isDragging: false,
    isResizing: false,
    initialElements: [],
    startX: 0,
    startY: 0,
  });

  // Rubber-band marquee selection state
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  useEffect(() => {
    fetchCategoriesApi().then(_setCategories);
  }, []);

  const pushHistory = useCallback((newLayout: TemplateLayoutJSON) => {
    const updatedHistory = history.slice(0, historyIdx + 1);
    updatedHistory.push(newLayout);
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    setLayout(newLayout);
  }, [history, historyIdx]);

  const handleUndo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setLayout(history[historyIdx - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setLayout(history[historyIdx + 1]);
    }
  };

  const selectedElements = layout.elements.filter((el) => selectedIds.includes(el.id));
  const primarySelected = selectedElements[0] || null;

  // Add Element Helper
  const handleAddElement = (
    type: 'text' | 'image' | 'divider' | 'shape' | 'border' | 'decoration',
    contentStr?: string,
    fieldBinding?: string,
    decorationKey?: string
  ) => {
    const newEl: TemplateElement = {
      id: `el_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      content: contentStr || (type === 'text' ? 'New Text Field' : undefined),
      fieldBinding,
      decorationKey,
      shapeType: type === 'image' ? 'rounded' : type === 'shape' ? 'rectangle' : undefined,
      x: 100 + (layout.elements.length % 5) * 20,
      y: 150 + (layout.elements.length % 10) * 30,
      width: type === 'text' ? 500 : type === 'image' ? 140 : type === 'divider' ? 500 : type === 'decoration' ? 80 : 200,
      height: type === 'text' ? 40 : type === 'image' ? 140 : type === 'divider' ? 4 : type === 'decoration' ? 80 : 100,
      zIndex: layout.elements.length + 1,
      rotation: 0,
      style: {
        fontSize: type === 'text' ? 16 : undefined,
        color: template.default_accent || '#8B0000',
        textAlign: 'left',
        fontFamily: layout.page.fontFamily,
        borderRadius: type === 'image' ? '8px' : '0px',
        objectFit: 'cover',
      },
    };

    const newLayout = {
      ...layout,
      elements: [...layout.elements, newEl],
    };

    pushHistory(newLayout);
    setSelectedIds([newEl.id]);
  };

  // Update selected elements
  const handleUpdateSelected = (changes: Partial<TemplateElement> | { style?: Partial<TemplateElement['style']> }) => {
    if (selectedIds.length === 0) return;

    const updatedElements = layout.elements.map((el) => {
      if (!selectedIds.includes(el.id)) return el;
      return {
        ...el,
        ...changes,
        style: {
          ...el.style,
          ...(changes.style || {}),
        },
      };
    });

    const newLayout = { ...layout, elements: updatedElements };
    pushHistory(newLayout);
  };

  // Delete selected
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const updatedElements = layout.elements.filter((el) => !selectedIds.includes(el.id));
    const newLayout = { ...layout, elements: updatedElements };
    pushHistory(newLayout);
    setSelectedIds([]);
  }, [selectedIds, layout, pushHistory]);

  // Duplicate selected
  const handleDuplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const clones: TemplateElement[] = [];
    const newSelectedIds: string[] = [];

    const updatedElements = [...layout.elements];
    selectedElements.forEach((el) => {
      const cloneId = `el_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const clone: TemplateElement = {
        ...el,
        id: cloneId,
        x: el.x + 20,
        y: el.y + 20,
        zIndex: updatedElements.length + 1,
      };
      clones.push(clone);
      newSelectedIds.push(cloneId);
      updatedElements.push(clone);
    });

    const newLayout = { ...layout, elements: updatedElements };
    pushHistory(newLayout);
    setSelectedIds(newSelectedIds);
  }, [selectedIds, selectedElements, layout, pushHistory]);

  // Copy / Paste
  const handleCopySelected = useCallback(() => {
    setCopiedElements(selectedElements);
  }, [selectedElements]);

  const handlePasteCopied = useCallback(() => {
    if (copiedElements.length === 0) return;
    const clones: TemplateElement[] = [];
    const newSelectedIds: string[] = [];
    const updatedElements = [...layout.elements];

    copiedElements.forEach((el) => {
      const cloneId = `el_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const clone: TemplateElement = {
        ...el,
        id: cloneId,
        x: el.x + 30,
        y: el.y + 30,
        zIndex: updatedElements.length + 1,
      };
      clones.push(clone);
      newSelectedIds.push(cloneId);
      updatedElements.push(clone);
    });

    const newLayout = { ...layout, elements: updatedElements };
    pushHistory(newLayout);
    setSelectedIds(newSelectedIds);
  }, [copiedElements, layout, pushHistory]);



  // Grouping / Ungrouping
  const handleGroupSelected = () => {
    if (selectedIds.length < 2) return;
    const groupId = `group_${Date.now()}`;
    handleUpdateSelected({ groupId });
  };

  const handleUngroupSelected = () => {
    if (selectedIds.length === 0) return;
    handleUpdateSelected({ groupId: undefined });
  };

  // Multi-Element Alignment
  const handleAlignSelected = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length < 1) return;

    const minX = Math.min(...selectedElements.map((e) => e.x));
    const maxX = Math.max(...selectedElements.map((e) => e.x + e.width));
    const minY = Math.min(...selectedElements.map((e) => e.y));
    const maxY = Math.max(...selectedElements.map((e) => e.y + e.height));

    const updatedElements = layout.elements.map((el) => {
      if (!selectedIds.includes(el.id)) return el;

      let newX = el.x;
      let newY = el.y;

      if (alignment === 'left') newX = selectedIds.length === 1 ? 40 : minX;
      if (alignment === 'center') newX = selectedIds.length === 1 ? (794 - el.width) / 2 : minX + (maxX - minX - el.width) / 2;
      if (alignment === 'right') newX = selectedIds.length === 1 ? 794 - 40 - el.width : maxX - el.width;

      if (alignment === 'top') newY = selectedIds.length === 1 ? 40 : minY;
      if (alignment === 'middle') newY = selectedIds.length === 1 ? (1123 - el.height) / 2 : minY + (maxY - minY - el.height) / 2;
      if (alignment === 'bottom') newY = selectedIds.length === 1 ? 1123 - 40 - el.height : maxY - el.height;

      return { ...el, x: Math.round(newX), y: Math.round(newY) };
    });

    pushHistory({ ...layout, elements: updatedElements });
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
      if (isInput) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopySelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePasteCopied();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) handleUngroupSelected();
        else handleGroupSelected();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedIds.length > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;

        const updatedElements = layout.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          return { ...el, x: el.x + dx, y: el.y + dy };
        });
        pushHistory({ ...layout, elements: updatedElements });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, layout, handleDeleteSelected, handleCopySelected, handlePasteCopied, handleDuplicateSelected]);

  // Pointer Drag & Resize Engine
  const handlePointerDown = (
    e: React.PointerEvent,
    elementId?: string,
    handleType?: string
  ) => {
    e.stopPropagation();

    if (!elementId) {
      // Clicked blank canvas background: clear selection or start rubber-band box
      if (!e.shiftKey) setSelectedIds([]);

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const startX = (e.clientX - rect.left) / zoomScale;
        const startY = (e.clientY - rect.top) / zoomScale;
        setMarqueeBox({ startX, startY, endX: startX, endY: startY });
      }
      return;
    }

    // Toggle Shift multi-select
    if (e.shiftKey) {
      if (selectedIds.includes(elementId)) {
        setSelectedIds(selectedIds.filter((id) => id !== elementId));
      } else {
        setSelectedIds([...selectedIds, elementId]);
      }
    } else {
      if (!selectedIds.includes(elementId)) {
        setSelectedIds([elementId]);
      }
    }

    const targetElements = selectedIds.includes(elementId)
      ? selectedElements
      : [layout.elements.find((el) => el.id === elementId)!];

    // Don't drag locked elements
    if (targetElements.every((el) => el.isLocked)) return;

    draggingRef.current = {
      isDragging: !handleType,
      isResizing: Boolean(handleType),
      resizeHandle: handleType,
      startX: e.clientX,
      startY: e.clientY,
      initialElements: targetElements.map((el) => ({
        id: el.id,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
      })),
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Update marquee rubber band if active
    if (marqueeBox && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const endX = (e.clientX - rect.left) / zoomScale;
      const endY = (e.clientY - rect.top) / zoomScale;
      setMarqueeBox({ ...marqueeBox, endX, endY });

      // Select elements inside marquee
      const boxMinX = Math.min(marqueeBox.startX, endX);
      const boxMaxX = Math.max(marqueeBox.startX, endX);
      const boxMinY = Math.min(marqueeBox.startY, endY);
      const boxMaxY = Math.max(marqueeBox.startY, endY);

      const enclosed = layout.elements.filter(
        (el) =>
          el.x >= boxMinX &&
          el.x + el.width <= boxMaxX &&
          el.y >= boxMinY &&
          el.y + el.height <= boxMaxY
      );
      setSelectedIds(enclosed.map((el) => el.id));
      return;
    }

    const { isDragging, isResizing, resizeHandle, startX, startY, initialElements } = draggingRef.current;
    if (!isDragging && !isResizing) return;

    const dx = (e.clientX - startX) / zoomScale;
    const dy = (e.clientY - startY) / zoomScale;

    const guides: AlignmentGuide[] = [];

    const updatedElements = layout.elements.map((el) => {
      const init = initialElements.find((item) => item.id === el.id);
      if (!init || el.isLocked) return el;

      let newX = init.x;
      let newY = init.y;
      let newWidth = init.width;
      let newHeight = init.height;

      if (isDragging) {
        newX = init.x + dx;
        newY = init.y + dy;

        // Snapping logic
        if (snapToGrid) {
          const gridSnapThreshold = 8;
          const snapX = Math.round(newX / 20) * 20;
          const snapY = Math.round(newY / 20) * 20;
          if (Math.abs(newX - snapX) < gridSnapThreshold) newX = snapX;
          if (Math.abs(newY - snapY) < gridSnapThreshold) newY = snapY;
        }

        if (snapToElements && !e.altKey) {
          const snapThreshold = 6;

          // Snap to Canvas Center X (397)
          const centerX = newX + newWidth / 2;
          if (Math.abs(centerX - 397) < snapThreshold) {
            newX = 397 - newWidth / 2;
            guides.push({ type: 'x', position: 397 });
          }

          // Snap to Canvas Center Y (561.5)
          const centerY = newY + newHeight / 2;
          if (Math.abs(centerY - 561.5) < snapThreshold) {
            newY = 561.5 - newHeight / 2;
            guides.push({ type: 'y', position: 561.5 });
          }

          // Snap to Safe Area Margins (40px)
          if (Math.abs(newX - 40) < snapThreshold) {
            newX = 40;
            guides.push({ type: 'x', position: 40 });
          }
          if (Math.abs(newX + newWidth - 754) < snapThreshold) {
            newX = 754 - newWidth;
            guides.push({ type: 'x', position: 754 });
          }

          // Snap to other elements
          layout.elements.forEach((other) => {
            if (other.id === el.id || selectedIds.includes(other.id)) return;
            // Left alignment
            if (Math.abs(newX - other.x) < snapThreshold) {
              newX = other.x;
              guides.push({ type: 'x', position: other.x });
            }
            // Top alignment
            if (Math.abs(newY - other.y) < snapThreshold) {
              newY = other.y;
              guides.push({ type: 'y', position: other.y });
            }
          });
        }
      } else if (isResizing && resizeHandle) {
        if (resizeHandle.includes('e')) newWidth = Math.max(20, init.width + dx);
        if (resizeHandle.includes('s')) newHeight = Math.max(10, init.height + dy);
        if (resizeHandle.includes('w')) {
          const w = Math.max(20, init.width - dx);
          newX = init.x + (init.width - w);
          newWidth = w;
        }
        if (resizeHandle.includes('n')) {
          const h = Math.max(10, init.height - dy);
          newY = init.y + (init.height - h);
          newHeight = h;
        }
      }

      return {
        ...el,
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      };
    });

    setActiveGuides(guides);
    setLayout({ ...layout, elements: updatedElements });
  };

  const handlePointerUp = (_e: React.PointerEvent) => {
    if (marqueeBox) {
      setMarqueeBox(null);
    }
    if (draggingRef.current.isDragging || draggingRef.current.isResizing) {
      draggingRef.current.isDragging = false;
      draggingRef.current.isResizing = false;
      setActiveGuides([]);
      pushHistory(layout);
    }
  };

  // Pre-Publish Validation
  const handleOpenValidation = () => {
    const issues: { id?: string; level: 'error' | 'warning'; message: string }[] = [];

    if (!template.name.trim()) {
      issues.push({ level: 'error', message: 'Template name is required.' });
    }

    const dynamicFields = layout.elements.filter((el) => el.type === 'text' && (el.content?.includes('{{') || el.fieldBinding));
    if (dynamicFields.length === 0) {
      issues.push({ level: 'error', message: 'Template must contain at least one dynamic biodata field.' });
    }

    // Check elements out of printable area (A4 bounds 794x1123)
    layout.elements.forEach((el) => {
      if (el.x < 0 || el.y < 0 || el.x + el.width > 794 || el.y + el.height > 1123) {
        issues.push({
          id: el.id,
          level: 'warning',
          message: `Element '${el.content?.slice(0, 20) || el.type}' extends outside the printable A4 area.`,
        });
      }
    });

    // Check for overlapping text elements
    for (let i = 0; i < layout.elements.length; i++) {
      for (let j = i + 1; j < layout.elements.length; j++) {
        const a = layout.elements[i];
        const b = layout.elements[j];
        if (a.type === 'text' && b.type === 'text') {
          const overlap =
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
          if (overlap) {
            issues.push({
              id: a.id,
              level: 'warning',
              message: `2 text elements ('${a.content?.slice(0, 15)}' and '${b.content?.slice(0, 15)}') are overlapping.`,
            });
            break;
          }
        }
      }
    }

    setValidationIssues(issues);
    setIsValidationOpen(true);
  };

  // Final Save / Publish
  const handleSave = async (targetStatus?: string) => {
    setSaving(true);
    const finalStatus = targetStatus || template.status;

    let effectiveThumbnailUrl = publishMetadata.thumbnail_url;

    // Automatic pre-rendered snapshot capture
    if (canvasRef.current) {
      try {
        const base64Data = await toJpeg(canvasRef.current, {
          quality: 0.85,
          pixelRatio: 0.5,
          backgroundColor: layout.page.background || '#FFFFFF',
          style: {
            transform: 'none',
            transformOrigin: 'top left',
          },
        });
        const uploadRes = await adminUploadTemplateThumbnailApi(template.id, base64Data);
        if (uploadRes?.thumbnail_url) {
          effectiveThumbnailUrl = uploadRes.thumbnail_url;
        }
      } catch (thumbErr) {
        console.warn('Auto-thumbnail generation skipped:', thumbErr);
      }
    }

    const res = await adminUpdateTemplateApi(template.id, {
      name: publishMetadata.name,
      description: publishMetadata.description,
      category_ids: publishMetadata.category_ids,
      pricing_type: publishMetadata.pricing_type,
      badge: publishMetadata.badge,
      thumbnail_url: effectiveThumbnailUrl,
      layout_json: {
        ...layout,
        page: {
          ...layout.page,
          selectedDummyIndex,
          sampleData: TEN_DUMMY_PROFILES[selectedDummyIndex].data,
        } as any,
      },
      status: finalStatus as any,
      font_family: layout.page.fontFamily,
      default_bg: layout.page.background,
      change_summary: `Saved visual builder changes (v${template.version + 1})`,
    });

    setSaving(false);
    setIsValidationOpen(false);

    if (res) {
      if (onSaved) onSaved(res);
      alert(`Template '${res.name}' ${finalStatus === 'PUBLISHED' ? 'published' : 'saved'} successfully!`);
    } else {
      alert('Failed to save template. Check your network or admin permissions.');
    }
  };



  const sampleData = (TEN_DUMMY_PROFILES[selectedDummyIndex] || TEN_DUMMY_PROFILES[0]).data;

  return (
    <div className="h-screen flex flex-col bg-slate-100 text-slate-900 font-sans overflow-hidden select-none">
      {/* ── Top Header Toolbar ── */}
      <div className="h-14 bg-white border-b border-gray-200 px-4 sm:px-5 flex items-center justify-between shrink-0 z-30 shadow-2xs gap-4">
        {/* Left: Template Info */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            title="Back to Template Manager"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-gray-900 truncate max-w-[180px]">
              {template.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-pink-50 text-[#F01472] border border-pink-200 text-[10px] font-bold uppercase whitespace-nowrap">
              Visual Editor
            </span>
          </div>
        </div>

        {/* Center: Canvas Controls (Zoom, Undo, Guides) */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
          {/* Zoom Selector */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs border border-gray-200 shrink-0">
            <button
              onClick={() => setZoomScale(Math.max(0.25, Number((zoomScale - 0.1).toFixed(2))))}
              className="p-1.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer"
              title="Zoom Out"
            >
              <Minus size={13} />
            </button>
            <select
              value={zoomScale}
              onChange={(e) => setZoomScale(Number(e.target.value))}
              className="bg-transparent text-gray-800 text-xs font-mono px-1 border-none focus:outline-none cursor-pointer"
            >
              <option value={calculateFitScale()} className="bg-white text-gray-800">
                Fit ({Math.round(calculateFitScale() * 100)}%)
              </option>
              <option value={0.4} className="bg-white text-gray-800">40%</option>
              <option value={0.5} className="bg-white text-gray-800">50%</option>
              <option value={0.6} className="bg-white text-gray-800">60%</option>
              <option value={0.7} className="bg-white text-gray-800">70%</option>
              <option value={1.0} className="bg-white text-gray-800">100%</option>
            </select>
            <button
              onClick={() => setZoomScale(Math.min(1.5, Number((zoomScale + 0.1).toFixed(2))))}
              className="p-1.5 hover:bg-gray-200 rounded text-gray-600 cursor-pointer"
              title="Zoom In"
            >
              <Plus size={13} />
            </button>
            <button
              onClick={handleFitToScreen}
              className="px-1.5 py-0.5 bg-pink-50 hover:bg-pink-100 text-[#F01472] rounded text-[10px] font-bold cursor-pointer transition border border-pink-200 whitespace-nowrap ml-0.5"
              title="Fit Entire A4 Page to Screen Height"
            >
              Fit
            </button>
          </div>

          {/* History & Guides Pill */}
          <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg text-xs border border-gray-200 shrink-0">
            <button
              onClick={handleUndo}
              disabled={historyIdx === 0}
              className="p-1.5 hover:bg-gray-200 disabled:opacity-30 rounded text-gray-600 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw size={13} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIdx === history.length - 1}
              className="p-1.5 hover:bg-gray-200 disabled:opacity-30 rounded text-gray-600 cursor-pointer"
              title="Redo (Ctrl+Shift+Z)"
            >
              <RotateCw size={13} />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-0.5" />
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded cursor-pointer transition ${showGrid ? 'bg-pink-100 text-[#F01472]' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Toggle Grid (20px)"
            >
              <Grid size={13} />
            </button>
            <button
              onClick={() => setShowSafeArea(!showSafeArea)}
              className={`p-1.5 rounded cursor-pointer transition ${showSafeArea ? 'bg-pink-100 text-[#F01472]' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Toggle Safe Area Guide"
            >
              <Shield size={13} />
            </button>
            <button
              onClick={() => setSnapToElements(!snapToElements)}
              className={`p-1.5 rounded cursor-pointer transition ${snapToElements ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Toggle Smart Snapping"
            >
              <Sparkles size={13} />
            </button>
          </div>

          {/* 10 Types of Dummy Data Switcher (DOB < 2005) */}
          <div className="flex items-center gap-1.5 bg-pink-50/90 p-1 rounded-xl text-xs border border-pink-200 shrink-0 shadow-2xs">
            <button
              onClick={() => handleCycleDummyData()}
              className="px-2.5 py-1 rounded-lg bg-[#F01472] hover:bg-[#C80E5A] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
              title="Click to cycle to the next dummy data profile (10 types available, all DOB < 2005)"
            >
              <Sparkles size={12} />
              <span>Change Dummy Data ({selectedDummyIndex + 1}/10)</span>
            </button>

            <select
              value={selectedDummyIndex}
              onChange={(e) => handleCycleDummyData(Number(e.target.value))}
              className="bg-white text-xs px-2 py-1 rounded-lg text-gray-800 font-semibold border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer max-w-[200px] sm:max-w-[240px] truncate"
              title="Select one of the 10 authentic dummy data profiles"
            >
              {TEN_DUMMY_PROFILES.map((prof, idx) => (
                <option key={prof.id} value={idx}>
                  #{idx + 1}: {prof.data.personalDetails.fullName} ({prof.gender === 'male' ? 'M' : 'F'}, {prof.data.personalDetails.dateOfBirth.split(' ').pop()})
                </option>
              ))}
            </select>

            <div
              className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap bg-white text-[#F01472] border border-pink-200 shadow-2xs cursor-default select-none"
              title="Active Live Profile Data"
            >
              <Eye size={12} className="text-[#F01472]" />
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Full Preview Toggle */}
          <button
            onClick={() => setPreviewModeOnly(!previewModeOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
              previewModeOnly ? 'bg-amber-500 border-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
            }`}
          >
            {previewModeOnly ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{previewModeOnly ? 'Exit' : 'Preview'}</span>
          </button>

          {/* Save Draft */}
          <button
            onClick={() => handleSave('DRAFT')}
            disabled={saving}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Save size={13} />
            <span>Save</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={handleOpenValidation}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F01472] to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <CheckCircle size={13} />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout Body ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Drawer Navigation Tabs */}
        {!previewModeOnly && (
          <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 shrink-0 z-20 shadow-2xs">
            <button
              onClick={() => setActiveTab('elements')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'elements' ? 'bg-[#F01472] text-white shadow-md shadow-rose-500/25' : 'text-gray-500 hover:bg-rose-50 hover:text-[#F01472]'
              }`}
              title="Canvas Elements"
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'fields' ? 'bg-[#F01472] text-white shadow-md shadow-rose-500/25' : 'text-gray-500 hover:bg-rose-50 hover:text-[#F01472]'
              }`}
              title="Dynamic Biodata Fields"
            >
              <Sparkles size={18} />
              <span>Fields</span>
            </button>
            <button
              onClick={() => setActiveTab('decorations')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'decorations' ? 'bg-[#F01472] text-white shadow-md shadow-rose-500/25' : 'text-gray-500 hover:bg-rose-50 hover:text-[#F01472]'
              }`}
              title="Matrimonial Motifs & Decorations"
            >
              <Sun size={18} />
              <span>Motifs</span>
            </button>
            <button
              onClick={() => setActiveTab('background')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'background' ? 'bg-[#F01472] text-white shadow-md shadow-rose-500/25' : 'text-gray-500 hover:bg-rose-50 hover:text-[#F01472]'
              }`}
              title="Page Background System"
            >
              <Palette size={18} />
              <span>Page BG</span>
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'layers' ? 'bg-[#F01472] text-white shadow-md shadow-rose-500/25' : 'text-gray-500 hover:bg-rose-50 hover:text-[#F01472]'
              }`}
              title="Layer Management"
            >
              <Layers size={18} />
              <span>Layers</span>
            </button>
          </div>
        )}

        {/* Left Sub-drawer Panel Content */}
        {!previewModeOnly && (
          <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto shrink-0 space-y-6 text-gray-800 shadow-2xs">
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                  <Plus size={14} /> Add Canvas Elements
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleAddElement('text')}
                    className="p-3 bg-gray-50 hover:bg-rose-50/60 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-800 flex flex-col items-center gap-2 transition cursor-pointer"
                  >
                    <Type size={20} className="text-[#F01472]" />
                    <span>Text Box</span>
                  </button>
                  <button
                    onClick={() => handleAddElement('image')}
                    className="p-3 bg-gray-50 hover:bg-purple-50/60 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-800 flex flex-col items-center gap-2 transition cursor-pointer"
                  >
                    <ImageIcon size={20} className="text-purple-600" />
                    <span>Photo Frame</span>
                  </button>
                  <button
                    onClick={() => handleAddElement('divider')}
                    className="p-3 bg-gray-50 hover:bg-amber-50/60 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-800 flex flex-col items-center gap-2 transition cursor-pointer"
                  >
                    <Minus size={20} className="text-amber-600" />
                    <span>Divider Line</span>
                  </button>
                  <button
                    onClick={() => handleAddElement('shape')}
                    className="p-3 bg-gray-50 hover:bg-emerald-50/60 rounded-2xl border border-gray-200 text-xs font-semibold text-gray-800 flex flex-col items-center gap-2 transition cursor-pointer"
                  >
                    <Square size={20} className="text-emerald-600" />
                    <span>Shape</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'fields' && (
              <div className="space-y-3">
                {/* Auto-Fill Complete Layout Card */}
                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#F01472]" /> Auto-Fill Layout
                    </span>
                    <span className="text-[10px] bg-pink-100 text-[#F01472] px-1.5 py-0.5 rounded font-bold">1-Click</span>
                  </div>
                  <p className="text-[10px] text-gray-600">
                    Automatically fill all structured biodata fields onto this background.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => pushHistory({ ...layout, elements: DEFAULT_MARATHI_BIODATA_ELEMENTS })}
                      className="px-2.5 py-1.5 bg-[#F01472] hover:bg-[#C80E5A] text-white rounded-xl text-[11px] font-bold transition shadow-xs cursor-pointer text-center"
                      title="Auto-fill Marathi Matrimonial format"
                    >
                      मराठी (Marathi)
                    </button>
                    <button
                      onClick={() => pushHistory({ ...layout, elements: DEFAULT_ENGLISH_BIODATA_ELEMENTS })}
                      className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-[11px] font-bold transition border border-gray-300 cursor-pointer text-center"
                      title="Auto-fill English Matrimonial format"
                    >
                      English Standard
                    </button>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1.5 pt-1">
                  <Sparkles size={14} className="text-[#F01472]" /> Individual Fields
                </h3>
                <p className="text-[11px] text-gray-500">Click or drag any field onto canvas.</p>
                <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
                  {DYNAMIC_FIELDS_CATALOG.map((ph, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddElement('text', ph.value, ph.binding)}
                      className="w-full p-2.5 bg-gray-50/80 hover:bg-rose-50/50 rounded-xl border border-gray-200 text-left text-xs font-medium text-gray-700 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-gray-900">{ph.label}</div>
                        <div className="text-[10px] text-gray-400 font-mono truncate">{ph.value}</div>
                      </div>
                      <span className="text-[10px] text-[#F01472] font-mono group-hover:underline shrink-0 ml-1">+ Add</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'decorations' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                  <Sun size={14} className="text-amber-500" /> Traditional Motifs & Decor
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {DECORATION_PRESETS.map((dec) => (
                    <button
                      key={dec.key}
                      onClick={() => handleAddElement('decoration', undefined, undefined, dec.key)}
                      className="p-3 bg-gray-50 hover:bg-amber-50/50 rounded-2xl border border-gray-200 text-xs text-gray-800 flex flex-col items-center gap-2 transition cursor-pointer"
                    >
                      <div className="w-10 h-10 text-amber-500 flex items-center justify-center">
                        {BUILTIN_DECORATION_SVGS[dec.key]}
                      </div>
                      <span className="text-[11px] text-center font-medium leading-tight text-gray-700">{dec.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                  <Palette size={14} /> Background Design System
                </h3>

                {/* Background Type Radio Selector */}
                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Fill Type</label>
                  <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold border border-gray-200">
                    <button
                      onClick={() => pushHistory({ ...layout, page: { ...layout.page, backgroundType: 'color' } })}
                      className={`py-1.5 rounded-lg transition cursor-pointer ${
                        (layout.page.backgroundType || 'color') === 'color' ? 'bg-white text-[#F01472] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Solid
                    </button>
                    <button
                      onClick={() => pushHistory({ ...layout, page: { ...layout.page, backgroundType: 'gradient' } })}
                      className={`py-1.5 rounded-lg transition cursor-pointer ${
                        layout.page.backgroundType === 'gradient' ? 'bg-white text-[#F01472] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Gradient
                    </button>
                    <button
                      onClick={() => pushHistory({ ...layout, page: { ...layout.page, backgroundType: 'image' } })}
                      className={`py-1.5 rounded-lg transition cursor-pointer ${
                        layout.page.backgroundType === 'image' ? 'bg-white text-[#F01472] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Image
                    </button>
                  </div>
                </div>

                {/* Solid Color */}
                {(layout.page.backgroundType || 'color') === 'color' && (
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={layout.page.background || '#FFFFFF'}
                        onChange={(e) => pushHistory({ ...layout, page: { ...layout.page, background: e.target.value } })}
                        className="w-9 h-9 rounded bg-transparent border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={layout.page.background || '#FFFFFF'}
                        onChange={(e) => pushHistory({ ...layout, page: { ...layout.page, background: e.target.value } })}
                        className="flex-1 bg-gray-50 border border-gray-300 text-xs px-2.5 py-1 rounded text-gray-900 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Gradient Builder */}
                {layout.page.backgroundType === 'gradient' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Gradient Type</label>
                      <select
                        value={layout.page.gradient?.type || 'linear'}
                        onChange={(e) =>
                          pushHistory({
                            ...layout,
                            page: {
                              ...layout.page,
                              gradient: {
                                type: e.target.value as any,
                                colors: layout.page.gradient?.colors || ['#FFF5F7', '#FFE4E6'],
                                angle: layout.page.gradient?.angle || 135,
                              },
                            },
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-300 text-xs p-1.5 rounded text-gray-900"
                      >
                        <option value="linear">Linear Gradient</option>
                        <option value="radial">Radial Gradient</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Color 1</label>
                        <input
                          type="color"
                          value={layout.page.gradient?.colors?.[0] || '#FFF5F7'}
                          onChange={(e) =>
                            pushHistory({
                              ...layout,
                              page: {
                                ...layout.page,
                                gradient: {
                                  type: layout.page.gradient?.type || 'linear',
                                  colors: [e.target.value, layout.page.gradient?.colors?.[1] || '#FFE4E6'],
                                  angle: layout.page.gradient?.angle || 135,
                                },
                              },
                            })
                          }
                          className="w-full h-8 rounded bg-transparent border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Color 2</label>
                        <input
                          type="color"
                          value={layout.page.gradient?.colors?.[1] || '#FFE4E6'}
                          onChange={(e) =>
                            pushHistory({
                              ...layout,
                              page: {
                                ...layout.page,
                                gradient: {
                                  type: layout.page.gradient?.type || 'linear',
                                  colors: [layout.page.gradient?.colors?.[0] || '#FFF5F7', e.target.value],
                                  angle: layout.page.gradient?.angle || 135,
                                },
                              },
                            })
                          }
                          className="w-full h-8 rounded bg-transparent border border-gray-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Background Image Upload & Drag-and-Drop Dropzone */}
                {layout.page.backgroundType === 'image' && (
                  <div className="space-y-3">
                    {/* Drag and Drop Zone */}
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Drag & Drop Background Image</label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                pushHistory({
                                  ...layout,
                                  page: {
                                    ...layout.page,
                                    backgroundType: 'image',
                                    backgroundImage: evt.target.result as string,
                                  },
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  pushHistory({
                                    ...layout,
                                    page: {
                                      ...layout.page,
                                      backgroundType: 'image',
                                      backgroundImage: evt.target.result as string,
                                    },
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="w-full p-4 border-2 border-dashed border-pink-300 hover:border-[#F01472] bg-rose-50/40 hover:bg-rose-50/80 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group shadow-inner"
                      >
                        <ImageIcon size={28} className="text-[#F01472] group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-xs font-bold text-gray-800">Drop Background Image Here</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">or click to browse local file (PNG, JPG, SVG, WebP)</span>
                      </div>
                    </div>

                    {/* Image URL Input Alternative */}
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Image URL (Alternative)</label>
                      <input
                        type="text"
                        placeholder="https://... image URL"
                        value={layout.page.backgroundImage || ''}
                        onChange={(e) =>
                          pushHistory({
                            ...layout,
                            page: { ...layout.page, backgroundType: 'image', backgroundImage: e.target.value },
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-300 text-xs p-2 rounded-xl text-gray-900"
                      />
                    </div>

                    {/* Preset Matrimonial Background Patterns */}
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Matrimonial Texture Presets</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { name: 'Red Mandala', url: '/templates/red_mandala.png' },
                          { name: 'Floral Shloka', url: '/templates/floral_ganesha.jpg' },
                          { name: 'Shiv Lotus', url: '/templates/shiv_parvati_lotus.png' },
                          { name: 'Pink Lotus', url: '/templates/pink_vintage_lotus.png' },
                          { name: 'Gold Parchment', url: '/templates/gold_parchment_mandala.png' },
                          { name: 'Clear Canvas', url: '' },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              pushHistory({
                                ...layout,
                                page: {
                                  ...layout.page,
                                  backgroundType: preset.url ? 'image' : 'color',
                                  backgroundImage: preset.url || undefined,
                                },
                              })
                            }
                            className="p-1.5 bg-gray-50 hover:bg-rose-50 rounded-xl border border-gray-200 text-[10px] font-semibold text-gray-700 truncate transition cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Image Fit</label>
                      <select
                        value={layout.page.backgroundFit || 'cover'}
                        onChange={(e) => pushHistory({ ...layout, page: { ...layout.page, backgroundFit: e.target.value as any } })}
                        className="w-full bg-gray-50 border border-gray-300 text-xs p-1.5 rounded-xl text-gray-900"
                      >
                        <option value="cover">Cover (Crop to Fit)</option>
                        <option value="contain">Contain (Aspect Fit)</option>
                        <option value="stretch">Stretch (Fill Canvas)</option>
                        <option value="original">Original (Tile Texture)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">
                        Opacity: {Math.round((layout.page.backgroundOpacity ?? 1) * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={layout.page.backgroundOpacity ?? 1}
                        onChange={(e) => pushHistory({ ...layout, page: { ...layout.page, backgroundOpacity: Number(e.target.value) } })}
                        className="w-full accent-[#F01472] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Background Lock Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      {layout.page.backgroundLocked ? <Lock size={13} className="text-amber-500" /> : <Unlock size={13} className="text-emerald-500" />}
                      Background Layer
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {layout.page.backgroundLocked ? '🔒 Locked — drag won\'t move BG' : '🔓 Unlocked — background is editable'}
                    </div>
                  </div>
                  <button
                    onClick={() => pushHistory({ ...layout, page: { ...layout.page, backgroundLocked: !layout.page.backgroundLocked } })}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                      layout.page.backgroundLocked
                        ? 'bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-100 border border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {layout.page.backgroundLocked ? 'Unlock' : 'Lock'}
                  </button>
                </div>

                {/* Safe Area Settings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-gray-600">Safe Area Margins (px)</label>
                    <button
                      onClick={() => setShowSafeArea(!showSafeArea)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition cursor-pointer ${
                        showSafeArea ? 'bg-pink-100 text-[#F01472]' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {showSafeArea ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                      <div key={side}>
                        <label className="text-[10px] text-gray-600 capitalize block mb-0.5">{side}</label>
                        <input
                          type="number"
                          value={(layout.page.safeArea?.[side] ?? 40)}
                          onChange={(e) => pushHistory({
                            ...layout,
                            page: {
                              ...layout.page,
                              safeArea: {
                                top: layout.page.safeArea?.top ?? 40,
                                right: layout.page.safeArea?.right ?? 40,
                                bottom: layout.page.safeArea?.bottom ?? 40,
                                left: layout.page.safeArea?.left ?? 40,
                                [side]: Number(e.target.value),
                              },
                            },
                          })}
                          className="w-full bg-gray-50 border border-gray-300 text-xs p-1.5 rounded font-mono text-gray-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Data Behavior */}
                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Missing Data Behavior</label>
                  <select
                    value={layout.page.missingDataBehavior || 'placeholder'}
                    onChange={(e) => pushHistory({ ...layout, page: { ...layout.page, missingDataBehavior: e.target.value as any } })}
                    className="w-full bg-gray-50 border border-gray-300 text-xs p-1.5 rounded-xl text-gray-900"
                  >
                    <option value="placeholder">Show Placeholder (—)</option>
                    <option value="hide">Hide Empty Fields</option>
                    <option value="not_provided">Show "Not Provided"</option>
                  </select>
                  <p className="text-[10px] text-gray-500 mt-1">Controls how fields without user data appear in preview &amp; PDF.</p>
                </div>

                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Global Font Family</label>
                  <select
                    value={layout.page.fontFamily}
                    onChange={(e) => pushHistory({ ...layout, page: { ...layout.page, fontFamily: e.target.value } })}
                    className="w-full bg-gray-50 border border-gray-300 text-xs px-2.5 py-1.5 rounded text-gray-900"
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                  <Layers size={14} /> Layer Management
                </h3>
                <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                  {[...layout.elements]
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((el) => {
                      const isSelected = selectedIds.includes(el.id);
                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedIds([el.id])}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                            isSelected ? 'bg-pink-50 border-pink-300 text-[#F01472]' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="truncate flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-bold">
                              {el.type}
                            </span>
                            <span className="truncate">{el.content || el.fieldBinding || el.id}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateSelected({ isLocked: !el.isLocked });
                              }}
                              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800"
                            >
                              {el.isLocked ? <Lock size={12} className="text-amber-500" /> : <Unlock size={12} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Center Canvas Viewport */}
        <div
          ref={viewportRef}
          className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto flex items-center justify-center relative min-h-0"
          onPointerDown={(e) => handlePointerDown(e)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Sized DOM Box matching exact scaled dimensions so flex centering & margins work 100% clean */}
          <div
            style={{
              width: `${Math.round(794 * zoomScale)}px`,
              height: `${Math.round(1123 * zoomScale)}px`,
              position: 'relative',
              margin: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Standard A4 Interactive Canvas */}
            <div
              ref={canvasRef}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  e.preventDefault();
                  e.stopPropagation();
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    if (evt.target?.result) {
                      pushHistory({
                        ...layout,
                        page: {
                          ...layout.page,
                          backgroundType: 'image',
                          backgroundImage: evt.target.result as string,
                        },
                      });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="relative shadow-2xl overflow-hidden bg-white ring-1 ring-black/10"
              style={{
                width: '794px',
                height: '1123px',
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {/* Renderer */}
              <div id="preview-pdf-content" className="w-full h-full">
                <BiodataRenderer
                  layoutJson={layout}
                  data={sampleData}
                />
              </div>

              {/* Grid Overlay */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              )}

              {/* Safe Area Margin Box — uses configurable safeArea from page config */}
              {showSafeArea && (() => {
                const safe = layout.page.safeArea || { top: 40, right: 40, bottom: 40, left: 40 };
                return (
                  <div
                    className="absolute border-2 border-dashed border-pink-400/40 pointer-events-none z-10 flex items-start justify-end p-2"
                    style={{
                      top: safe.top,
                      left: safe.left,
                      right: safe.right,
                      bottom: safe.bottom,
                    }}
                  >
                    <span className="text-[9px] font-extrabold font-mono text-pink-400/70 uppercase">
                      Safe Area ({safe.top}/{safe.right}/{safe.bottom}/{safe.left}px)
                    </span>
                  </div>
                );
              })()}

              {/* Smart Alignment Guides */}
              {activeGuides.map((guide, idx) => (
                <div
                  key={idx}
                  className="absolute pointer-events-none z-40 bg-pink-500"
                  style={{
                    left: guide.type === 'x' ? `${guide.position}px` : '0px',
                    top: guide.type === 'y' ? `${guide.position}px` : '0px',
                    width: guide.type === 'x' ? '1px' : '100%',
                    height: guide.type === 'y' ? '1px' : '100%',
                  }}
                />
              ))}

              {/* Rubber-band Marquee Drag Selection Box */}
              {marqueeBox && (
                <div
                  className="absolute border-2 border-pink-500 bg-pink-500/10 pointer-events-none z-40"
                  style={{
                    left: `${Math.min(marqueeBox.startX, marqueeBox.endX)}px`,
                    top: `${Math.min(marqueeBox.startY, marqueeBox.endY)}px`,
                    width: `${Math.abs(marqueeBox.endX - marqueeBox.startX)}px`,
                    height: `${Math.abs(marqueeBox.endY - marqueeBox.startY)}px`,
                  }}
                />
              )}

              {/* Interactive Canvas Overlay Handles */}
              {!previewModeOnly &&
                layout.elements.map((el) => {
                  const isSelected = selectedIds.includes(el.id);
                  return (
                    <div
                      key={el.id}
                      onPointerDown={(e) => handlePointerDown(e, el.id)}
                      className={`absolute cursor-move border-2 transition-shadow ${
                        isSelected
                          ? 'border-pink-500 bg-pink-500/10 shadow-lg ring-2 ring-pink-500/30'
                          : 'border-transparent hover:border-pink-400/60'
                      }`}
                      style={{
                        left: `${el.x}px`,
                        top: `${el.y}px`,
                        width: `${el.width}px`,
                        height: `${el.height}px`,
                        zIndex: (el.zIndex || 1) + 20,
                        transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      }}
                    >
                      {/* Floating Context Toolbar directly above element */}
                      {isSelected && primarySelected?.id === el.id && (
                        <div
                          className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xl shadow-2xl z-50 text-xs whitespace-nowrap"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          {el.type === 'text' && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateSelected({
                                    style: { fontWeight: el.style?.fontWeight === 'bold' ? 'normal' : 'bold' },
                                  })
                                }
                                className={`p-1 rounded cursor-pointer ${el.style?.fontWeight === 'bold' ? 'bg-pink-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                                title="Bold"
                              >
                                <Bold size={12} />
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateSelected({
                                    style: { fontStyle: el.style?.fontStyle === 'italic' ? 'normal' : 'italic' },
                                  })
                                }
                                className={`p-1 rounded cursor-pointer ${el.style?.fontStyle === 'italic' ? 'bg-pink-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                                title="Italic"
                              >
                                <Italic size={12} />
                              </button>
                            </>
                          )}

                          <button
                            onClick={handleDuplicateSelected}
                            className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
                            title="Duplicate Element"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            onClick={handleDeleteSelected}
                            className="p-1 hover:bg-rose-900/50 text-rose-400 rounded cursor-pointer"
                            title="Delete Element"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}

                      {/* 8-Direction Sizing Handles */}
                      {isSelected && !el.isLocked && (
                        <>
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'nw')}
                            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-nwse-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'ne')}
                            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-nesw-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'se')}
                            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-nwse-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'sw')}
                            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-nesw-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'n')}
                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-ns-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 's')}
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-ns-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'e')}
                            className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-ew-resize z-50"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'w')}
                            className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-ew-resize z-50"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Property Inspector Panel */}
        {!previewModeOnly && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 space-y-5 text-gray-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                <Sliders size={14} /> Element Inspector
              </h3>
              {selectedIds.length > 1 && (
                <span className="px-2 py-0.5 rounded bg-pink-100 text-[#F01472] text-[10px] font-extrabold">
                  {selectedIds.length} Selected
                </span>
              )}
            </div>

            {primarySelected ? (
              <div className="space-y-4 text-xs">
                {/* Element ID & Type */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-mono text-[#F01472] font-bold truncate max-w-[160px]">{primarySelected.id}</span>
                  <span className="uppercase text-[10px] px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-bold">
                    {primarySelected.type}
                  </span>
                </div>

                {/* Text Content Editor */}
                {primarySelected.type === 'text' && (
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Text / Binding Template</label>
                    <textarea
                      rows={3}
                      value={primarySelected.content || ''}
                      onChange={(e) => handleUpdateSelected({ content: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-900 font-mono text-xs focus:ring-1 focus:ring-pink-500 focus:bg-white"
                    />
                  </div>
                )}

                {/* Photo Frame Options */}
                {primarySelected.type === 'image' && (
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase">Photo Frame Style</h4>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1.5">Frame Shape</label>
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateSelected({ shapeType: 'circle', style: { ...primarySelected.style, borderRadius: '50%' } })}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                            primarySelected.shapeType === 'circle' || primarySelected.shapeType === 'oval'
                              ? 'bg-[#F01472] border-[#F01472] text-white shadow-xs'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Round (Circle)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSelected({ shapeType: 'rectangle', style: { ...primarySelected.style, borderRadius: '0px' } })}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                            primarySelected.shapeType === 'rectangle' || primarySelected.shapeType === 'square'
                              ? 'bg-[#F01472] border-[#F01472] text-white shadow-xs'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Square
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSelected({ shapeType: 'rounded', style: { ...primarySelected.style, borderRadius: '12px' } })}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition cursor-pointer text-center ${
                            primarySelected.shapeType === 'rounded' || !primarySelected.shapeType
                              ? 'bg-[#F01472] border-[#F01472] text-white shadow-xs'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Rounded
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Image Fit</label>
                      <select
                        value={primarySelected.style?.objectFit || 'cover'}
                        onChange={(e) => handleUpdateSelected({ style: { objectFit: e.target.value as any } })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900"
                      >
                        <option value="cover">Cover (Fill & Crop)</option>
                        <option value="contain">Contain (Show Full Image)</option>
                      </select>
                    </div>

                    {/* Sample Photo Presets (6 Females + 6 Males) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] text-gray-600 font-semibold">Change Photo (6 Female / 6 Male)</label>
                        <span className="text-[10px] text-gray-400 font-mono">12 Options</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5 mb-2">
                        {[...SAMPLE_FEMALE_PHOTOS, ...SAMPLE_MALE_PHOTOS].map((photo) => {
                          const isActive = primarySelected.content === photo.url;
                          return (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => {
                                handleUpdateSelected({
                                  content: photo.url,
                                  fieldBinding: 'personalDetails.photoUrl',
                                });
                              }}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                isActive
                                  ? 'border-[#F01472] ring-2 ring-pink-400/40 scale-105 shadow-xs'
                                  : 'border-gray-200 hover:border-pink-300 hover:scale-105'
                              }`}
                              title={`${photo.name} (${photo.tag})`}
                            >
                              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                              {isActive && (
                                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                  <div className="w-3.5 h-3.5 rounded-full bg-[#F01472] text-white flex items-center justify-center shadow-xs">
                                    <CheckCircle size={10} strokeWidth={3} />
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Upload custom image file for photo frame */}
                      <label className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[11px] font-semibold text-gray-700 cursor-pointer transition">
                        <Upload size={12} className="text-[#F01472]" />
                        <span>Upload Custom Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  handleUpdateSelected({
                                    content: evt.target.result as string,
                                    fieldBinding: 'personalDetails.photoUrl',
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Numeric Position X/Y & Width/Height (Advanced Controls) */}
                <div className="pt-2 border-t border-gray-200">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase mb-2">Position & Dimensions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-1">X (px)</label>
                      <input
                        type="number"
                        value={primarySelected.x}
                        onChange={(e) => handleUpdateSelected({ x: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-1">Y (px)</label>
                      <input
                        type="number"
                        value={primarySelected.y}
                        onChange={(e) => handleUpdateSelected({ y: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={primarySelected.width}
                        onChange={(e) => handleUpdateSelected({ width: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={primarySelected.height}
                        onChange={(e) => handleUpdateSelected({ height: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Behavior */}
                {primarySelected.type === 'text' && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase">Text Behavior</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {([
                        { value: 'fixed', label: 'Fixed Box' },
                        { value: 'autoHeight', label: 'Auto Height' },
                        { value: 'autoFontSize', label: 'Auto Font' },
                        { value: 'wrap', label: 'Word Wrap' },
                      ] as const).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleUpdateSelected({ style: { textWrap: opt.value === 'wrap' ? 'wrap' : 'nowrap' } })}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                            (primarySelected.style?.textWrap === 'wrap' && opt.value === 'wrap') ||
                            (primarySelected.style?.textWrap !== 'wrap' && opt.value === 'fixed')
                              ? 'bg-rose-100 border-rose-300 text-[#F01472]'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typography & Colors */}
                {primarySelected.type === 'text' && (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase">Typography & Colors</h4>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Font Family</label>
                      <select
                        value={primarySelected.style?.fontFamily || layout.page.fontFamily}
                        onChange={(e) => handleUpdateSelected({ style: { fontFamily: e.target.value } })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900"
                      >
                        {FONT_FAMILIES.map((f) => (
                          <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Font Size (px)</label>
                        <input
                          type="number"
                          value={primarySelected.style?.fontSize || 16}
                          onChange={(e) => handleUpdateSelected({ style: { fontSize: Number(e.target.value) } })}
                          className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Font Weight</label>
                        <select
                          value={primarySelected.style?.fontWeight || 'normal'}
                          onChange={(e) => handleUpdateSelected({ style: { fontWeight: e.target.value } })}
                          className="w-full bg-gray-50 border border-gray-300 rounded p-1.5 text-gray-900"
                        >
                          <option value="normal">Normal</option>
                          <option value="semibold">SemiBold</option>
                          <option value="bold">Bold</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Text Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={primarySelected.style?.color || '#000000'}
                          onChange={(e) => handleUpdateSelected({ style: { color: e.target.value } })}
                          className="w-8 h-8 rounded bg-transparent border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primarySelected.style?.color || '#000000'}
                          onChange={(e) => handleUpdateSelected({ style: { color: e.target.value } })}
                          className="flex-1 bg-gray-50 border border-gray-300 text-xs px-2.5 py-1 rounded text-gray-900 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Text Alignment</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl text-xs">
                        <button
                          onClick={() => handleUpdateSelected({ style: { textAlign: 'left' } })}
                          className={`flex-1 py-1 rounded cursor-pointer flex justify-center ${primarySelected.style?.textAlign === 'left' ? 'bg-white text-[#F01472] shadow-xs font-bold' : 'text-gray-600'}`}
                        >
                          <AlignLeft size={14} />
                        </button>
                        <button
                          onClick={() => handleUpdateSelected({ style: { textAlign: 'center' } })}
                          className={`flex-1 py-1 rounded cursor-pointer flex justify-center ${primarySelected.style?.textAlign === 'center' ? 'bg-white text-[#F01472] shadow-xs font-bold' : 'text-gray-600'}`}
                        >
                          <AlignCenter size={14} />
                        </button>
                        <button
                          onClick={() => handleUpdateSelected({ style: { textAlign: 'right' } })}
                          className={`flex-1 py-1 rounded cursor-pointer flex justify-center ${primarySelected.style?.textAlign === 'right' ? 'bg-white text-[#F01472] shadow-xs font-bold' : 'text-gray-600'}`}
                        >
                          <AlignRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alignment & Distribution Actions */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase">Alignment Actions</h4>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => handleAlignSelected('left')}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlignLeft size={12} /> Left
                    </button>
                    <button
                      onClick={() => handleAlignSelected('center')}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlignCenter size={12} /> Center
                    </button>
                    <button
                      onClick={() => handleAlignSelected('right')}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlignRight size={12} /> Right
                    </button>
                    <button
                      onClick={() => handleAlignSelected('top')}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Top
                    </button>
                    <button
                      onClick={() => handleAlignSelected('middle')}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Middle
                    </button>
                    <button
                      onClick={() => handleAlignSelected('bottom')}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Bottom
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleDuplicateSelected}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={14} /> Duplicate
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 space-y-2 border border-dashed border-gray-300 rounded-2xl">
                <Move size={24} className="mx-auto text-gray-400" />
                <p className="text-xs">Click or drag any element on the A4 canvas to visually select, move, and edit properties.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Pre-Publish Validation & Metadata Modal ── */}
      {isValidationOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="text-[#F01472]" size={20} />
                <span>Publish Template Check</span>
              </h3>
              <button
                onClick={() => setIsValidationOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Validation Issues List */}
            {validationIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Pre-Publish Validation Results</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {validationIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        issue.level === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>{issue.message}</span>
                      </div>
                      {issue.id && (
                        <button
                          onClick={() => {
                            setSelectedIds([issue.id!]);
                            setIsValidationOpen(false);
                          }}
                          className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 rounded text-[10px] font-bold shrink-0 cursor-pointer"
                        >
                          Go to Problem
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template Metadata Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-gray-600 block mb-1">Template Display Name</label>
                <input
                  type="text"
                  value={publishMetadata.name}
                  onChange={(e) => setPublishMetadata({ ...publishMetadata, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-gray-900 font-medium focus:ring-1 focus:ring-pink-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Pricing Plan</label>
                  <select
                    value={publishMetadata.pricing_type}
                    onChange={(e) => setPublishMetadata({ ...publishMetadata, pricing_type: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-gray-900"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM (LUXURY)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Traditional"
                    value={publishMetadata.badge}
                    onChange={(e) => setPublishMetadata({ ...publishMetadata, badge: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={publishMetadata.description}
                  onChange={(e) => setPublishMetadata({ ...publishMetadata, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setIsValidationOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave('PUBLISHED')}
                disabled={validationIssues.some((i) => i.level === 'error')}
                className="px-5 py-2 bg-gradient-to-r from-[#F01472] to-purple-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-pink-500/25 disabled:opacity-40 cursor-pointer"
              >
                Publish Template Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
