import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import handlebars from 'express-handlebars';
import { router } from './router/routes.js';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { validationResult, body } from 'express-validator';

dotenv.config();

const supabase = createClient(
    'https://yyufywjwwwmgfjmenluv.supabase.co/',
    `${process.env.API_KEY}`
);
const app = express();
const port = process.env.PORT || 4400;
const __dirname = path.resolve();

app.set('view engine', 'hbs');
app.set('views', 'views');

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=' + 60 * 60 * 24 * 365);
    next();
});
app.use(express.static(__dirname + '/static'));
app.use('/', express.static(__dirname + '/'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        incrementIndex: function (index) {
            return index + 1;
        },
        length: function(array) {
            return array.length;
        }
    }
}));

app.use('/', router);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 