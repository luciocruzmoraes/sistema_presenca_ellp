const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});