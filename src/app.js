const express = require('express');
const cors = require('cors');
const usersRoute = require('./routes/usersRoute');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1/users', usersRoute);

module.exports = app;