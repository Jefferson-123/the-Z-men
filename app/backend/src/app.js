require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./controllers/authController');
// backend/src/app.js (add)
const walletRoutes = require('./controllers/walletController.JS');
app.use('/wallet', walletRoutes);
const bankRoutes = require('./controllers/bankController');app.use('/bank', bankRoutes);
const chartRoutes = require('./controllers/chartController');app.use('/charts', chartRoutes);


const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));


