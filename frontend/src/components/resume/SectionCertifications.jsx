import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const SectionCertifications = ({ data = [], onChange }) => {
  const addCertification = () => {
    const newCert = {
      id: 'cert_' + Date.now(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
    };
    onChange([...data, newCert]);
  };

  const updateCertification = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCertification = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {data.map((cert, idx) => (
        <div
          key={cert.id || idx}
          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 relative space-y-3"
        >
          <button
            type="button"
            onClick={() => removeCertification(idx)}
            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
            title="Remove certification"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Certification Name *</label>
              <input
                type="text"
                value={cert.name || ''}
                onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Issuing Organization *</label>
              <input
                type="text"
                value={cert.issuer || ''}
                onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Issue Date</label>
              <input
                type="text"
                value={cert.issueDate || ''}
                onChange={(e) => updateCertification(idx, 'issueDate', e.target.value)}
                placeholder="e.g. Mar 2024"
                className="input-field !text-xs !py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Credential URL</label>
              <input
                type="url"
                value={cert.credentialUrl || ''}
                onChange={(e) => updateCertification(idx, 'credentialUrl', e.target.value)}
                placeholder="https://..."
                className="input-field !text-xs !py-1.5"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCertification}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/60 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-brand-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Certification Entry
      </button>
    </div>
  );
};

export default SectionCertifications;
