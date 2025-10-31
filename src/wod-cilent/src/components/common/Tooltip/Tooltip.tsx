import React from 'react';
import './Tooltip.css';
import Icon from '../Icon'

interface TooltipProps {
  label: string;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ label, content }) => {
  return (
    <div className="tooltip-container">
      <span className="tooltip-label">{label}</span>
      <Icon name="info" />
      <div className="tooltip-content">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;