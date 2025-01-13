import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CombinedContactMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconVariants = {
    animate: {
      rotate: [0, -10, 0, 10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <Tooltip title="Зв'язатися з нами" arrow>
        <motion.div
          variants={iconVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
        >
          <IconButton
            onClick={handleClick}
            className="w-12 h-12 bg-red-500 hover:bg-red-600"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </IconButton>
        </motion.div>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgb(239, 68, 68)',
            color: 'white',
            minWidth: '200px'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            // Add your Telegram button click handler here
            console.log("Telegram clicked");
            handleClose();
          }}
          className="hover:bg-red-500/20"
        >
          <div className="flex items-center gap-2">
            <img src="/api/placeholder/24/24" alt="Telegram" className="w-6 h-6" />
            <span>Telegram</span>
          </div>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            // Add your Feedback modal click handler here
            console.log("Feedback clicked");
            handleClose();
          }}
          className="hover:bg-red-500/20"
        >
          <div className="flex items-center gap-2">
            <img src="/api/placeholder/24/24" alt="Feedback" className="w-6 h-6" />
            <span>Зворотний зв'язок</span>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default CombinedContactMenu;