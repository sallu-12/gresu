import { TemplateStyle, TemplateCategory, LayoutType, HeaderStyle, BulletStyle } from '../types';

export const OFFICIAL_CATEGORIES: TemplateCategory[] = [
  'Professional',
  'Modern',
  'Minimal',
  'Corporate',
  'Executive',
  'Developer',
  'Student',
  'Research',
  'Finance',
  'Healthcare',
  'Marketing',
  'Legal',
  'Academic',
];

const PALETTES = [
  { name: 'Slate Enterprise', primary: '#1E293B', secondary: '#334155', bg: '#F8FAFC', text: '#0F172A' },
  { name: 'Corporate Navy', primary: '#0F172A', secondary: '#1E3A8A', bg: '#F8FAFC', text: '#1E293B' },
  { name: 'Emerald Trust', primary: '#047857', secondary: '#065F46', bg: '#F0FDF4', text: '#064E3B' },
  { name: 'Azure Precision', primary: '#0284C7', secondary: '#0369A1', bg: '#F0F9FF', text: '#0C4A6E' },
  { name: 'Monochrome Luxe', primary: '#18181B', secondary: '#3F3F46', bg: '#FAFAFA', text: '#09090B' },
  { name: 'Burgundy Executive', primary: '#881337', secondary: '#4C0519', bg: '#FFF1F2', text: '#2A0812' },
  { name: 'Indigo System', primary: '#4338CA', secondary: '#312E81', bg: '#EEF2FF', text: '#1E1B4B' },
  { name: 'Teal Clarity', primary: '#0F766E', secondary: '#115E59', bg: '#F0FDFA', text: '#134E4A' },
];

const FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Roboto',
  'Merriweather',
  'JetBrains Mono',
  'Playfair Display',
];

const LAYOUTS: LayoutType[] = ['single', 'two-column-left', 'two-column-right', 'split-header', 'modern-grid'];
const HEADER_STYLES: HeaderStyle[] = ['underline', 'border-bar', 'solid-box', 'minimal', 'double-line'];
const BULLETS: BulletStyle[] = ['disc', 'dash', 'square'];

export const GENERATED_TEMPLATES: TemplateStyle[] = [];

let idCount = 1;

OFFICIAL_CATEGORIES.forEach((category) => {
  PALETTES.forEach((palette, pIdx) => {
    const layout = LAYOUTS[(idCount + pIdx) % LAYOUTS.length];
    const font = FONTS[(idCount + pIdx) % FONTS.length];
    const headerStyle = HEADER_STYLES[idCount % HEADER_STYLES.length];
    const bulletStyle = BULLETS[idCount % BULLETS.length];

    const id = `tpl-${category.toLowerCase()}-${idCount}`;
    const name = `${category} ${palette.name}`;

    GENERATED_TEMPLATES.push({
      id,
      name,
      category,
      description: `Tailored for ${category.toLowerCase()} applications with ATS-friendly ${layout} structure and clear typographic hierarchy.`,
      layout,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      headerBg: palette.bg,
      textColor: palette.text,
      fontFamily: font,
      fontSizeScale: idCount % 3 === 0 ? 'sm' : idCount % 3 === 1 ? 'md' : 'lg',
      spacingScale: idCount % 2 === 0 ? 'normal' : 'tight',
      bulletStyle,
      headerStyle,
      photoStyle: category === 'Executive' || category === 'Marketing' ? 'rounded' : 'none',
      showPhoto: category === 'Executive' || category === 'Marketing',
      showIcons: true,
      showDividers: true,
      accentBar: idCount % 2 === 0,
    });

    idCount++;
  });
});

export const DEFAULT_TEMPLATE: TemplateStyle = {
  id: 'tpl-professional-executive-1',
  name: 'Executive Leadership Standard',
  category: 'Executive',
  description: 'Clean single-column layout engineered for recruiter clarity and ATS parser compliance.',
  layout: 'single',
  primaryColor: '#0F172A',
  secondaryColor: '#334155',
  headerBg: '#F8FAFC',
  textColor: '#0F172A',
  fontFamily: 'Plus Jakarta Sans',
  fontSizeScale: 'md',
  spacingScale: 'normal',
  bulletStyle: 'disc',
  headerStyle: 'border-bar',
  photoStyle: 'none',
  showPhoto: false,
  showIcons: true,
  showDividers: true,
  accentBar: true,
};
