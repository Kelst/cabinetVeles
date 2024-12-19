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
            backgroundColor: 'rgba(107, 142, 35, 0.9)', // Changed to olive green
            color: 'white',
            fontSize: '14px',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 2px 4px rgba(107, 142, 35, 0.2)', // Changed shadow to olive green
          },
          '& .MuiTooltip-arrow': {
            color: 'rgba(107, 142, 35, 0.9)', // Changed to olive green
          },
          '& .MuiTooltip-arrow::before': {
            boxShadow: '0 2px 4px rgba(107, 142, 35, 0.2)', // Added shadow to arrow
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