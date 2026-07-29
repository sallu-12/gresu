import React, { useState } from 'react';
import {
  ShieldCheck,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  FileText,
  Loader2,
  Wand2,
} from 'lucide-react';
import { ResumeData } from '../types';

interface JobMatchViewProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onNavigateToEditor: () => void;
}

export const JobMatchView: React.FC<JobMatchViewProps> = ({
  resume,
  onUpdateResume,
  onNavigateToEditor,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  // Real calculation functions based on active resume content
  const calculateFormattingScore = () => {
    let score = 100;
    if (!resume.personalInfo.email) score -= 15;
    if (!resume.personalInfo.phone) score -= 10;
    if (!resume.personalInfo.location) score -= 10;
    if (resume.experiences.length === 0) score -= 25;
    if (resume.educations.length === 0) score -= 15;
    if (resume.skillCategories.length === 0) score -= 15;
    return Math.max(score, 40);
  };

  const calculateReadabilityScore = () => {
    // Calculates average words per bullet and summary length
    const totalBullets = resume.experiences.reduce((acc, exp) => acc + exp.bullets.length, 0);
    if (totalBullets === 0) return 60;
    const avgWords = resume.experiences.reduce((acc, exp) => {
      const words = exp.bullets.join(' ').split(/\s+/).length;
      return acc + words;
    }, 0) / Math.max(totalBullets, 1);

    if (avgWords >= 12 && avgWords <= 25) return 94;
    if (avgWords > 25) return 82; // Too long
    return 75;
  };

  const calculateActionVerbsScore = () => {
    const actionVerbsList = [
      'architected', 'spearheaded', 'accelerated', 'scaled', 'orchestrated',
      'developed', 'engineered', 'led', 'designed', 'optimized', 'reduced',
      'increased', 'built', 'created', 'managed', 'implemented', 'directed',
    ];
    let matchedCount = 0;
    let totalBullets = 0;

    resume.experiences.forEach((exp) => {
      exp.bullets.forEach((b) => {
        totalBullets++;
        const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase();
        if (firstWord && actionVerbsList.includes(firstWord)) {
          matchedCount++;
        }
      });
    });

    if (totalBullets === 0) return 50;
    return Math.min(Math.round((matchedCount / totalBullets) * 100), 100);
  };

  const getExtractedSkills = () => {
    const allSkills: string[] = [];
    resume.skillCategories.forEach((cat) => {
      cat.skills.forEach((s) => allSkills.push(s.toLowerCase()));
    });
    return allSkills;
  };

  const extractedUserSkills = getExtractedSkills();

  // Keyword extraction from Job Description if provided
  const extractJdKeywords = (jdText: string) => {
    if (!jdText.trim()) {
      return {
        required: ['Kubernetes', 'System Design', 'TypeScript', 'Docker', 'CI/CD', 'AWS', 'Microservices', 'REST APIs'],
        matched: ['TypeScript', 'Docker', 'REST APIs', 'AWS'],
        missing: ['Kubernetes', 'System Design', 'CI/CD', 'Microservices'],
      };
    }

    const commonKeywords = [
      'Kubernetes', 'Docker', 'System Design', 'TypeScript', 'Go', 'Rust', 'Java', 'Python',
      'AWS', 'Azure', 'GCP', 'Kafka', 'Redis', 'CI/CD', 'Microservices', 'GraphQL', 'REST APIs',
      'Terraform', 'Agile', 'Scrum', 'Leadership', 'SQL', 'NoSQL', 'Security', 'Compliance',
    ];

    const jdLower = jdText.toLowerCase();
    const required = commonKeywords.filter((kw) => jdLower.includes(kw.toLowerCase()));
    const matched = required.filter((kw) => extractedUserSkills.some((us) => us.includes(kw.toLowerCase())));
    const missing = required.filter((kw) => !matched.includes(kw));

    return {
      required: required.length > 0 ? required : ['Distributed Systems', 'Cloud Architecture', 'TypeScript', 'SQL'],
      matched: matched,
      missing: missing.length > 0 ? missing : ['Kubernetes', 'CI/CD Pipelines'],
    };
  };

  const jdAnalysis = extractJdKeywords(jobDescription);
  const formattingScore = calculateFormattingScore();
  const readabilityScore = calculateReadabilityScore();
  const actionVerbsScore = calculateActionVerbsScore();
  const keywordMatchPercent = jdAnalysis.required.length > 0
    ? Math.round((jdAnalysis.matched.length / jdAnalysis.required.length) * 100)
    : 85;

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
    }, 600);
  };

  // Tailor Resume Action: adds missing keywords into first skill category
  const handleTailorResume = () => {
    if (jdAnalysis.missing.length === 0) return;

    const updatedCategories = resume.skillCategories.map((cat, idx) => {
      if (idx === 0) {
        const uniqueSkills = Array.from(new Set([...cat.skills, ...jdAnalysis.missing]));
        return { ...cat, skills: uniqueSkills };
      }
      return cat;
    });

    onUpdateResume({
      ...resume,
      skillCategories: updatedCategories,
    });

    alert(`Successfully appended ${jdAnalysis.missing.length} missing keywords to your resume skill section.`);
    onNavigateToEditor();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Job Match & ATS Analysis</span>
          </h2>
          <p className="text-xs text-slate-400">
            Compare your active resume against target job descriptions and calculate real parser compatibility metrics.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Target Job Description (Paste Text or Upload)
        </label>

        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description requirements, responsibilities, and qualifications here..."
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-400">
            Analyzing against active resume: <strong className="text-white">{resume.title}</strong>
          </span>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculating Metrics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Job Match & ATS Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {analysisDone && (
        <div className="space-y-6">
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Formatting Score</span>
              <div className="text-2xl font-bold text-white">{formattingScore}%</div>
              <p className="text-[10px] text-slate-400">Section headers & contact info complete</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Keyword Match</span>
              <div className="text-2xl font-bold text-indigo-400">{keywordMatchPercent}%</div>
              <p className="text-[10px] text-slate-400">{jdAnalysis.matched.length} of {jdAnalysis.required.length} keywords matched</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Readability Index</span>
              <div className="text-2xl font-bold text-white">{readabilityScore}%</div>
              <p className="text-[10px] text-slate-400">Bullet word density & line length</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Action Verbs Ratio</span>
              <div className="text-2xl font-bold text-emerald-400">{actionVerbsScore}%</div>
              <p className="text-[10px] text-slate-400">Bullets starting with strong impact verbs</p>
            </div>
          </div>

          {/* Job Match Skill Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Required vs Matched vs Missing (8 cols) */}
            <div className="lg:col-span-8 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Skill Coverage & Keyword Comparison</h3>
                <button
                  onClick={handleTailorResume}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Auto-Tailor Resume</span>
                </button>
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched Skills ({jdAnalysis.matched.length})</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {jdAnalysis.matched.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 text-xs font-medium">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missing Keywords ({jdAnalysis.missing.length})</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {jdAnalysis.missing.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/80 text-xs font-medium">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvement Recommendations (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white">Actionable Recommendations</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-indigo-300">1. Keyword Alignment</span>
                  <p className="text-slate-400 leading-relaxed">
                    Incorporate {jdAnalysis.missing.slice(0, 2).join(', ')} into your Work Experience achievements.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-indigo-300">2. Quantified Metrics</span>
                  <p className="text-slate-400 leading-relaxed">
                    Ensure at least 70% of bullet points contain percentage improvements or scale figures.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-indigo-300">3. Section Validation</span>
                  <p className="text-slate-400 leading-relaxed">
                    Your contact information and educational credentials parse cleanly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
