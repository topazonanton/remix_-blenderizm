import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { ClientInquiry } from '../types';
import { useTranslation } from '../i18n';

interface ContactFormProps {
  isModal?: boolean;
  onSuccessClose?: () => void;
}

export default function ContactForm({ isModal = false, onSuccessClose }: ContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '3D Modeling',
    budget: '$1,000 - $3,000',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Form Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(t.errors.required);
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError(t.errors.email);
      setLoading(false);
      return;
    }

    // Simulate Server API Call
    setTimeout(() => {
      const newInquiry: ClientInquiry = {
        id: `inq_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message,
        timestamp: new Date().toLocaleTimeString()
      };

      // Store in React state and LocalStorage for durable local persistence
      const updatedInquiries = [newInquiry, ...inquiries];
      setInquiries(updatedInquiries);
      localStorage.setItem('blenderizm_inquiries', JSON.stringify(updatedInquiries));

      setLoading(false);
      setSuccess(true);

      // Clear Form Fields
      setFormData({
        name: '',
        email: '',
        projectType: '3D Modeling',
        budget: '$1,000 - $3,000',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className={`w-full ${isModal ? '' : 'glass-panel rounded-2xl p-8 md:p-12 border border-industrial-orange/20 relative overflow-hidden'}`}>
      {!isModal && (
        <>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-industrial-orange/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-printer-green/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      {success ? (
        <div className="text-center py-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-printer-green/20 border border-printer-green flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(74,222,128,0.3)] animate-bounce">
            <CheckCircle className="w-8 h-8 text-printer-green" />
          </div>
          <h3 className="text-2xl font-black text-on-surface font-sans">{t.contact.successTitle}</h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mt-2 leading-relaxed">
            {t.contact.successDescription}
          </p>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer"
            >
              {t.contact.sendAnother}
            </button>
            {onSuccessClose && (
              <button
                onClick={onSuccessClose}
                className="px-5 py-2.5 bg-industrial-orange text-foreground text-xs font-mono font-bold rounded-lg transition-all duration-300 hover:bg-primary-accent cursor-pointer"
              >
                {t.contact.closeWindow}
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-black text-on-surface font-sans">{t.contact.title}</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
              {t.contact.description}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">{t.contact.nameLabel}</label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.contact.placeholders.name}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange/30 placeholder-white/20 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">{t.contact.emailLabel}</label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t.contact.placeholders.email}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange/30 placeholder-white/20 transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-type" className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">{t.contact.projectLabel}</label>
              <select
                id="contact-type"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange/30 transition-all duration-300 cursor-pointer"
              >
                <option value="3D Modeling">{t.contact.projectTypes.modeling}</option>
                <option value="Product Rendering">{t.contact.projectTypes.rendering}</option>
                <option value="Substance Texturing">{t.contact.projectTypes.texturing}</option>
                <option value="General Collaboration">{t.contact.projectTypes.collaboration}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-budget" className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">{t.contact.budgetLabel}</label>
              <select
                id="contact-budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange/30 transition-all duration-300 cursor-pointer"
              >
                <option value="Under $1,000">{t.contact.budgets.under1000}</option>
                <option value="$1,000 - $3,000">{t.contact.budgets.standard}</option>
                <option value="$3,000 - $8,000">{t.contact.budgets.detailed}</option>
                <option value="$8,000+">{t.contact.budgets.cinematic}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold">{t.contact.messageLabel}</label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t.contact.placeholders.message}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange/30 placeholder-white/20 resize-none transition-all duration-300"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-industrial-orange hover:bg-primary-accent text-foreground text-sm font-sans font-bold py-3.5 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(204,120,92,0.25)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t.contact.submit}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
