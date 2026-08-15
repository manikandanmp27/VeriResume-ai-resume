import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', size = 'medium', className = '' }) => {
  let iconSize = 'w-6 h-6';
  if (size === 'small') iconSize = 'w-4 h-4';
  if (size === 'large') iconSize = 'w-10 h-10';

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-6 text-slate-400 ${className}`}>
      <Loader2 className={`${iconSize} animate-spin text-brand-500`} />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
