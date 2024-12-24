import React from 'react';
import style from "./Info.module.css";
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import PaymentDialog from '../../components/dialog/PaymentDialog';
import MapOffice from '../../components/Map/MapOffice';
import MyTaskViewer from '../../components/Task/MyTaskViewer';
import FAQ from '../../components/faq/FAQ';
import TV from '../../components/tv/TV';
import { motion, AnimatePresence } from 'framer-motion';
import NetworkDiagnostics from '../../components/networkDiagnostics/NetworkDiagnostics';
import useConfigPage from '../../store/configPage';
import NetworkInfo from '../../components/networkComponent/NetworkInfo';
import InternetSpeedTest from '../../components/internetSpead/PromoPage';
import PromoPage from '../../components/internetSpead/PromoPage';
import FeedbackForm from '../../components/feedbackForm/FeedbackForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className='flex justify-center items-center'
      role="tabpanel"
      hidden={value !== index}
      id={`animated-tabpanel-${index}`}
      aria-labelledby={`animated-tab-${index}`}
      {...other}
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <Typography>{children}</Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  position: 'relative',
  zIndex: 0,
  '& .MuiTabs-indicator': {
    backgroundColor: '#A4DE02', // Lime green
    marginBottom: "10px",
    marginTop: "10px",
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    backgroundColor: '#353535', // Matte black
  },
  '& .MuiTabs-flexContainer': {
    '& button': {
      '&:hover': {
        color: '#90EE90', // Lighter lime green for hover
        opacity: 1,
      },
    },
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.7)',
    '&.Mui-selected': {
      color: '#000000', // Black
    },
    '&.MuiTabs-indicator': {
      color: "#000000" // Black
    },
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.9)', // Darker black for hover
    }
  }),
);

export default function Info() {
  const configCabinet = useConfigPage(state => state.configCabinet);
  const [value, setValue] = React.useState(0);
  const [type, setType] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);

  const visibleTabs = [
    { label: "Мої заявки", show: configCabinet.additional.showTask, component: <MyTaskViewer /> },
    { label: "Приведи друга", show: configCabinet.additional.addFriend, component: <PromoPage/>  },
    { label: "Офіси", show: configCabinet.additional.showOffice, component: (
      <div>
        <div className='mb-2 flex flex-wrap justify-center items-center'>
          <div className='text-sm border-2 border-[#A4DE02]/30 rounded-md p-3 mx-[20px] flex flex-col items-start justify-center mb-2 hover:border-[#A4DE02] transition-colors duration-300'>
            <div className='font-bold'>ТЦ "Проспект", оф. № 128А (праворуч від ескалатору)</div>
            <div className='text-[14px]'>пн-пт 09:00 - 18:00 (перерва 14:00 - 15:00)</div>
            <div className='text-[12px]'>сб 10:00 - 18:00 (перерва 13:00 - 14:00), нд - вихідний</div>
          </div>
          <div className='text-sm border-2 border-[#A4DE02]/30 rounded-md p-3 mx-[20px] flex flex-col items-start justify-center hover:border-[#A4DE02] transition-colors duration-300'>
            <div className='font-bold'>ТРЦ «DEPOt» (2-й поверх)</div>
            <div className='text-[14px]'>пн-нд 10:00 - 20:00 (перерва 14:00 - 14:30)</div>
          </div>
        </div>
        <MapOffice />
      </div>
    ) },
    { label: "FAQ", show: true, component: <FAQ /> },
    { label: "Телебачення", show: configCabinet.additional.tv, component: <TV /> },
    { label: "Відгуки та пропозиції 📝", show: configCabinet.additional.addFeedback, component: <FeedbackForm /> }
  ].filter(tab => tab.show);

  React.useEffect(() => {
    if (value >= visibleTabs.length) {
      setValue(0);
    }
  }, [visibleTabs.length, value]);

  const handlePayDialogShow = (type) => {
    setType(type);
    setOpenDialog(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section>
      <div className='md:block'>
        <div>
          <div className='relative z-2'>
            <StyledTabs
              value={value}
              onChange={handleChange}
              scrollButtons
              allowScrollButtonsMobile
              variant="scrollable"
            >
              {visibleTabs.map((tab, index) => (
                <StyledTab key={tab.label} label={tab.label} />
              ))}
            </StyledTabs>
            <div sx={{ p: 3 }} />
          </div>
        </div>

        <div className={`${style.animationBorderSM} text-white`}>
          {visibleTabs.map((tab, index) => (
            <TabPanel key={tab.label} value={value} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </div>

        <PaymentDialog
          type={type}
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
        />
      </div>
    </section>
  );
}