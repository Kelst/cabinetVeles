import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import clases from "./GlasmorphizmButton.module.css";

export default function GlasmorphizmButton({
  label = "Button",
  handleAction,
  disabled = false,
  disabledReason = "",
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    if (disabled && disabledReason) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={`${clases.buttonWrapper}`}>
      <Tooltip 
        title={disabledReason}
        open={disabled && showTooltip}
        followCursor={false}
        arrow
        placement="top"
        onClose={() => setShowTooltip(false)}
        sx={{
          '& .MuiTooltip-tooltip': {
            background: 'linear-gradient(to bottom, #7d9dae, #6c8b9b)',
            color: 'white',
            fontSize: '14px',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 3px 8px rgba(108, 139, 155, 0.4)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          },
          '& .MuiTooltip-arrow': {
            color: '#6c8b9b',
          },
          '& .MuiTooltip-arrow::before': {
            boxShadow: '0 3px 8px rgba(108, 139, 155, 0.4)',
          }
        }}
      >
        <div 
          className={`${clases.container} ${disabled ? clases.disabled : ''}`}
          onClick={disabled ? undefined : handleAction}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={clases.btn}>
            <span>{label}</span>
          </div>
        </div>
      </Tooltip>
    </div>
  );
}