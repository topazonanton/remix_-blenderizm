import React from 'react';
import { X, Cpu } from 'lucide-react';
import { Project } from '../types';
import { useTranslation } from '../i18n';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Container Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-details-title"
        className="relative bg-surface-dark w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full border border-white/10 cursor-pointer transition-all duration-300"
          aria-label={t.modal.closeDetails}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: High-res Render Screen */}
        <div className="w-full md:w-1/2 min-h-[250px] md:min-h-0 relative bg-black/50 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover md:absolute md:inset-0"
          />
          {/* Edge shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Right Side: Technical Specs & Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] text-industrial-orange uppercase tracking-widest font-bold">
                {project.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              <span className="font-mono text-[10px] text-on-surface-variant/80 uppercase">
                ID: {project.id.toUpperCase()}
              </span>
            </div>
            
            <h3 id="project-details-title" className="text-2xl font-black text-on-surface font-sans tracking-tight">
              {project.title}
            </h3>

            <p className="text-sm text-on-surface-variant mt-3.5 leading-relaxed">
              {project.description}
            </p>

            {/* Software Stack Badges */}
            <div className="mt-5">
              <h4 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-2">
                {t.modal.softwarePipeline}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.software.map((sw) => (
                  <span
                    key={sw}
                    className="px-2.5 py-1 bg-white/[0.04] border border-white/5 rounded-md font-mono text-[11px] text-white"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Render & Modeling Metadata Card */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Cpu className="w-4 h-4 text-industrial-orange" />
              <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-widest">
                {t.modal.geometrySpecs}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 font-mono text-xs text-on-surface-variant">
              {project.specs.triangles && (
                <div>
                  <span className="text-[10px] text-on-surface-variant/60 block">{t.modal.triangleCount}</span>
                  <span className="text-white font-bold">{project.specs.triangles}</span>
                </div>
              )}
              {project.specs.vertices && (
                <div>
                  <span className="text-[10px] text-on-surface-variant/60 block">{t.modal.verticesCount}</span>
                  <span className="text-white font-bold">{project.specs.vertices}</span>
                </div>
              )}
              {project.specs.textures && (
                <div>
                  <span className="text-[10px] text-on-surface-variant/60 block">{t.modal.textureSets}</span>
                  <span className="text-white font-bold">{project.specs.textures}</span>
                </div>
              )}
              {project.specs.renderTime && (
                <div>
                  <span className="text-[10px] text-on-surface-variant/60 block">{t.modal.renderTime}</span>
                  <span className="text-white font-bold">{project.specs.renderTime}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-mono text-xs py-3 rounded-xl transition-all duration-300 cursor-pointer"
          >
            {t.modal.closeInspector}
          </button>
        </div>
      </div>
    </div>
  );
}
