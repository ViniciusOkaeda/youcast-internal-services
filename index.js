require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')
const app = express();
const port = process.env.PORT;

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://10.10.150.246:3000"],
    methods: ["POST", "GET"],
}));
app.use(cookieParser())
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/routes'))
app.listen(port);
console.log('API funcionando!');
//app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));


{/*
    app.post('/clientes', async (req, res) => {
        const results = await mydb.selectCustomers();
        res.json(results);
    })
    
*/}


//app.post('/clientes', require('./routes/routes.js'));