import React, { useState } from 'react';
import { TemplateStyle } from '../types';
import { GENERATED_TEMPLATES, OFFICIAL_CATEGORIES } from '../data/templates';
import { Search, Sparkles, Check, X, Filter } from 'lucide-react';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: TemplateStyle;
  onSelectTemplate: (template: TemplateStyle) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', ...OFFICIAL_CATEGORIES];

  const filteredTemplates = GENERATED_TEMPLATES.filter((tpl) => {
    const matchesCategory = activeCategory === 'ALL' || tpl.category === activeCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>100+ Production Templates Available</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Select Resume Template</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
                className={`group relative bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-800/80'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badge Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tpl.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-400">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </div>

                {/* Color Swatch Preview */}
                <div className="h-24 rounded-lg bg-slate-950 border border-slate-800 p-3 mb-3 flex flex-col justify-between relative overflow-hidden">
                  <div
                    className="h-2 rounded w-full"
                    style={{ backgroundColor: tpl.primaryColor }}
                  />
                  <div className="space-y-1 my-1">
                    <div className="h-1.5 rounded w-3/4 bg-slate-800" />
                    <div className="h-1.5 rounded w-1/2 bg-slate-800" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{tpl.layout}</span>
                    <span>{tpl.fontFamily}</span>
                  </div>
                </div>

                {/* Template Name & Description */}
                <div>
                  <h4 className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors mb-1">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
