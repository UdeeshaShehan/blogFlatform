const express = require('express');
const morgan = require('morgan');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const cookieParse = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');

//app

const app = express();

//connect to mongodb 

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('connect to mongodb');
});

//middle wares
app.use(morgan('dev'));
app.use(bodyParse.json());
app.use(cookieParse());

//cors
if(process.env.NODE_ENV === 'development') {
    app.use(cors({origin: process.env.CLIENT_URL}));
}

//route middle ware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);

/*
app.get('/api', (req, res) => {
    res.json({time: Date().toString()});
});
*/

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
