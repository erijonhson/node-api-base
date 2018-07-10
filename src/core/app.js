const bodyParser   = require('body-parser');
const express      = require('express');
const logger       = require('morgan');
const cors         = require('cors');
const helmet       = require('helmet');
const compress     = require('compression');
const i18n         = require('i18n');
const http         = require('http');

let app = express();

const server = http.createServer(app);

app.use(logger('dev'));

var corsOptions = null;

if (process.env.NODE_ENV !== 'production') {
  corsOptions = {
    origin: '*',
    allowedHeaders: ['Accept-Version', 'Access-Control-Expose-Headers', 'Authorization', 'Credentials', 'Content-Type'],
    exposedHeaders: ['Authorization', 'X-Request-Id', 'X-Pagination-Total-Count', 'X-Pagination-Per-Page', 'X-Pagination-Current-Page', 'X-Pagination-Page-Count'],
  };
}

// Enable CORS, security, compression and body parsing
app.use(cors(corsOptions));
app.use(helmet());
app.use(compress());

// Parses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Host the public folder
app.use('/', express.static(__dirname + '/../public'));
app.use('/swagger-ui.html', express.static(__dirname + '/api-docs'));

// Add i18n module
i18n.configure({
  locales:['en', 'pt-BR'],
  defaultLocale: 'pt-BR',
  cookie: 'lang',
  directory: __dirname + '/../locales',
  register: global
});
app.use(i18n.init);

require('./swagger')(app);
const io = require('./io')(server);
require('./routes')(app, io);

module.exports = server;
