const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routers//index');
const cookieParser = require('cookie-parser');
const { app, server } = require('./socket/index');

// const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({ message: 'Server running on port ' + PORT });
});

// API endpoints
app.use('/api', router);

connectDB().then(() => {
    // app.listen(PORT, () => {
    //     console.log('Server running on', PORT);
    // });
    server.listen(PORT, () => {
        console.log('Server running on ', PORT);
    });
});
