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
            backgroundColor: 'rgba(132, 204, 22, 0.9)',
            color: 'white',
            fontSize: '14px',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 2px 4px rgba(132, 204, 22, 0.2)',
          },
          '& .MuiTooltip-arrow': {
            color: 'rgba(132, 204, 22, 0.9)',
          },
          '& .MuiTooltip-arrow::before': {
            boxShadow: '0 2px 4px rgba(132, 204, 22, 0.2)',
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
