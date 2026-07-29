import React, { useState } from 'react';
import { ResumeData, TemplateStyle } from '../types';
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Palette,
  Layout,
  Type,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';

interface ResumeEditorProps {
  resume: ResumeData;
  template: TemplateStyle;
  onChangeResume: (updated: ResumeData) => void;
  onChangeTemplate: (updated: TemplateStyle) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  template,
  onChangeResume,
  onChangeTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [openSection, setOpenSection] = useState<string>('personal');
  const [enhancingIndex, setEnhancingIndex] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Handlers for Personal Info
  const updatePersonalInfo = (field: string, value: string) => {
    onChangeResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  // AI Summary Generator
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: resume.personalInfo.jobTitle,
          keySkills: resume.skillCategories[0]?.skills.join(', ') || 'Software Architecture, System Design',
          experienceYears: '6+',
        }),
      });
      const data = await res.json();
      if (data.summary) {
        updatePersonalInfo('summary', data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Experience Bullet Enhancer
  const handleEnhanceBullet = async (expId: string, bulletIdx: number, currentText: string) => {
    setEnhancingIndex(`${expId}-${bulletIdx}`);
    try {
      const exp = resume.experiences.find((e) => e.id === expId);
      const res = await fetch('/api/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText: currentText,
          roleTitle: exp?.role || resume.personalInfo.jobTitle,
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        const updatedExperiences = resume.experiences.map((e) => {
          if (e.id === expId) {
            const newBullets = [...e.bullets];
            newBullets[bulletIdx] = data.enhanced;
            return { ...e, bullets: newBullets };
          }
          return e;
        });
        onChangeResume({ ...resume, experiences: updatedExperiences });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancingIndex(null);
    }
  };

  // Handlers for Work Experience
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: 'New Company',
      role: 'Senior Role',
      location: 'City, State',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: ['Architected scalable backend services using Java and Node.js.'],
    };
    onChangeResume({
      ...resume,
      experiences: [newExp, ...resume.experiences],
    });
  };

  const removeExperience = (id: string) => {
    onChangeResume({
      ...resume,
      experiences: resume.experiences.filter((e) => e.id !== id),
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    onChangeResume({
      ...resume,
      experiences: resume.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const addExperienceBullet = (expId: string) => {
    onChangeResume({
      ...resume,
      experiences: resume.experiences.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, 'Delivered high impact result with quantifiable metric.'] } : e
      ),
    });
  };

  const updateExperienceBullet = (expId: string, bIdx: number, text: string) => {
    onChangeResume({
      ...resume,
      experiences: resume.experiences.map((e) => {
        if (e.id === expId) {
          const newBullets = [...e.bullets];
          newBullets[bIdx] = text;
          return { ...e, bullets: newBullets };
        }
        return e;
      }),
    });
  };

  const removeExperienceBullet = (expId: string, bIdx: number) => {
    onChangeResume({
      ...resume,
      experiences: resume.experiences.map((e) => {
        if (e.id === expId) {
          return { ...e, bullets: e.bullets.filter((_, idx) => idx !== bIdx) };
        }
        return e;
      }),
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-slate-100 flex flex-col h-full overflow-hidden">
      {/* Top Tab Bar */}
      <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl mb-6 border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'content'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Resume Content</span>
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === 'style'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Design & Layout</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {activeTab === 'content' ? (
          <>
            {/* Personal Details Accordion */}
            <div className="border border-slate-800 bg-slate-800/40 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
                className="w-full p-4 flex items-center justify-between font-bold text-sm text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Personal Information & Bio</span>
                </div>
                {openSection === 'personal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {openSection === 'personal' && (
                <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-900/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resume.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={resume.personalInfo.jobTitle}
                        onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                      <input
                        type="text"
                        value={resume.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
                      <input
                        type="text"
                        value={resume.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={resume.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-400">Executive Summary</label>
                      <button
                        onClick={handleGenerateSummary}
                        disabled={generatingSummary}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20"
                      >
                        {generatingSummary ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>AI Auto-Generate</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={resume.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Experience Accordion */}
            <div className="border border-slate-800 bg-slate-800/40 rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <button
                  onClick={() => setOpenSection(openSection === 'experience' ? '' : 'experience')}
                  className="flex items-center gap-2 font-bold text-sm text-slate-200"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Work Experience ({resume.experiences.length})</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addExperience}
                    className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-400 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                  {openSection === 'experience' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {openSection === 'experience' && (
                <div className="p-4 border-t border-slate-800/80 space-y-6 bg-slate-900/60">
                  {resume.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">{exp.company || 'Company Name'}</span>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Role Title"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>

                      {/* Bullets */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-300">STAR Bullet Points</span>
                          <button
                            onClick={() => addExperienceBullet(exp.id)}
                            className="text-[10px] font-bold text-amber-400 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>
                        <div className="space-y-2">
                          {exp.bullets.map((bText, bIdx) => {
                            const isEnhancing = enhancingIndex === `${exp.id}-${bIdx}`;
                            return (
                              <div key={bIdx} className="flex items-start gap-2">
                                <textarea
                                  rows={2}
                                  value={bText}
                                  onChange={(e) => updateExperienceBullet(exp.id, bIdx, e.target.value)}
                                  className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                                />
                                <button
                                  onClick={() => handleEnhanceBullet(exp.id, bIdx, bText)}
                                  disabled={isEnhancing}
                                  title="Optimize bullet using STAR method AI"
                                  className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs shrink-0 flex items-center gap-1"
                                >
                                  {isEnhancing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => removeExperienceBullet(exp.id, bIdx)}
                                  className="p-2 text-slate-400 hover:text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Style & Customization Controls */
          <div className="space-y-6">
            {/* Primary Accent Color */}
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl">
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Primary Theme Color Accent
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  '#FF9900',
                  '#0078D4',
                  '#4285F4',
                  '#0668E1',
                  '#18181B',
                  '#A51C30',
                  '#059669',
                  '#4F46E5',
                  '#7C3AED',
                  '#E11D48',
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => onChangeTemplate({ ...template, primaryColor: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      template.primaryColor === color ? 'scale-125 border-white shadow-lg' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Layout Switcher */}
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl">
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Document Layout Structure
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'single', label: 'Single Column' },
                  { id: 'two-column-left', label: 'Sidebar Left' },
                  { id: 'two-column-right', label: 'Sidebar Right' },
                  { id: 'split-header', label: 'Split Header' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onChangeTemplate({ ...template, layout: l.id as any })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      template.layout === l.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : 'border-slate-700 bg-slate-800 text-slate-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl">
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Typography Font Family
              </label>
              <select
                value={template.fontFamily}
                onChange={(e) => onChangeTemplate({ ...template, fontFamily: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                <option value="Playfair Display">Playfair Display (Executive Serif)</option>
                <option value="Outfit">Outfit (Tech Creative)</option>
                <option value="Roboto">Roboto (Standard Corporate)</option>
                <option value="Fira Code">Fira Code (Developer Code)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
