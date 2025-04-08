import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogDiscount({open, handleClose, handleAction, monthlyPayment}) {
    function calcYearlyWithDiscount(monthlyPayment) {
        let sum = (monthlyPayment * 12) - ((monthlyPayment * 12) * 0.2);
        return Math.round(sum);
    }

    return (
        <div className="font-sans">
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth={'lg'}
                PaperProps={{
                    style: {
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                    },
                }}
            >
                <DialogTitle className='text-center bg-white' 
                    sx={{
                        minWidth:"280px", 
                        fontSize:"24px", 
                        letterSpacing:1.5,
                        color: '#1a1a1a',
                        fontWeight: 600,
                        paddingY: 3
                    }}>
                    Річна знижка
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#1a1a1a',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'rotate(90deg)',
                            color: '#ff0000'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent className="bg-white">
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full py-2">
                                <div className="overflow-hidden rounded-lg shadow-lg">
                                    <table className="min-w-full text-left text-sm font-light bg-white">
                                        <thead className="border-b bg-gray-50">
                                            <tr className="text-gray-800">
                                                <th scope="col" className="px-6 py-4 text-lg font-semibold">К-сть</th>
                                                <th scope="col" className="px-6 py-4 text-lg font-semibold">Сума</th>
                                                <th scope="col" className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                onClick={() => {
                                                    handleAction(calcYearlyWithDiscount(monthlyPayment));
                                                    handleClose();
                                                }}
                                                className="border-b transition-all duration-300 ease-in-out hover:bg-red-50 cursor-pointer transform hover:scale-[1.01] hover:shadow-md"
                                            >
                                                <td className="whitespace-nowrap px-6 py-6 font-medium text-red-600">12 міс. -20%</td>
                                                <td className="whitespace-nowrap px-6 py-6">
                                                    <div className='flex flex-col justify-center gap-2'>
                                                        <span className='text-gray-400 line-through text-lg'>{monthlyPayment * 12} грн.</span>
                                                        <span className='font-bold text-2xl text-gray-900'>{calcYearlyWithDiscount(monthlyPayment)} грн.</span>    
                                                    </div>
                                                    <span className="text-sky-600 text-sm font-medium">
                                                        ви заощаджуєте: {Math.round(monthlyPayment * 12 * 0.2)} грн.
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-6 text-red-500">→</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}