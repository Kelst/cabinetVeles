const express = require('express');
const path = require('path');

const app = express();
const port = 5006; // Вказуйте порт, на якому хочете запустити сервер

// Статичні файли зі скомпільованого Vite проекту
app.use(express.static(path.join(__dirname, '../dist')));

// Всі запити повертатимуть індексний HTML-файл
app.get("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  })

// Запускаємо сервер
app.listen(5006, '0.0.0.0', () => {
 console.log('Server running on port 5006');
});
