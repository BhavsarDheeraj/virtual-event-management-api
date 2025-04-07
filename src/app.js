const express = require('express');
const cors = require('cors');
const usersRoute = require('./routes/usersRoute');
const eventsRoute = require('./routes/eventsRoute');


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1/users', usersRoute);
app.use('/api/v1/events', eventsRoute);

module.exports = app;