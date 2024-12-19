import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ErrorIcon from '@mui/icons-material/Error';
import RouterIcon from '@mui/icons-material/Router';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublicIcon from '@mui/icons-material/Public';
import InfoIcon from '@mui/icons-material/Info';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';

// Функція для отримання всіх можливих IP адрес
const getAllIPs = () => {
  return new Promise((resolve) => {
    const ips = {
      public: null,
      local: new Set(),
      gray: new Set()
    };

    // Масив STUN серверів для кращого виявлення
    const stunServers = [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun.stunprotocol.org:3478'
    ];

    const RTCPeerConnection = window.RTCPeerConnection || 
                            window.webkitRTCPeerConnection || 
                            window.mozRTCPeerConnection;

    if (!RTCPeerConnection) {
      resolve(ips);
      return;
    }

    // Створюємо кілька підключень для кращого виявлення
    const pcs = stunServers.map(server => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: server }]
      });
      
      pc.createDataChannel('');
      
      pc.onicecandidate = (e) => {
        if (!e.candidate) return;

        const candidateStr = e.candidate.candidate;
        if (!candidateStr) return;

        // Шукаємо IPv4 адреси
        const ipv4Matches = candidateStr.match(
          /([0-9]{1,3}(\.[0-9]{1,3}){3})/g
        );

        if (ipv4Matches) {
          ipv4Matches.forEach(ip => {
            // Перевіряємо чи це локальна мережа
            if (
              ip.startsWith('192.168.') || 
              ip.startsWith('10.') || 
              ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
            ) {
              ips.local.add(ip);
            } else if (
              !ip.startsWith('0.') && 
              !ip.startsWith('127.') && 
              !ip.endsWith('.1') && 
              !ip.endsWith('.255')
            ) {
              // Якщо це не локальна і не спеціальна адреса - можливо це сіра IP
              ips.gray.add(ip);
            }
          });
        }
      };

      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => {});

      return pc;
    });

    // Отримуємо публічну IP через API
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        ips.public = data.ip;
      })
      .catch(() => {
        // Якщо не вдалося отримати публічну IP, спробуємо альтернативні сервіси
        return fetch('https://ip.seeip.org/json')
          .then(response => response.json())
          .then(data => {
            ips.public = data.ip;
          })
          .catch(() => {
            // Якщо і це не вдалося, спробуємо ще один сервіс
            return fetch('https://api.db-ip.com/v2/free/self')
              .then(response => response.json())
              .then(data => {
                ips.public = data.ipAddress;
              });
          });
      })
      .finally(() => {
        // Через 3 секунди закриваємо всі з'єднання і повертаємо результат
        setTimeout(() => {
          pcs.forEach(pc => pc.close());
          resolve({
            public: ips.public,
            local: Array.from(ips.local),
            gray: Array.from(ips.gray)
          });
        }, 3000);
      });
  });
};

const getDefaultGateway = async () => {
  const commonGateways = [
    '192.168.0.1',
    '192.168.1.1',
    '192.168.2.1',
    '10.0.0.1',
    '10.0.0.138',
    '172.16.0.1'
  ];

  const promises = commonGateways.map(gateway => 
    new Promise(resolve => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.src = '';
        resolve(false);
      }, 500);

      img.onload = img.onerror = () => {
        clearTimeout(timeout);
        resolve(gateway);
      };
      
      img.src = `http://${gateway}/favicon.ico?${Date.now()}`;
    })
  );

  const results = await Promise.all(promises);
  const detected = results.find(result => result !== false);
  return detected || 'Не визначено';
};

const NetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState({
    publicIP: null,
    localIPs: [],
    grayIPs: [],
    defaultGateway: null,
    connectionType: null,
    downlink: null,
    effectiveType: null,
    signalStrength: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshNetworkInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ipInfo, gateway] = await Promise.all([
        getAllIPs(),
        getDefaultGateway()
      ]);

      const connection = navigator.connection || 
                        navigator.mozConnection || 
                        navigator.webkitConnection;

      setNetworkInfo({
        publicIP: ipInfo.public,
        localIPs: ipInfo.local,
        grayIPs: ipInfo.gray,
        defaultGateway: gateway,
        connectionType: connection?.type || 'Недоступно',
        downlink: connection?.downlink || 'Недоступно',
        effectiveType: connection?.effectiveType || 'Недоступно',
        signalStrength: connection?.signalStrength || 'Недоступно',
      });
    } catch (err) {
      setError('Помилка отримання мережевої інформації: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshNetworkInfo();

    const handleConnectionChange = () => {
      refreshNetworkInfo();
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <NetworkCheckIcon color="primary" />
            <Typography variant="h6">
              Інформація про мережу
            </Typography>
          </Box>
          <Button 
            startIcon={<RefreshIcon />}
            onClick={refreshNetworkInfo}
            disabled={loading}
            variant="outlined"
            size="small"
          >
            Оновити
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" icon={<ErrorIcon />}>
            {error}
          </Alert>
        ) : (
          <Box>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Параметр</TableCell>
                    <TableCell>Значення</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {networkInfo.publicIP && (
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PublicIcon fontSize="small" />
                          Публічна IP-адреса
                        </Box>
                      </TableCell>
                      <TableCell>{networkInfo.publicIP}</TableCell>
                    </TableRow>
                  )}
                  
                  {networkInfo.grayIPs.length > 0 && (
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <NetworkWifiIcon fontSize="small" />
                          Сіра IP-адреса
                        </Box>
                      </TableCell>
                      <TableCell>
                        {networkInfo.grayIPs.map((ip, index) => (
                          <div key={index}>{ip}</div>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}

                  {networkInfo.localIPs.length > 0 && (
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <RouterIcon fontSize="small" />
                          Локальна IP-адреса
                        </Box>
                      </TableCell>
                      <TableCell>
                        {networkInfo.localIPs.map((ip, index) => (
                          <div key={index}>{ip}</div>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <RouterIcon fontSize="small" />
                        IP-адреса роутера
                      </Box>
                    </TableCell>
                    <TableCell>{networkInfo.defaultGateway}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <WifiIcon fontSize="small" />
                        Тип підключення
                      </Box>
                    </TableCell>
                    <TableCell>{networkInfo.connectionType}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Швидкість з'єднання</TableCell>
                    <TableCell>
                      {networkInfo.downlink !== 'Недоступно' 
                        ? `${networkInfo.downlink} Mbps` 
                        : networkInfo.downlink}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Тип мережі</TableCell>
                    <TableCell>{networkInfo.effectiveType}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert 
              severity="info"
              icon={<InfoIcon />}
              sx={{ '& .MuiAlert-message': { width: '100%' } }}
            >
              <Typography variant="body2">
                <strong>Знайдено IP-адрес:</strong> {networkInfo.localIPs.length + networkInfo.grayIPs.length}
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkInfo;