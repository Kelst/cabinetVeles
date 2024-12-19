import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Bay from '../../assets/bay.png'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExitDialog({open,handleClose,handleLogOuth}) {


  return (
    <React.Fragment>
     
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className=' text-center ' sx={{minWidth:"280px",fontSize:"32px"}}>{"Ви хочете вийти ?"}</DialogTitle>
        
        <DialogContent>
        <img className='w-40   object-cover mx-auto' src={Bay} alt="вийти" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{color:'black'}}>Залишитись</Button>
          <Button onClick={handleLogOuth}sx={{color:'black'}}>Вийти</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}