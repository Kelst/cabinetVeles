import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ContactInfoButton from '../сontactInfoButton/ContactInfoButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ArticleDialog({ open, handleClose, article }) {
  if (!article) return null;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="
          relative
          mb-12 
          mt-4 
          pb-4 
          text-center 
          text-3xl 
          font-bold
          bg-gradient-to-r 
          from-gray-800 
          to-gray-600 
          bg-clip-text 
          text-transparent
          after:content-['']
          after:absolute
          after:bottom-0
          after:left-1/2
          after:-translate-x-1/2
          after:h-1
          after:w-24
          after:bg-blue-500
          after:rounded-full
          after:transition-all
          after:duration-300
          hover:after:w-32
          hover:scale-105
          transition-all
          duration-300
        ">
          {article.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div className="container my-24 mx-auto md:px-6">
            <section className="mb-32 text-center">
              <div className="grid gap-6">
                <div className="mb-6 lg:mb-0">
                  <div className="relative block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                    <div className="flex">
                      <div className="relative mx-4 -mt-4 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-sky-800/20">
                        <img src={article.url} className="w-full" alt={article.title} />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 text-2xl font-bold">{article.title}</h3>
                      <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                        <small>Опубліковано <u>{new Date(article.date).toLocaleDateString()}</u> by
                          <a href="#!"> {article.author}</a>
                        </small>
                      </p>
                      <div 
                        className="space-y-4 text-neutral-500 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto p-6 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: 'sky-800' }}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}