import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import handlebars from 'express-handlebars';
import { router } from './router/routes.js';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(
    'https://yyufywjwwwmgfjmenluv.supabase.co/rest/v1/',
    `${process.env.API_KEY}`
);
const app = express();
const port = process.env.PORT || 4400;
const __dirname = path.resolve();

app.set('view engine', 'hbs');
app.set('views', 'views')

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=' + 60 * 60 * 24 * 365);
    next();
});
app.use(express.static(__dirname + '/static')); // Hier zit bijvoorbeeld css in
app.use('/', express.static(__dirname + '/'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: __dirname + '/views/partials',
}));

app.get('/thema', async (req, res) => {
    const { data, error } = await supabase
        .from('thema')
        .select()
    res.send(data);
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 