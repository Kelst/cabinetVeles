import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TvIcon from '@mui/icons-material/Tv';
import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import useStore from '../../store/store';
import ContactInfoButton from '../сontactInfoButton/ContactInfoButton';
import TariffDialog from '../dialog/TariffDialog';
import useConfigPage from '../../store/configPage';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MenuTV() {
  const [value, setValue] = React.useState(0);
  const tariff = useStore(state => state.user.tariff);
  const [openDialogTariff, setOpenDialogTariff] = React.useState(false);
  const configCabinet = useConfigPage(state => state.configCabinet);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleDownload = async () => {
    try {
      const response = await fetch('https://cabinet-host.biz.ua/binary-files/opticomplus.apk', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/vnd.android.package-archive',
          'Content-Type': 'application/vnd.android.package-archive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Якщо отримали 403, спробуємо відкрити файл у новому вікні
          window.open('https://cabinet-host.biz.ua/binary-files/opticomplus.apk', '_blank');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'opticomplus.apk';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Помилка завантаження:', error);
      // Якщо сталася помилка, спробуємо відкрити файл у новому вікні
      window.open('https://cabinet-host.biz.ua/binary-files/opticomplus.apk', '_blank');
    }
  };

  const InfoBanner = () => (
    <div className="mb-6">
      {!tariff.includes("TV") ? (
        <Alert 
          severity="info" 
          icon={<InfoIcon sx={{ color: '#77cdec' }} />}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: '#ffffff', 
            border: '1px solid #77cdec',
            '& .MuiAlert-icon': {
              color: '#77cdec',
            },
            '& .MuiAlert-message': {
              width: '100%',
            },
            backdropFilter: 'blur(8px)'
          }}
        >
          <AlertTitle sx={{ 
            color: '#77cdec', 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            mb: 2 
          }}>
            Важлива інформація про доступ
          </AlertTitle>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#77cdec] mt-2"></div>
              <Typography className="text-white">
                Opensvit TV доступне тільки для абонентів з активним тарифним планом, що включає телебачення
              </Typography>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#77cdec] mt-2"></div>
              <Typography className="text-white">
                Для активації сервісу зверніться до служби підтримки або оберіть відповідний тарифний план у особистому кабінеті
              </Typography>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <ContactInfoButton />
          </div>
        </Alert>
      ) : null}
    </div>
  );
  
  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(8px)',
      border: '1px solid #77cdec'
    }}>
      <Box sx={{ 
        borderBottom: '1px solid #77cdec',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#77cdec',
            },
          }}
        >
          <Tab
            icon={<TvIcon />}
            label="Veles TV"
            sx={{
              color: 'white',
              '&.Mui-selected': {
                color: '#77cdec',
              },
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
            {...a11yProps(0)}
          />
          {configCabinet.additional.megogo ? (
            <Tab
              icon={<TvIcon />}
              label="MEGOGO"
              sx={{
                color: 'white',
                '&.Mui-selected': {
                  color: '#77cdec',
                },
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
              {...a11yProps(1)}
            />
          ) : null}
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <div className="space-y-4">
          <InfoBanner />
          
          <div className="flex items-center gap-4 flex-wrap p-4 bg-sky-800 rounded-lg shadow-[0_0_15px_rgba(164,222,2,0.3)]">
            <Tooltip title="Для пристроїв Android/Android TV" placement="bottom">
              <Typography className="text-white font-medium">
                Завантажити APK файл  
              </Typography>
            </Tooltip>
            <Button
              onClick={handleDownload}
              startIcon={<BrowserUpdatedIcon />}
              sx={{  
                color: '#77cdec',
                borderColor: '#77cdec',
                '&:hover': {
                  borderColor: '#77cdec',
                  backgroundColor: 'rgba(164, 222, 2, 0.1)',
                  boxShadow: '0 0 15px rgba(164, 222, 2, 0.3)' 
                },
              }}
              variant="outlined"
            >
              Завантажити
            </Button>
          </div>
          
          {[
            {
              title: '1. ЦИФРОВА ЯКІСТЬ СУПУТНИКА',
              content: 'ПОНАД 200 КАНАЛІВ ЦИФРОВОЇ ЯКОСТІ: КІНО, СПОРТ, НАУКА, МУЛЬТФІЛЬМИ, HD ТА БАГАТО ІНШОГО!',
            },
            {
              title: '2. ПЕРСОНАЛЬНИЙ ТЕЛЕ-ЕФІР',
              content: 'ПЕРЕГЛЯДАЙТЕ ТЕЛЕПЕРЕДАЧІ, ЩО ПРОПУСТИЛИ ЗА ТИЖДЕНЬ У БУДЬ-ЯКИЙ ЧАС!',
            },
            {
              title: '3. БАТЬКІВСЬКИЙ КОНТРОЛЬ',
              content: 'БЛОКУЙТЕ ДІТЯМ ДОСТУП ДО ПЕРЕГЛЯДУ НЕБАЖАНОГО КОНТЕНТУ',
            },
            {
              title: '4. ПАУЗА ПРЯМОГО ЕФІРУ',
              content: 'ПРИЗУПИНЯЙТЕ ПРЯМИЙ ЕФІР ТА ПРОДОВЖУЙТЕ ПЕРЕГЛЯД КОЛИ ЗАБАЖАЄТЕ',
            },
            {
              title: '5. НАЙКРАЩИЙ КОНТЕНТ',
              content: 'СТВОРЮЙТЕ ВЛАСНИЙ СПИСОК УЛЮБЛЕНИХ КАНАЛІВ', 
            },
            {
              title: '6. ДОДАТОК ДО ПРИСТРОЇВ',
              content: 'ЗАВАНТАЖУЙ МОБІЛЬНИЙ ДОДАТОК НА СВІЙ ТЕЛЕФОН АБО ВАШ ТЕЛЕВІЗОР В 2 КЛІКИ',
            },
          ].map((item, index) => (
            <Accordion
              key={index}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                color: '#ffffff',
                borderRadius: '8px !important',
                marginBottom: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '8px 0',
                },
                borderColor: '#77cdec',
                border: '1px solid'
              }}
            >
              <AccordionSummary
                expandIcon={<SettingsIcon sx={{ color: '#77cdec' }} />}
                sx={{
                  '&.Mui-expanded': {
                    backgroundColor: 'sky-800',
                    borderRadius: '8px 8px 0 0',
                  },
                }}
              >
                <Typography className="font-bold text-white">
                  {item.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
                <Typography className="text-sm text-white">
                  {item.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </CustomTabPanel>
      
      {configCabinet.additional.megogo ? (
        <CustomTabPanel value={value} index={1}>
          <div className="space-y-4">
            {[
              {
                title: 'Питання 1',  
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
              },
              {
                title: 'Питання 2',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
              },
            ].map((item, index) => (
              <Accordion
                key={index}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  color: '#ffffff',
                  borderRadius: '8px !important',
                  marginBottom: '8px',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: '8px 0',
                  },
                  border: '1px solid #77cdec'
                }}
              >
                <AccordionSummary
                  expandIcon={<SettingsIcon sx={{ color: '#77cdec' }} />}
                  sx={{
                    '&.Mui-expanded': {
                      backgroundColor: 'sky-800',
                      borderRadius: '8px 8px 0 0',
                    },
                  }}
                >
                  <Typography className="font-bold text-white">
                    {item.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                  <Typography className="text-sm text-white">
                    {item.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </CustomTabPanel>
      ) : null}
      
      <TariffDialog open={openDialogTariff} handleClose={() => {setOpenDialogTariff(false)}} />
    </Box>
  );
}