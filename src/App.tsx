import React, { useState, useRef } from 'react';
import { ResumeData, TemplateStyle, NavigationTab } from './types';
import { INITIAL_RESUMES } from './data/presets';
import { DEFAULT_TEMPLATE } from './data/templates';
import { HeaderNavbar } from './components/HeaderNavbar';
import { SidebarNav } from './components/SidebarNav';
import { SaaSShowcase } from './components/SaaSShowcase';
import { ResumeDocument } from './components/ResumeDocument';
import { ResumeEditor } from './components/ResumeEditor';
import { TemplateGallery } from './components/TemplateGallery';
import { DashboardView } from './components/DashboardView';
import { ImportOcrView } from './components/ImportOcrView';
import { CoverLetterView } from './components/CoverLetterView';
import { JobMatchView } from './components/JobMatchView';
import { ApplicationsView } from './components/ApplicationsView';
import { PortfolioGeneratorView } from './components/PortfolioGeneratorView';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';
import { ExportHubView } from './components/ExportHubView';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function App() {
  // Master Resumes state list
  const [resumesList, setResumesList] = useState<ResumeData[]>(INITIAL_RESUMES);
  // Currently active resume
  const [activeResume, setActiveResume] = useState<ResumeData>(INITIAL_RESUMES[0]);
  // Currently active template design
  const [activeTemplate, setActiveTemplate] = useState<TemplateStyle>(DEFAULT_TEMPLATE);

  // Core Navigation Tab state
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Template Modal
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);

  const builderRef = useRef<HTMLDivElement>(null);

  // PDF Export Handler
  const handleExportPdf = async () => {
    const elem = document.getElementById('resume-a4-document');
    if (!elem) {
      setActiveTab('resumes');
      setTimeout(handleExportPdf, 300);
      return;
    }

    try {
      const canvas = await html2canvas(elem, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (e) {
      console.error('PDF Export fallback:', e);
      window.print();
    }
  };

  // Select Resume Handler
  const handleSelectResume = (res: ResumeData) => {
    setActiveResume(res);
    setActiveTab('resumes');
  };

  // Create New Resume Handler
  const handleCreateNewResume = () => {
    const newRes: ResumeData = {
      id: `resume-${Date.now()}`,
      title: 'New Candidate Resume Draft',
      updatedAt: new Date().toISOString(),
      version: 'v1.0',
      personalInfo: {
        fullName: 'Candidate Name',
        jobTitle: 'Target Position Title',
        email: 'email@example.com',
        phone: '+1 (555) 000-0000',
        location: 'City, State',
        website: '',
        linkedin: '',
        github: '',
        photoUrl: '',
        summary: 'Professional candidate overview and key value propositions.',
      },
      experiences: [],
      educations: [],
      skillCategories: [
        { id: 'sk-1', category: 'Core Skills', skills: ['Skill 1', 'Skill 2', 'Skill 3'] },
      ],
      projects: [],
      certifications: [],
      customSections: [],
    };

    setResumesList([newRes, ...resumesList]);
    setActiveResume(newRes);
    setActiveTab('resumes');
  };

  // Update Resume Handler
  const handleUpdateResume = (updated: ResumeData) => {
    setActiveResume(updated);
    setResumesList(resumesList.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <HeaderNavbar
        onOpenTemplates={() => setIsTemplateGalleryOpen(true)}
        onOpenDesignStudio={() => {
          setActiveTab('resumes');
        }}
        onExport={handleExportPdf}
        activeTemplateName={activeTemplate.name}
      />

      {/* Hero Banner (Shown on Dashboard tab) */}
      {activeTab === 'dashboard' && (
        <SaaSShowcase
          onCreateResume={() => setActiveTab('resumes')}
          onImportResume={() => setActiveTab('import')}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Main Workspace Layout with Sidebar */}
      <div className="flex relative z-10 max-w-[1850px] mx-auto">
        {/* Sidebar Navigation */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'templates') {
              setIsTemplateGalleryOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content View Container */}
        <main ref={builderRef} className="flex-1 p-4 md:p-8 min-w-0">
          {/* TAB 1: Dashboard View */}
          {activeTab === 'dashboard' && (
            <DashboardView
              resume={activeResume}
              resumesList={resumesList}
              onSelectResume={handleSelectResume}
              onCreateNewResume={handleCreateNewResume}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 2: Resumes / Resume Builder View */}
          {activeTab === 'resumes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Editor Controls Column */}
              <div className="lg:col-span-5 h-[850px] sticky top-20">
                <ResumeEditor
                  resume={activeResume}
                  template={activeTemplate}
                  onChangeResume={handleUpdateResume}
                  onChangeTemplate={setActiveTemplate}
                />
              </div>

              {/* Document Preview Column */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div>
                    <h3 className="font-bold text-sm text-white">Live Print Preview Canvas</h3>
                    <p className="text-xs text-slate-400">
                      Pixel-perfect A4 printable resume rendering
                    </p>
                  </div>
                  <button
                    onClick={handleExportPdf}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    Export PDF
                  </button>
                </div>

                {/* Document Render Canvas Container */}
                <div className="w-full overflow-x-auto p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex justify-center">
                  <div className="w-full max-w-[800px]">
                    <ResumeDocument
                      resume={activeResume}
                      template={activeTemplate}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Import View */}
          {activeTab === 'import' && (
            <ImportOcrView
              onImportSuccess={(imported) => {
                setResumesList([imported, ...resumesList]);
                setActiveResume(imported);
                setActiveTab('resumes');
              }}
            />
          )}

          {/* TAB 4: Cover Letters View */}
          {activeTab === 'cover-letters' && <CoverLetterView resume={activeResume} />}

          {/* TAB 5: Job Match & ATS Analysis View */}
          {activeTab === 'job-match' && (
            <JobMatchView
              resume={activeResume}
              onUpdateResume={handleUpdateResume}
              onNavigateToEditor={() => setActiveTab('resumes')}
            />
          )}

          {/* TAB 6: Applications Tracker View */}
          {activeTab === 'applications' && <ApplicationsView />}

          {/* TAB 7: Web Portfolio View */}
          {activeTab === 'portfolio' && <PortfolioGeneratorView resume={activeResume} />}

          {/* TAB 8: Settings View */}
          {activeTab === 'settings' && <SettingsView />}

          {/* TAB 9: Profile View */}
          {activeTab === 'profile' && (
            <ProfileView resume={activeResume} onUpdateResume={handleUpdateResume} />
          )}

          {/* TAB 10: Export Hub View */}
          {activeTab === 'export' && (
            <ExportHubView resume={activeResume} onExportPdf={handleExportPdf} />
          )}
        </main>
      </div>

      {/* Templates Modal */}
      <TemplateGallery
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        selectedTemplate={activeTemplate}
        onSelectTemplate={setActiveTemplate}
      />
    </div>
  );
}

export default App;
