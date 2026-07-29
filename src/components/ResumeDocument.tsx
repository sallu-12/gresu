import React from 'react';
import { ResumeData, TemplateStyle } from '../types';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code2,
  FolderKanban,
  ChevronRight,
  Square,
  Diamond,
} from 'lucide-react';

interface ResumeDocumentProps {
  resume: ResumeData;
  template: TemplateStyle;
  is3DView?: boolean;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  resume,
  template,
  is3DView = false,
}) => {
  const { personalInfo, experiences, educations, skillCategories, projects, certifications, customSections } =
    resume;

  // Font class mapping
  const getFontFamily = (font: string) => {
    switch (font) {
      case 'Playfair Display':
        return 'font-serif';
      case 'Fira Code':
      case 'JetBrains Mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  // Font size scale mapping
  const getFontSizeClass = () => {
    switch (template.fontSizeScale) {
      case 'sm':
        return 'text-[13px] leading-relaxed';
      case 'lg':
        return 'text-[15px] leading-relaxed';
      default:
        return 'text-[14px] leading-relaxed';
    }
  };

  // Bullet style renderer
  const renderBulletIcon = () => {
    switch (template.bulletStyle) {
      case 'dash':
        return <span className="font-bold shrink-0 text-slate-400 mr-1.5">—</span>;
      case 'square':
        return <Square className="w-1.5 h-1.5 fill-current shrink-0 mt-1.5 mr-2 text-slate-600" />;
      case 'chevron':
        return <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 mr-1" style={{ color: template.primaryColor }} />;
      case 'diamond':
        return <Diamond className="w-1.5 h-1.5 fill-current shrink-0 mt-1.5 mr-2" style={{ color: template.primaryColor }} />;
      default:
        return <span className="text-lg leading-none shrink-0 mr-2 text-slate-500">•</span>;
    }
  };

  // Section Header Renderer
  const renderSectionHeader = (title: string, icon: React.ReactNode) => {
    switch (template.headerStyle) {
      case 'border-bar':
        return (
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
            <div
              className="w-1 h-5 rounded-full"
              style={{ backgroundColor: template.primaryColor }}
            />
            {template.showIcons && <span style={{ color: template.primaryColor }}>{icon}</span>}
            <h3
              className="text-base font-bold uppercase tracking-wider"
              style={{ color: template.secondaryColor }}
            >
              {title}
            </h3>
          </div>
        );
      case 'solid-box':
        return (
          <div
            className="px-3 py-1.5 rounded-md mb-3 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider"
            style={{ backgroundColor: template.primaryColor }}
          >
            {template.showIcons && icon}
            <span>{title}</span>
          </div>
        );
      case 'double-line':
        return (
          <div className="mb-3">
            <div className="flex items-center gap-2 pb-1">
              {template.showIcons && <span style={{ color: template.primaryColor }}>{icon}</span>}
              <h3
                className="text-base font-extrabold uppercase tracking-widest"
                style={{ color: template.primaryColor }}
              >
                {title}
              </h3>
            </div>
            <div className="h-0.5 bg-slate-900 rounded-full" />
            <div className="h-0.5 bg-slate-200 mt-0.5 rounded-full" />
          </div>
        );
      case 'underline':
      default:
        return (
          <div
            className="flex items-center gap-2 pb-1.5 mb-3 border-b-2"
            style={{ borderColor: template.primaryColor }}
          >
            {template.showIcons && <span style={{ color: template.primaryColor }}>{icon}</span>}
            <h3
              className="text-base font-bold uppercase tracking-wider"
              style={{ color: template.secondaryColor }}
            >
              {title}
            </h3>
          </div>
        );
    }
  };

  // Main Sections Output
  const ExperienceSection = (
    <div className="mb-5">
      {renderSectionHeader('Work Experience', <Briefcase className="w-4 h-4" />)}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative">
            <div className="flex flex-wrap justify-between items-baseline mb-1">
              <div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">
                  {exp.role}
                </h4>
                <p className="font-semibold text-xs md:text-sm" style={{ color: template.primaryColor }}>
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            <ul className="space-y-1 mt-2">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start text-slate-700">
                  {renderBulletIcon()}
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const EducationSection = (
    <div className="mb-5">
      {renderSectionHeader('Education', <GraduationCap className="w-4 h-4" />)}
      <div className="space-y-3">
        {educations.map((edu) => (
          <div key={edu.id} className="flex flex-wrap justify-between items-baseline">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {edu.degree} in {edu.field}
              </h4>
              <p className="text-xs font-medium text-slate-600">
                {edu.institution} {edu.location && `• ${edu.location}`}
              </p>
              {edu.honors && (
                <p className="text-xs italic text-slate-500 mt-0.5">
                  {edu.honors} {edu.gpa && `(GPA: ${edu.gpa})`}
                </p>
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {edu.startDate} - {edu.endDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const SkillsSection = (
    <div className="mb-5">
      {renderSectionHeader('Skills & Competencies', <Code2 className="w-4 h-4" />)}
      <div className="space-y-2">
        {skillCategories.map((cat) => (
          <div key={cat.id}>
            <span className="font-bold text-xs uppercase tracking-wider text-slate-800 mr-2">
              {cat.category}:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProjectsSection = projects.length > 0 && (
    <div className="mb-5">
      {renderSectionHeader('Key Projects', <FolderKanban className="w-4 h-4" />)}
      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id}>
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-slate-900 text-sm">
                {proj.title} {proj.subtitle && <span className="font-normal text-slate-500">| {proj.subtitle}</span>}
              </h4>
              {proj.link && (
                <span className="text-xs text-blue-600 font-mono hover:underline">
                  {proj.link}
                </span>
              )}
            </div>
            <ul className="space-y-1 mt-1">
              {proj.bullets.map((b, bIdx) => (
                <li key={bIdx} className="flex items-start text-slate-700 text-xs md:text-sm">
                  {renderBulletIcon()}
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const CertificationsSection = certifications.length > 0 && (
    <div className="mb-5">
      {renderSectionHeader('Certifications', <Award className="w-4 h-4" />)}
      <div className="space-y-2">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-800">{cert.title}</span>
              <span className="text-slate-500"> — {cert.issuer}</span>
            </div>
            <span className="text-slate-500 font-medium">{cert.date}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      id="resume-a4-document"
      className={`relative w-full bg-white text-slate-900 shadow-2xl rounded-sm p-6 md:p-10 transition-all duration-300 ${getFontFamily(
        template.fontFamily
      )} ${getFontSizeClass()} ${
        is3DView
          ? 'transform perspective-1000 rotate-x-3 rotate-y-3 hover:rotate-0 transition-transform duration-300 ease-out will-change-transform'
          : 'will-change-auto'
      }`}
      style={{
        minHeight: '1123px', // Standard A4 Aspect Ratio height at 96 DPI
      }}
    >
      {/* Accent Bar if enabled */}
      {template.accentBar && (
        <div
          className="absolute top-0 left-0 right-0 h-2 rounded-t-sm"
          style={{ backgroundColor: template.primaryColor }}
        />
      )}

      {/* Header Info */}
      <header className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            <h2
              className="text-base md:text-lg font-bold tracking-wide uppercase"
              style={{ color: template.primaryColor }}
            >
              {personalInfo.jobTitle || 'Target Professional Role'}
            </h2>

            {/* Summary */}
            {personalInfo.summary && (
              <p className="mt-3 text-slate-600 text-xs md:text-sm leading-relaxed max-w-3xl">
                {personalInfo.summary}
              </p>
            )}
          </div>

          {/* Photo if enabled */}
          {template.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-24 h-24 object-cover border-2 shadow-sm ${
                template.photoStyle === 'circle'
                  ? 'rounded-full'
                  : template.photoStyle === 'rounded'
                  ? 'rounded-xl'
                  : 'rounded-none'
              }`}
              style={{ borderColor: template.primaryColor }}
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Contact Links Grid */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-slate-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Layout Rendering */}
      {template.layout === 'two-column-left' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 border-r border-slate-200 pr-4">
            {SkillsSection}
            {EducationSection}
            {CertificationsSection}
          </div>
          <div className="md:col-span-8">
            {ExperienceSection}
            {ProjectsSection}
          </div>
        </div>
      ) : template.layout === 'two-column-right' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 border-r border-slate-200 pr-4">
            {ExperienceSection}
            {ProjectsSection}
          </div>
          <div className="md:col-span-4">
            {SkillsSection}
            {EducationSection}
            {CertificationsSection}
          </div>
        </div>
      ) : (
        <div>
          {ExperienceSection}
          {EducationSection}
          {SkillsSection}
          {ProjectsSection}
          {CertificationsSection}
        </div>
      )}
    </div>
  );
};
