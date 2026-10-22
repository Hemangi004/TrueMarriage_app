import { getAuthHeaders } from './apiService';
import { API_V1_BASE_URL as API_BASE_URL } from '../config/api';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'divider' | 'shape' | 'border' | 'decoration';
  content?: string;
  fieldBinding?: string;
  decorationKey?: string;
  svgContent?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation?: number;
  isLocked?: boolean;
  groupId?: string;
  shapeType?: 'rectangle' | 'rounded' | 'circle' | 'oval' | 'line' | 'square' | 'arch';
  style: {
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    borderRadius?: string;
    border?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
    borderBottom?: string;
    letterSpacing?: string;
    lineHeight?: string | number;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
    opacity?: number;
    boxShadow?: string;
    textWrap?: 'wrap' | 'nowrap' | 'truncate';
    widthMode?: 'auto' | 'fixed';
    heightMode?: 'auto' | 'fixed';
  };
}

export interface BackgroundGradient {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
}

export interface BackgroundLibraryItem {
  id: string;
  name: string;
  category: 'Traditional' | 'Royal' | 'Floral' | 'Minimal' | 'Modern' | 'Elegant' | 'Cultural' | 'Wedding' | 'Premium';
  src: string;
  thumbnail?: string;
  safeArea?: { top: number; right: number; bottom: number; left: number };
}

export interface TemplateLayoutJSON {
  page: {
    width: number;
    height: number;
    background: string;
    backgroundType?: 'color' | 'gradient' | 'image';
    gradient?: BackgroundGradient;
    backgroundImage?: string;
    backgroundFit?: 'cover' | 'contain' | 'stretch' | 'original';
    backgroundOpacity?: number;
    backgroundPosition?: 'center' | 'top' | 'bottom' | 'custom';
    backgroundLocked?: boolean;
    missingDataBehavior?: 'placeholder' | 'hide' | 'not_provided';
    safeArea?: { top: number; right: number; bottom: number; left: number };
    padding: number;
    fontFamily: string;
    selectedDummyIndex?: number;
    sampleData?: any;
  };
  elements: TemplateElement[];
}

export const PRESET_BACKGROUND_LIBRARY: BackgroundLibraryItem[] = [
  {
    id: 'bg_traditional_gold',
    name: 'Traditional Gold Parchment',
    category: 'Traditional',
    src: '/templates/gold_parchment_mandala.png',
    safeArea: { top: 50, right: 40, bottom: 50, left: 40 },
  },
  {
    id: 'bg_red_mandala',
    name: 'Royal Crimson Mandala',
    category: 'Royal',
    src: '/templates/red_mandala.png',
    safeArea: { top: 60, right: 45, bottom: 60, left: 45 },
  },
  {
    id: 'bg_floral_shloka',
    name: 'Floral Ganesha Shloka',
    category: 'Floral',
    src: '/templates/floral_ganesha.jpg',
    safeArea: { top: 50, right: 40, bottom: 50, left: 40 },
  },
  {
    id: 'bg_pink_lotus',
    name: 'Pink Vintage Lotus',
    category: 'Floral',
    src: '/templates/pink_vintage_lotus.png',
    safeArea: { top: 50, right: 40, bottom: 50, left: 40 },
  },
  {
    id: 'bg_shiv_lotus',
    name: 'Shiv Parvati Divine Lotus',
    category: 'Cultural',
    src: '/templates/shiv_parvati_lotus.png',
    safeArea: { top: 55, right: 40, bottom: 55, left: 40 },
  },
  {
    id: 'bg_wedding_mandap',
    name: 'Royal Wedding Arch',
    category: 'Wedding',
    src: '/templates/gold_parchment_mandala.png',
    safeArea: { top: 60, right: 40, bottom: 60, left: 40 },
  },
  {
    id: 'bg_minimal_cream',
    name: 'Minimal Parchment White',
    category: 'Minimal',
    src: '',
    safeArea: { top: 40, right: 40, bottom: 40, left: 40 },
  },
  {
    id: 'bg_modern_slate',
    name: 'Modern Slate Clean',
    category: 'Modern',
    src: '',
    safeArea: { top: 40, right: 40, bottom: 40, left: 40 },
  },
  {
    id: 'bg_elegant_pastel',
    name: 'Elegant Pastel Ivory',
    category: 'Elegant',
    src: '/templates/pink_vintage_lotus.png',
    safeArea: { top: 45, right: 40, bottom: 45, left: 40 },
  },
  {
    id: 'bg_premium_gold',
    name: 'Premium Velvet & Gold',
    category: 'Premium',
    src: '/templates/gold_parchment_mandala.png',
    safeArea: { top: 60, right: 45, bottom: 60, left: 45 },
  },
];

export const DEFAULT_MARATHI_BIODATA_ELEMENTS: TemplateElement[] = [
  // Top Header (Deity Shloka)
  {
    id: 'header_shloka',
    type: 'text',
    content: '॥ श्री गणेशाय नमः ॥',
    fieldBinding: 'pageHeader.deity',
    x: 100,
    y: 35,
    width: 594,
    height: 28,
    zIndex: 2,
    style: { fontSize: 17, fontWeight: 'bold', color: '#8B0000', textAlign: 'center', fontFamily: 'serif' },
  },

  // Section 1: Personal Information (Starts safely below the deity motif at y: 145)
  {
    id: 'heading_personal',
    type: 'text',
    content: '— Personal Details —',
    x: 100,
    y: 145,
    width: 594,
    height: 26,
    zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },

  // Personal Rows (Label at x: 110 width 155, Value with Colon at x: 275 width 410)
  { id: 'f_name', type: 'text', content: 'Full Name', x: 110, y: 175, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_name', type: 'text', content: ': {{personalDetails.fullName}}', fieldBinding: 'personalDetails.fullName', x: 275, y: 175, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '600', color: '#1E293B', textAlign: 'left' } },

  { id: 'f_dob', type: 'text', content: 'Date of Birth', x: 110, y: 198, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_dob', type: 'text', content: ': {{personalDetails.dateOfBirth}}', fieldBinding: 'personalDetails.dateOfBirth', x: 275, y: 198, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_tob', type: 'text', content: 'Time of Birth', x: 110, y: 221, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_tob', type: 'text', content: ': {{personalDetails.timeOfBirth}}', fieldBinding: 'personalDetails.timeOfBirth', x: 275, y: 221, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_pob', type: 'text', content: 'Place of Birth', x: 110, y: 244, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_pob', type: 'text', content: ': {{personalDetails.placeOfBirth}}', fieldBinding: 'personalDetails.placeOfBirth', x: 275, y: 244, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_rel', type: 'text', content: 'Religion', x: 110, y: 267, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_rel', type: 'text', content: ': {{personalDetails.religion}}', fieldBinding: 'personalDetails.religion', x: 275, y: 267, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_caste', type: 'text', content: 'Caste', x: 110, y: 290, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_caste', type: 'text', content: ': {{personalDetails.caste}}', fieldBinding: 'personalDetails.caste', x: 275, y: 290, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_kul', type: 'text', content: 'Kuldevata', x: 110, y: 313, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_kul', type: 'text', content: ': {{personalDetails.kuldevata}}', fieldBinding: 'personalDetails.kuldevata', x: 275, y: 313, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_gotra', type: 'text', content: 'Gotra', x: 110, y: 336, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_gotra', type: 'text', content: ': {{personalDetails.gotra}}', fieldBinding: 'personalDetails.gotra', x: 275, y: 336, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_rashi', type: 'text', content: 'Rashi', x: 110, y: 359, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_rashi', type: 'text', content: ': {{personalDetails.rashi}}', fieldBinding: 'personalDetails.rashi', x: 275, y: 359, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_nakshatra', type: 'text', content: 'Nakshatra', x: 110, y: 382, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_nakshatra', type: 'text', content: ': {{personalDetails.nakshatra}}', fieldBinding: 'personalDetails.nakshatra', x: 275, y: 382, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_gan', type: 'text', content: 'Gan', x: 110, y: 405, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_gan', type: 'text', content: ': {{personalDetails.gan}}', fieldBinding: 'personalDetails.gan', x: 275, y: 405, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_nadi', type: 'text', content: 'Nadi', x: 110, y: 428, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_nadi', type: 'text', content: ': {{personalDetails.nadi}}', fieldBinding: 'personalDetails.nadi', x: 275, y: 428, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_height', type: 'text', content: 'Height', x: 110, y: 451, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_height', type: 'text', content: ': {{personalDetails.height}}', fieldBinding: 'personalDetails.height', x: 275, y: 451, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_complexion', type: 'text', content: 'Complexion', x: 110, y: 474, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_complexion', type: 'text', content: ': {{personalDetails.complexion}}', fieldBinding: 'personalDetails.complexion', x: 275, y: 474, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_blood', type: 'text', content: 'Blood Group', x: 110, y: 497, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_blood', type: 'text', content: ': {{personalDetails.bloodGroup}}', fieldBinding: 'personalDetails.bloodGroup', x: 275, y: 497, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_edu', type: 'text', content: 'Education', x: 110, y: 520, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_edu', type: 'text', content: ': {{educationOccupation.education}}', fieldBinding: 'educationOccupation.education', x: 275, y: 520, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_occ', type: 'text', content: 'Occupation', x: 110, y: 543, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_occ', type: 'text', content: ': {{educationOccupation.occupation}}', fieldBinding: 'educationOccupation.occupation', x: 275, y: 543, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_income', type: 'text', content: 'Income', x: 110, y: 566, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_income', type: 'text', content: ': {{educationOccupation.annualIncome}}', fieldBinding: 'educationOccupation.annualIncome', x: 275, y: 566, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  // Section 2: Family Information
  {
    id: 'heading_family',
    type: 'text',
    content: '— Family Details —',
    x: 100,
    y: 598,
    width: 594,
    height: 26,
    zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },

  { id: 'f_fname', type: 'text', content: "Father's Name", x: 110, y: 628, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_fname', type: 'text', content: ': {{familyDetails.fatherName}}', fieldBinding: 'familyDetails.fatherName', x: 275, y: 628, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_focc', type: 'text', content: "Father's Occupation", x: 110, y: 651, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_focc', type: 'text', content: ': {{familyDetails.fatherOccupation}}', fieldBinding: 'familyDetails.fatherOccupation', x: 275, y: 651, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mname', type: 'text', content: "Mother's Name", x: 110, y: 674, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mname', type: 'text', content: ': {{familyDetails.motherName}}', fieldBinding: 'familyDetails.motherName', x: 275, y: 674, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_sis', type: 'text', content: 'Sister', x: 110, y: 697, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_sis', type: 'text', content: ': {{familyDetails.sisters}}', fieldBinding: 'familyDetails.sisters', x: 275, y: 697, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_bro', type: 'text', content: 'Brother', x: 110, y: 720, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_bro', type: 'text', content: ': {{familyDetails.brothers}}', fieldBinding: 'familyDetails.brothers', x: 275, y: 720, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mama', type: 'text', content: 'Maternal Uncle', x: 110, y: 743, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mama', type: 'text', content: ': {{familyDetails.maternalUncle}}', fieldBinding: 'familyDetails.maternalUncle', x: 275, y: 743, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_relatives', type: 'text', content: 'Relations', x: 110, y: 766, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_relatives', type: 'text', content: ': {{familyDetails.relations}}', fieldBinding: 'familyDetails.relations', x: 275, y: 766, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  // Section 3: Contact Information
  {
    id: 'heading_contact',
    type: 'text',
    content: '— Contact Details —',
    x: 100,
    y: 798,
    width: 594,
    height: 26,
    zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },

  { id: 'f_address', type: 'text', content: 'Address', x: 110, y: 828, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_address', type: 'text', content: ': {{contactDetails.residenceAddress}}', fieldBinding: 'contactDetails.residenceAddress', x: 275, y: 828, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_phone', type: 'text', content: 'Mobile No.', x: 110, y: 851, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_phone', type: 'text', content: ': {{contactDetails.primaryContact}}', fieldBinding: 'contactDetails.primaryContact', x: 275, y: 851, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },
];

export const DEFAULT_ENGLISH_BIODATA_ELEMENTS: TemplateElement[] = [
  // ── Top Header ──
  {
    id: 'header_shloka',
    type: 'text',
    content: '|| Shree Ganeshay Namah ||',
    x: 100, y: 35, width: 594, height: 28, zIndex: 2,
    style: { fontSize: 17, fontWeight: 'bold', color: '#8B0000', textAlign: 'center', fontFamily: 'serif' },
  },

  // ── Section 1: Personal Details (Starts safely below the deity motif at y: 145) ──
  {
    id: 'heading_personal',
    type: 'text',
    content: '— Personal Details —',
    x: 100, y: 145, width: 594, height: 26, zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },

  // Personal Rows (Label at x: 110 width 155, Value with Colon at x: 275 width 410)
  { id: 'f_name',       type: 'text', content: 'Full Name',        x: 110, y: 175, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_name',       type: 'text', content: ': {{personalDetails.fullName}}',        fieldBinding: 'personalDetails.fullName',       x: 275, y: 175, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '600', color: '#1E293B', textAlign: 'left' } },

  { id: 'f_dob',        type: 'text', content: 'Date of Birth',    x: 110, y: 198, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_dob',        type: 'text', content: ': {{personalDetails.dateOfBirth}}',     fieldBinding: 'personalDetails.dateOfBirth',    x: 275, y: 198, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_tob',        type: 'text', content: 'Time of Birth',    x: 110, y: 221, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_tob',        type: 'text', content: ': {{personalDetails.timeOfBirth}}',     fieldBinding: 'personalDetails.timeOfBirth',    x: 275, y: 221, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_pob',        type: 'text', content: 'Place of Birth',   x: 110, y: 244, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_pob',        type: 'text', content: ': {{personalDetails.placeOfBirth}}',    fieldBinding: 'personalDetails.placeOfBirth',   x: 275, y: 244, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_religion',   type: 'text', content: 'Religion',         x: 110, y: 267, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_religion',   type: 'text', content: ': {{personalDetails.religion}}',        fieldBinding: 'personalDetails.religion',       x: 275, y: 267, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_caste',      type: 'text', content: 'Caste',            x: 110, y: 290, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_caste',      type: 'text', content: ': {{personalDetails.caste}}',           fieldBinding: 'personalDetails.caste',          x: 275, y: 290, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_kuldevata',  type: 'text', content: 'Kuldevata',        x: 110, y: 313, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_kuldevata',  type: 'text', content: ': {{personalDetails.kuldevata}}',       fieldBinding: 'personalDetails.kuldevata',      x: 275, y: 313, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_gotra',      type: 'text', content: 'Gotra',            x: 110, y: 336, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_gotra',      type: 'text', content: ': {{personalDetails.gotra}}',           fieldBinding: 'personalDetails.gotra',          x: 275, y: 336, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_rashi',      type: 'text', content: 'Rashi',            x: 110, y: 359, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_rashi',      type: 'text', content: ': {{personalDetails.rashi}}',           fieldBinding: 'personalDetails.rashi',          x: 275, y: 359, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_nakshatra',  type: 'text', content: 'Nakshatra',        x: 110, y: 382, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_nakshatra',  type: 'text', content: ': {{personalDetails.nakshatra}}',       fieldBinding: 'personalDetails.nakshatra',      x: 275, y: 382, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_gan',        type: 'text', content: 'Gan',              x: 110, y: 405, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_gan',        type: 'text', content: ': {{personalDetails.gan}}',             fieldBinding: 'personalDetails.gan',            x: 275, y: 405, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_nadi',       type: 'text', content: 'Nadi',             x: 110, y: 428, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_nadi',       type: 'text', content: ': {{personalDetails.nadi}}',            fieldBinding: 'personalDetails.nadi',           x: 275, y: 428, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_height',     type: 'text', content: 'Height',           x: 110, y: 451, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_height',     type: 'text', content: ': {{personalDetails.height}}',          fieldBinding: 'personalDetails.height',         x: 275, y: 451, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_complexion', type: 'text', content: 'Complexion',       x: 110, y: 474, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_complexion', type: 'text', content: ': {{personalDetails.complexion}}',      fieldBinding: 'personalDetails.complexion',     x: 275, y: 474, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_blood',      type: 'text', content: 'Blood Group',      x: 110, y: 497, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_blood',      type: 'text', content: ': {{personalDetails.bloodGroup}}',      fieldBinding: 'personalDetails.bloodGroup',     x: 275, y: 497, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_edu',        type: 'text', content: 'Education',        x: 110, y: 520, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_edu',        type: 'text', content: ': {{educationOccupation.education}}',   fieldBinding: 'educationOccupation.education',  x: 275, y: 520, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_occ',        type: 'text', content: 'Occupation',       x: 110, y: 543, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_occ',        type: 'text', content: ': {{educationOccupation.occupation}}',  fieldBinding: 'educationOccupation.occupation', x: 275, y: 543, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_income',     type: 'text', content: 'Income',           x: 110, y: 566, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_income',     type: 'text', content: ': {{educationOccupation.annualIncome}}', fieldBinding: 'educationOccupation.annualIncome', x: 275, y: 566, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  // ── Section 2: Family Details ──
  {
    id: 'heading_family',
    type: 'text',
    content: '— Family Details —',
    x: 100, y: 598, width: 594, height: 26, zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },

  { id: 'f_fname',      type: 'text', content: 'Father\'s Name',   x: 110, y: 628, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_fname',      type: 'text', content: ': {{familyDetails.fatherName}}',        fieldBinding: 'familyDetails.fatherName',       x: 275, y: 628, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_focc',       type: 'text', content: 'Father\'s Occupation', x: 110, y: 651, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_focc',       type: 'text', content: ': {{familyDetails.fatherOccupation}}',  fieldBinding: 'familyDetails.fatherOccupation', x: 275, y: 651, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mname',      type: 'text', content: 'Mother\'s Name',   x: 110, y: 674, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mname',      type: 'text', content: ': {{familyDetails.motherName}}',        fieldBinding: 'familyDetails.motherName',       x: 275, y: 674, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_sister',     type: 'text', content: 'Sister',           x: 110, y: 697, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_sister',     type: 'text', content: ': {{familyDetails.sisters}}',           fieldBinding: 'familyDetails.sisters',          x: 275, y: 697, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_brother',    type: 'text', content: 'Brother',          x: 110, y: 720, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_brother',    type: 'text', content: ': {{familyDetails.brothers}}',          fieldBinding: 'familyDetails.brothers',         x: 275, y: 720, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mama',       type: 'text', content: 'Maternal Uncle',   x: 110, y: 743, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mama',       type: 'text', content: ': {{familyDetails.maternalUncle}}',     fieldBinding: 'familyDetails.maternalUncle',    x: 275, y: 743, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_rels',       type: 'text', content: 'Relations',        x: 110, y: 766, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_rels',       type: 'text', content: ': {{familyDetails.relations}}',         fieldBinding: 'familyDetails.relations',        x: 275, y: 766, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  // ── Section 3: Contact Details ──
  {
    id: 'heading_contact',
    type: 'text',
    content: '— Contact Details —',
    x: 100, y: 798, width: 594, height: 26, zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },

  { id: 'f_address',    type: 'text', content: 'Address',          x: 110, y: 828, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_address',    type: 'text', content: ': {{contactDetails.residenceAddress}}', fieldBinding: 'contactDetails.residenceAddress', x: 275, y: 828, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mobile',     type: 'text', content: 'Mobile Number',    x: 110, y: 851, width: 155, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold',  color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mobile',     type: 'text', content: ': {{contactDetails.primaryContact}}',   fieldBinding: 'contactDetails.primaryContact',  x: 275, y: 851, width: 410, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },
];

export const DEFAULT_PHOTO_BIODATA_ELEMENTS: TemplateElement[] = [
  // Top Header Shloka
  {
    id: 'header_shloka',
    type: 'text',
    content: '॥ श्री गणेशाय नमः ॥',
    fieldBinding: 'pageHeader.deity',
    x: 100, y: 35, width: 594, height: 28, zIndex: 2,
    style: { fontSize: 17, fontWeight: 'bold', color: '#8B0000', textAlign: 'center', fontFamily: 'serif' },
  },
  // Top Photo Frame (Square/Round with border)
  {
    id: 'candidate_photo',
    type: 'image',
    fieldBinding: 'personalDetails.photoUrl',
    shapeType: 'rounded',
    x: 580, y: 70, width: 130, height: 160, zIndex: 3,
    style: { borderRadius: '12px', border: '2px solid #D97706', objectFit: 'cover' },
  },
  // Section 1: Personal Details
  {
    id: 'heading_personal',
    type: 'text',
    content: '— Personal Details —',
    x: 80, y: 145, width: 480, height: 26, zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },
  { id: 'f_name', type: 'text', content: 'Full Name', x: 80, y: 175, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_name', type: 'text', content: ': {{personalDetails.fullName}}', fieldBinding: 'personalDetails.fullName', x: 230, y: 175, width: 330, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '600', color: '#1E293B', textAlign: 'left' } },

  { id: 'f_dob', type: 'text', content: 'Date of Birth', x: 80, y: 198, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_dob', type: 'text', content: ': {{personalDetails.dateOfBirth}}', fieldBinding: 'personalDetails.dateOfBirth', x: 230, y: 198, width: 330, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_tob', type: 'text', content: 'Time of Birth', x: 80, y: 221, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_tob', type: 'text', content: ': {{personalDetails.timeOfBirth}}', fieldBinding: 'personalDetails.timeOfBirth', x: 230, y: 221, width: 330, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_pob', type: 'text', content: 'Place of Birth', x: 80, y: 244, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_pob', type: 'text', content: ': {{personalDetails.placeOfBirth}}', fieldBinding: 'personalDetails.placeOfBirth', x: 230, y: 244, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_rel', type: 'text', content: 'Religion / Caste', x: 80, y: 267, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_rel', type: 'text', content: ': {{personalDetails.religion}} ({{personalDetails.caste}})', fieldBinding: 'personalDetails.caste', x: 230, y: 267, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_kul', type: 'text', content: 'Kuldevata', x: 80, y: 290, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_kul', type: 'text', content: ': {{personalDetails.kuldevata}}', fieldBinding: 'personalDetails.kuldevata', x: 230, y: 290, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_rashi', type: 'text', content: 'Rashi / Nakshatra', x: 80, y: 313, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_rashi', type: 'text', content: ': {{personalDetails.rashi}} ({{personalDetails.nakshatra}})', fieldBinding: 'personalDetails.rashi', x: 230, y: 313, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_height', type: 'text', content: 'Height / Complexion', x: 80, y: 336, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_height', type: 'text', content: ': {{personalDetails.height}}, {{personalDetails.complexion}}', fieldBinding: 'personalDetails.height', x: 230, y: 336, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_blood', type: 'text', content: 'Blood Group', x: 80, y: 359, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_blood', type: 'text', content: ': {{personalDetails.bloodGroup}}', fieldBinding: 'personalDetails.bloodGroup', x: 230, y: 359, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_edu', type: 'text', content: 'Education', x: 80, y: 382, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_edu', type: 'text', content: ': {{educationOccupation.education}}', fieldBinding: 'educationOccupation.education', x: 230, y: 382, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_occ', type: 'text', content: 'Occupation', x: 80, y: 405, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_occ', type: 'text', content: ': {{educationOccupation.occupation}}', fieldBinding: 'educationOccupation.occupation', x: 230, y: 405, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_income', type: 'text', content: 'Income', x: 80, y: 428, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_income', type: 'text', content: ': {{educationOccupation.annualIncome}}', fieldBinding: 'educationOccupation.annualIncome', x: 230, y: 428, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  // Section 2: Family Details
  {
    id: 'heading_family',
    type: 'text',
    content: '— Family Details —',
    x: 80, y: 462, width: 634, height: 26, zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },
  { id: 'f_fname', type: 'text', content: "Father's Name", x: 80, y: 492, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_fname', type: 'text', content: ': {{familyDetails.fatherName}} ({{familyDetails.fatherOccupation}})', fieldBinding: 'familyDetails.fatherName', x: 230, y: 492, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mname', type: 'text', content: "Mother's Name", x: 80, y: 515, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mname', type: 'text', content: ': {{familyDetails.motherName}}', fieldBinding: 'familyDetails.motherName', x: 230, y: 515, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_sis', type: 'text', content: 'Sister / Brother', x: 80, y: 538, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_sis', type: 'text', content: ': {{familyDetails.sisters}} / {{familyDetails.brothers}}', fieldBinding: 'familyDetails.brothers', x: 230, y: 538, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_mama', type: 'text', content: 'Maternal Uncle', x: 80, y: 561, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_mama', type: 'text', content: ': {{familyDetails.maternalUncle}}', fieldBinding: 'familyDetails.maternalUncle', x: 230, y: 561, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_relatives', type: 'text', content: 'Relations', x: 80, y: 584, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_relatives', type: 'text', content: ': {{familyDetails.relations}}', fieldBinding: 'familyDetails.relations', x: 230, y: 584, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  // Section 3: Contact Details
  {
    id: 'heading_contact',
    type: 'text',
    content: '— Contact Details —',
    x: 80, y: 618, width: 634, height: 26, zIndex: 2,
    style: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', fontFamily: 'serif' },
  },
  { id: 'f_address', type: 'text', content: 'Address', x: 80, y: 648, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_address', type: 'text', content: ': {{contactDetails.residenceAddress}}', fieldBinding: 'contactDetails.residenceAddress', x: 230, y: 648, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },

  { id: 'f_phone', type: 'text', content: 'Mobile No.', x: 80, y: 671, width: 140, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'left' } },
  { id: 'v_phone', type: 'text', content: ': {{contactDetails.primaryContact}}', fieldBinding: 'contactDetails.primaryContact', x: 230, y: 671, width: 480, height: 21, zIndex: 2, style: { fontSize: 13, fontWeight: '500', color: '#334155', textAlign: 'left' } },
];

export interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  pricing_type: 'FREE' | 'PREMIUM';
  is_luxury: boolean;
  badge?: string;
  preview_icon: string;
  default_accent: string;
  default_bg: string;
  font_family: string;
  layout_json?: TemplateLayoutJSON;
  version: number;
  categories: CategoryItem[];
  category_ids?: string[];
  created_at: string;
  updated_at: string;
}

// In-memory cache for ultra-fast instant UI rendering
const templateCache = new Map<string, { data: TemplateItem[]; timestamp: number }>();
const templateDetailCache = new Map<string, { data: TemplateItem; timestamp: number }>();
let categoriesCache: { data: CategoryItem[]; timestamp: number } | null = null;
const CACHE_TTL = 300000; // 5 minutes

export const fetchCategoriesApi = async (): Promise<CategoryItem[]> => {
  if (categoriesCache && Date.now() - categoriesCache.timestamp < CACHE_TTL) {
    return categoriesCache.data;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/templates/categories`);
    if (!res.ok) return categoriesCache?.data || [];
    const data = await res.json();
    categoriesCache = { data, timestamp: Date.now() };
    return data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return categoriesCache?.data || [];
  }
};

export const searchTemplatesApi = async (filters: {
  search?: string;
  category?: string;
  pricing_type?: string;
  is_luxury?: boolean;
  include_layout?: boolean;
}): Promise<TemplateItem[]> => {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.category) query.append('category', filters.category);
  if (filters.pricing_type) query.append('pricing_type', filters.pricing_type);
  if (filters.is_luxury !== undefined) query.append('is_luxury', String(filters.is_luxury));
  if (filters.include_layout) query.append('include_layout', 'true');
  const cacheKey = query.toString() || 'all';

  const cached = templateCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/templates?${cacheKey}`);
    if (!res.ok) return cached?.data || [];
    const data = await res.json();
    templateCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error('Failed to search templates:', err);
    return cached?.data || [];
  }
};

export const getTemplateDetailApi = async (id: string): Promise<TemplateItem | null> => {
  const cached = templateDetailCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}`);
    if (!res.ok) return cached?.data || null;
    const data: TemplateItem = await res.json();
    templateDetailCache.set(id, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error('Failed to fetch template detail:', err);
    return cached?.data || null;
  }
};

export const toggleFavoriteApi = async (templateId: string): Promise<{ success: boolean; favorited?: boolean }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ template_id: templateId }),
    });
    if (!res.ok) return { success: false };
    return await res.json();
  } catch (err) {
    return { success: false };
  }
};

// --- Admin APIs ---

let adminTemplatesCache: { data: TemplateItem[]; timestamp: number } | null = null;

export const clearAdminTemplatesCache = () => {
  adminTemplatesCache = null;
  templateCache.clear();
};

export const adminListTemplatesApi = async (forceRefresh = false): Promise<TemplateItem[]> => {
  if (!forceRefresh && adminTemplatesCache && Date.now() - adminTemplatesCache.timestamp < 60000) {
    return adminTemplatesCache.data;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/admin/templates`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) return adminTemplatesCache?.data || [];
    const data = await res.json();
    adminTemplatesCache = { data, timestamp: Date.now() };
    return data;
  } catch (err) {
    return adminTemplatesCache?.data || [];
  }
};

export const adminCreateTemplateApi = async (payload: Partial<TemplateItem>): Promise<TemplateItem | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data?.detail?.message || data?.detail || data?.message || 'Failed to create template. Ensure you are signed in as ADMIN.';
      alert(msg);
      return null;
    }
    clearAdminTemplatesCache();
    return data;
  } catch (err: any) {
    alert(err.message || 'Network error while creating template.');
    return null;
  }
};

export const adminUpdateTemplateApi = async (
  id: string,
  payload: Partial<TemplateItem> & { change_summary?: string }
): Promise<TemplateItem | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    clearAdminTemplatesCache();
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const adminDuplicateTemplateApi = async (id: string): Promise<TemplateItem | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/templates/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) return null;
    clearAdminTemplatesCache();
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const adminDeleteTemplateApi = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (res.ok) clearAdminTemplatesCache();
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const adminUploadTemplateThumbnailApi = async (
  id: string,
  imageData: string
): Promise<{ success: boolean; thumbnail_url?: string } | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/templates/${id}/thumbnail`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ image_data: imageData }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to upload thumbnail:', err);
    return null;
  }
};



export interface DownloadedTemplateRecord {
  id: string;
  name: string;
  downloadedAt: string;
}

export const getUserStorageKey = (key: string, customUserId?: string | null): string => {
  const uid = customUserId || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
  return uid ? `${key}_${uid}` : key;
};

export const recordDownloadedTemplate = (id: string, name?: string, userId?: string | null): DownloadedTemplateRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const finalName = name || id;
    const userKeyId = getUserStorageKey('last_used_template_id', userId);
    const userKeyName = getUserStorageKey('last_used_template_name', userId);
    localStorage.setItem(userKeyId, id);
    localStorage.setItem(userKeyName, finalName);
    localStorage.setItem('last_used_template_id', id);
    localStorage.setItem('last_used_template_name', finalName);
    localStorage.setItem('selected_template_id', id);

    const historyKey = getUserStorageKey('download_history_templates', userId);
    const raw = localStorage.getItem(historyKey);
    const existing: DownloadedTemplateRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((item) => item.id !== id);
    const updated: DownloadedTemplateRecord[] = [
      { id, name: finalName, downloadedAt: new Date().toISOString() },
      ...filtered,
    ].slice(0, 6);

    localStorage.setItem(historyKey, JSON.stringify(updated));

    window.dispatchEvent(
      new CustomEvent('template_downloaded', {
        detail: { id, name: finalName, userId, history: updated },
      })
    );

    return updated;
  } catch (err) {
    console.error('Failed to record downloaded template:', err);
    return [];
  }
};

export const getDownloadedTemplateHistory = (userId?: string | null): DownloadedTemplateRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const historyKey = getUserStorageKey('download_history_templates', userId);
    const raw = localStorage.getItem(historyKey) || localStorage.getItem('download_history_templates');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getLastUsedTemplate = (userId?: string | null): { id: string | null; name: string | null } => {
  if (typeof window === 'undefined') return { id: null, name: null };
  const userKeyId = getUserStorageKey('last_used_template_id', userId);
  const userKeyName = getUserStorageKey('last_used_template_name', userId);
  const id =
    localStorage.getItem(userKeyId) ||
    localStorage.getItem('last_used_template_id') ||
    localStorage.getItem('selected_template_id') ||
    null;
  const name =
    localStorage.getItem(userKeyName) ||
    localStorage.getItem('last_used_template_name') ||
    null;
  return { id, name };
};
