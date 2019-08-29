const express = require('express');
require('dotenv').config();
require('./db/mongoose');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(process.env.PORT);