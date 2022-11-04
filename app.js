const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv/config')

mongoose.connect(process.env.DB_CONNECTION)
const db = mongoose.connection;
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const routes = require('./routes/routes')
app.use('/api', routes)

app.get('/', (req,res) => {
    res.send("We are on home");
})

app.listen(3000);