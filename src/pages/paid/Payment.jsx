import React from 'react';
import style from "./Payment.module.css";
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paid from '../../components/payment/Paid';
import Withdrawal from '../../components/payment/Withdrawal';
import Pay from '../../components/payment/Pay';
import PaymentDialog from '../../components/dialog/PaymentDialog';
import { motion, AnimatePresence } from 'framer-motion';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
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
    backgroundColor: '#A4DE02', // Lime green color
    marginBottom: "10px",
    marginTop: "10px",
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    backgroundColor: '#353535', // Matte black
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.7)', // Slightly faded black
    '&.Mui-selected': {
      color: '#000000', // Solid black
    },
    '&.MuiTabs-indicator': {
      color: '#000000' // Black
    }
  }),
);

export default function Payment() {
  const [value, setValue] = React.useState(0);
  const [type, setType] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);

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
              <StyledTab label="Поповнення рахунку" />
              <StyledTab label="Оплати" />
              <StyledTab label="Зняття " />
            </StyledTabs>
            <div sx={{ p: 3 }} />
          </div>
        </div>

        <div className={style.animationBorderSM}>
          <TabPanel value={value} index={0}>
            <Pay handlePayDialogShow={handlePayDialogShow} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Paid />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Withdrawal />
          </TabPanel>
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