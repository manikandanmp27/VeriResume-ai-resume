import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 text-brand-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-1.5" />}
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
