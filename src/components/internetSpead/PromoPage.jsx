import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContactInfoButton from '../сontactInfoButton/ContactInfoButton';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(to bottom, #1a1a1a, #004d40, #1a1a1a)',
  minHeight: '100vh',
  padding: theme.spacing(4),
  color: '#ffffff'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(26, 26, 26, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid #00796b',
  marginBottom: theme.spacing(4),
  color: '#ffffff',
  '&:hover': {
    boxShadow: '0 0 15px rgba(0, 121, 107, 0.3)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease'
  }
}));

const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, delay }
      });
    }
  }, [controls, inView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

const PromoPage = () => {
  return (
    <StyledPaper>
      <Container maxWidth="lg">
        <AnimatedSection delay={0.2}>
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              color: '#4caf50',
              mb: 2, 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
            АКЦІЯ "ПРИВЕДИ ДРУГА"
          </Typography>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              color: '#e0e0e0'
            }}>
            3 МІСЯЦІ ПОСЛУГ У ПОДАРУНОК!
          </Typography>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, color: '#e0e0e0' }}>
                Підключайте друга, товариша, хорошого знайомого, колегу або просто сусіда до Інтернет-провайдера "Оптикомплюс" і отримуйте 3 місяці послуг у подарунок!
              </Typography>
            </CardContent>
          </StyledCard>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#4caf50', mb: 2, fontWeight: 'bold' }}>
                Як стати учасником акції:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#e0e0e0' }}>
                        1. Домовтеся з другом про підключення та залиште заявку за тел.: <ContactInfoButton iconColor="white"/>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#e0e0e0' }}>
                        2. У заявці вкажіть акцію «Приведи друга» і Ваш логін
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <StyledCard>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#4caf50', mb: 2, fontWeight: 'bold' }}>
                Спеціальна пропозиція!
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, color: '#e0e0e0' }}>
                Підключіть 5 друзів за один місяць та отримайте:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#e0e0e0' }}>
                        • 3 безкоштовні місяці послуг
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#e0e0e0' }}>
                        • Роутер у подарунок
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#4caf50', mb: 2, fontWeight: 'bold' }}>
                Важливо!
              </Typography>
              <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
                Бонуси будуть зараховані Вам протягом 7 днів після підключення Вашого друга.
              </Typography>
            </CardContent>
          </StyledCard>
        </AnimatedSection>
      </Container>
    </StyledPaper>
  );
};

export default PromoPage;