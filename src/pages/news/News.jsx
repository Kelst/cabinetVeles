import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import style from "./News.module.css";
import MysteriousText from '../../components/MysteriousText/MysteriousText';
import useConfigPage from '../../store/configPage';

export default function News() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { news, getNews } = useConfigPage();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      await getNews('Opticom');
      setIsLoading(false);
    };
    fetchNews();
  }, [getNews]);

  const handleOpenDialog = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseDialog = () => {
    setSelectedArticle(null);
  };

  const renderNewsItem = (article, index) => {
    const isEven = index % 2 === 0;
    const imageOrder = isEven ? "lg:order-1" : "lg:order-2";
    const contentOrder = isEven ? "lg:order-2" : "lg:order-1";

    return (
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        key={index}
        className="mb-12 grid items-center gap-x-6 lg:grid-cols-2 xl:gap-x-12 md:px-4"
      >
        <motion.div 
          className={`mb-6 lg:mb-0 ${imageOrder}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 cursor-pointer transform transition-all duration-300 hover:shadow-2xl"
            onClick={() => handleOpenDialog(article)}
          >
            <motion.img 
              src={article.url} 
              className="w-[full]" 
              alt={article.title}
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed transition duration-300 ease-in-out hover:bg-[hsla(0,0%,98.4%,.15)]">
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={`${contentOrder} px-4 lg:px-0`}
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.3 }}
        >
          <h3 className="mb-3 text-2xl font-bold hover:text-blue-400 transition-colors duration-300">
            {article.title}
          </h3>
          <div className="mb-3 flex items-center text-sm font-medium text-blue-400 dark:text-blue-300 md:justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
              stroke="currentColor" className="mr-2 h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
            </svg>
            {article.category}
          </div>
          <p className="mb-6 text-neutral-400 dark:text-neutral-300">
            <small>Опубліковано <u>{new Date(article.date).toLocaleDateString()}</u> by
              <a href="#!" className="hover:text-blue-400 transition-colors duration-300"> {article.author}</a>
            </small>
          </p>
          <div className="text-neutral-400 dark:text-neutral-300 hover:text-neutral-300 transition-colors duration-300">
            <MysteriousText>
              {article.preview}
            </MysteriousText>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`${style.animationBorderSM} text-white relative min-h-screen`}>
      <div className="container my-12 md:my-24 mx-auto md:px-6">
        <section className="mb-32 text-center md:text-left">
          <motion.div 
            className="relative py-12 md:py-16 px-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-b from-black/50 to-transparent opacity-50"></div>
            </div>
            <div className="relative">
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-24 h-1 bg-blue-500 mb-8 rounded-full glow-effect"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <MysteriousText>Останні новини</MysteriousText>
                </motion.h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8 text-base md:text-lg">
                  <MysteriousText>
                    Будьте в курсі останніх оновлень та спеціальних пропозицій від Opticom
                  </MysteriousText>
                </p>
                <div className="flex items-center gap-4 mb-12">
                  <motion.div 
                    className="w-12 h-[2px] bg-gray-700"
                    animate={{ scaleX: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-blue-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-12 h-[2px] bg-gray-700"
                    animate={{ scaleX: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <AnimatePresence>
              {news.map((article, index) => renderNewsItem(article, index))}
            </AnimatePresence>
          )}
        </section>
      </div>
      
      <Dialog
        open={!!selectedArticle}
        onClose={handleCloseDialog}
        maxWidth={false}
        fullScreen={window.innerWidth < 600}
        PaperProps={{
          sx: {
            bgcolor: '#1F2937',
            width: '100%',
            maxWidth: { 
              xs: '100% !important',
              sm: '600px !important',
              md: '800px !important',
              lg: '1000px !important' 
            },
            m: { xs: 0, sm: 2 },
            height: { xs: '100%', sm: 'auto' },
            maxHeight: { xs: '100%', sm: '90vh' },
            borderRadius: { xs: 0, sm: 2 },
          }
        }}
      >
        <IconButton
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
            zIndex: 1,
            '&:hover': {
              color: 'common.white',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, '&::-webkit-scrollbar': { display: 'none' } }}>
          <div className="w-full mx-auto">
            {selectedArticle && (
              <div className="space-y-6 text-gray-200">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedArticle.title}
                </h2>

                <p className="text-sm text-gray-400">
                  Опубліковано{' '}
                  <time>{new Date(selectedArticle.date).toLocaleDateString()}</time>
                  {' '}by {selectedArticle.author}
                </p>

                {selectedArticle.url && (
                  <img 
                    src={selectedArticle.url} 
                    alt={selectedArticle.title}
                    className="w-full rounded-lg object-cover h-full"
                  />
                )}

                <div 
                  className={`prose prose-invert max-w-none space-y-4 ${style.articleContent}`}
                  dangerouslySetInnerHTML={{ 
                    __html: selectedArticle.content || selectedArticle.preview 
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}