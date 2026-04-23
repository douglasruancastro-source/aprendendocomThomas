const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3456;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Aprendendo com Thomas rodando na porta ${PORT}`);
});
