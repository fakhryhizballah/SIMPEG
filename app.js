require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const app = express();
const path = require('path');


const http = require('http');
const server = http.createServer(app);
const morgan = require('morgan');
const MORGAN_FORMAT = process.env.MORGAN_FORMAT || 'dev';
app.use(morgan(MORGAN_FORMAT));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser())


app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname + '/public/', 'favicon.ico')));
app.use("/asset/js/", express.static(path.join(__dirname + '/public/js/')));
app.use("/asset/img/", express.static(path.join(__dirname + '/public/img/')));
app.use("/asset/css/", express.static(path.join(__dirname + '/public/css/')));

const routes = require('./routes');
app.use('/', routes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});