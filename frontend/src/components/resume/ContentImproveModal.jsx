import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Sparkles, ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { useToast } from '../../context/ToastContext';

const ContentImproveModal = ({
  isOpen,
  onClose,
  resumeId,
  section,
  currentText,
  context,
  onApply,
}) => {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState(null);
  const { error, success } = useToast();

  const handleFetchImprovement = async () => {
    try {
      setLoading(true);
      const res = await aiApi.improveContent(resumeId, {
        section,
        currentText,
        context,
      });
      setProposal(res);
    } catch (err) {
      console.error('Failed to improve content:', err);
      error(err.response?.data?.message || 'Failed to generate improvement proposal');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && currentText) {
      handleFetchImprovement();
    } else {
      setProposal(null);
    }
  }, [isOpen, currentText]);

  const handleAccept = () => {
    if (proposal?.improvedText) {
      onApply(proposal.improvedText);
      success('Improvement applied!');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Content Improvement Proposal"
      subtitle="Review the suggested changes before applying them to your resume."
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-sm font-medium">Refining bullet point with grounded action verbs...</p>
        </div>
      ) : proposal ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Original Text
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{proposal.originalText}</p>
              </div>
              <span className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                Your input
              </span>
            </div>

            {/* Improved */}
            <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-950/20 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Proposed Improvement
                </span>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                  {proposal.improvedText}
                </p>
              </div>
              {proposal.explanation && (
                <div className="mt-3 pt-2 border-t border-brand-500/20 text-[11px] text-brand-300">
                  <span className="font-semibold">Enhancement:</span> {proposal.explanation}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary">
              Keep Original
            </button>
            <button type="button" onClick={handleAccept} className="btn-primary">
              <Check className="w-4 h-4 mr-1" />
              Accept Improvement
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-sm">
          No improvement proposal available.
        </div>
      )}
    </Modal>
  );
};

export default ContentImproveModal;
