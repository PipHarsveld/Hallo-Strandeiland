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

app.engine('hbs', handlebars.engine({ // Handlebars configuration
    layoutsDir: __dirname + '/views/layouts', // Layouts directory
    extname: 'hbs', // Extension name
    defaultLayout: 'index', // Default layout
    partialsDir: __dirname + '/views/partials', // Partials directory
    helpers: { // Helpers for handlebars
        incrementIndex: function (index) { // Function to increment index
            return index + 1; // Increment index by 1
        },
        length: function (array) {
            return array.length;
        }
    }
}));

app.use('/', router);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 