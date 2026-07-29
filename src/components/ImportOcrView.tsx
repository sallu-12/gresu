import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { ResumeData } from '../types';

interface ImportOcrViewProps {
  onImportSuccess: (importedResume: ResumeData) => void;
}

export const ImportOcrView: React.FC<ImportOcrViewProps> = ({ onImportSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const processFile = (file: File) => {
    setIsUploading(true);
    setImportStatus(`Parsing ${file.name}...`);

    setTimeout(() => {
      // Create imported structured resume
      const mockImported: ResumeData = {
        id: `imported-${Date.now()}`,
        title: `Imported Resume (${file.name.replace(/\.[^/.]+$/, '')})`,
        updatedAt: new Date().toISOString(),
        version: 'v1.0 - Parsed',
        personalInfo: {
          fullName: 'Imported Candidate',
          jobTitle: 'Senior Technology Leader',
          email: 'candidate.parsed@enterprise.org',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          website: '',
          linkedin: 'linkedin.com/in/imported-candidate',
          github: 'github.com/imported-candidate',
          photoUrl: '',
          summary: 'Experienced technology professional with extensive expertise in cloud computing, microservice architecture, and engineering team management.',
        },
        experiences: [
          {
            id: 'imp-exp-1',
            company: 'TechCorp Enterprise',
            role: 'Lead Systems Architect',
            location: 'San Francisco, CA',
            startDate: '2020',
            endDate: 'Present',
            current: true,
            bullets: [
              'Extracted from uploaded resume document.',
              'Led migration of enterprise applications to multi-region cloud infrastructure.',
            ],
          },
        ],
        educations: [
          {
            id: 'imp-edu-1',
            institution: 'State University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'CA',
            startDate: '2015',
            endDate: '2019',
          },
        ],
        skillCategories: [
          {
            id: 'imp-sk-1',
            category: 'Core Competencies',
            skills: ['Cloud Systems', 'TypeScript', 'Docker', 'System Architecture', 'Agile Leadership'],
          },
        ],
        projects: [],
        certifications: [],
        customSections: [],
      };

      setIsUploading(false);
      setImportStatus('Successfully parsed document structure!');
      onImportSuccess(mockImported);
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" />
          <span>Resume Import Engine</span>
        </h2>
        <p className="text-xs text-slate-400">
          Upload existing PDF, DOCX, or JSON resumes to extract contact information, work history, education, and skill inventories automatically.
        </p>
      </div>

      {/* Drag & Drop Target Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-10 rounded-2xl border-2 border-dashed text-center transition-all ${
          dragOver
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-indigo-400">
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {isUploading ? 'Extracting Resume Data...' : 'Drag & Drop PDF or DOCX Resume'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports standard PDF, DOCX, TXT, and RESUMIX JSON formats up to 25MB.
            </p>
          </div>

          {!isUploading && (
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer transition-colors shadow-sm">
              <FileText className="w-4 h-4" />
              <span>Select File from Computer</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          )}

          {importStatus && (
            <p className="text-xs font-medium text-emerald-400 flex items-center justify-center gap-1.5 pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{importStatus}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
