import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const TelegramBotQRCode = ({ botUsername }) => {
  const telegramBotUrl = `https://t.me/${botUsername}`;

  return (
    <div>
      <h2>Відскануйте QR-код, щоб перейти до нашого Telegram-бота</h2>
      <QRCodeSVG value={telegramBotUrl} size={256} />
    </div>
  );
};

export default TelegramBotQRCode;