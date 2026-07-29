export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  techStack: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  version?: string;
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  customSections: CustomSection[];
}

export type LayoutType = 'single' | 'two-column-left' | 'two-column-right' | 'split-header' | 'modern-grid';
export type FontSizeScale = 'sm' | 'md' | 'lg';
export type SpacingScale = 'tight' | 'normal' | 'spacious';
export type BulletStyle = 'disc' | 'dash' | 'square' | 'chevron' | 'diamond';
export type HeaderStyle = 'underline' | 'border-bar' | 'solid-box' | 'double-line' | 'minimal' | 'gradient';
export type PhotoStyle = 'circle' | 'rounded' | 'square' | 'none';

export type TemplateCategory =
  | 'Professional'
  | 'Modern'
  | 'Minimal'
  | 'Corporate'
  | 'Executive'
  | 'Developer'
  | 'Student'
  | 'Research'
  | 'Finance'
  | 'Healthcare'
  | 'Marketing'
  | 'Legal'
  | 'Academic';

export interface TemplateStyle {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  layout: LayoutType;
  primaryColor: string;
  secondaryColor: string;
  headerBg: string;
  textColor: string;
  fontFamily: string;
  fontSizeScale: FontSizeScale;
  spacingScale: SpacingScale;
  bulletStyle: BulletStyle;
  headerStyle: HeaderStyle;
  photoStyle: PhotoStyle;
  showPhoto: boolean;
  showIcons: boolean;
  showDividers: boolean;
  accentBar: boolean;
}

export type NavigationTab =
  | 'dashboard'
  | 'resumes'
  | 'templates'
  | 'import'
  | 'cover-letters'
  | 'job-match'
  | 'applications'
  | 'portfolio'
  | 'settings'
  | 'profile'
  | 'export';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  stage: 'Applied' | 'Screening' | 'Interviewing' | 'Offer' | 'Archived';
  appliedDate: string;
  salary?: string;
  jobDescriptionText?: string;
  notes?: string;
}

export interface SavedJobDescription {
  id: string;
  title: string;
  company: string;
  text: string;
  savedDate: string;
  matchedScore?: number;
}
