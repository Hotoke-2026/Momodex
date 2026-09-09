import React from 'react';

interface StatusBadgeProps {
  isNative: boolean;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isNative, label }) => {
  const displayLabel = label || (isNative ? 'Native' : 'Invasive');

  return (
    <span
      data-testid="status-badge"
      className={`badge ${isNative ? 'badge--native' : 'badge--invasive'}`}
    >
      {displayLabel}
    </span>
  );
};