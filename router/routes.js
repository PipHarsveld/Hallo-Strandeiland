import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { validationResult, body } from 'express-validator';

dotenv.config();

const supabase = createClient(
    'https://yyufywjwwwmgfjmenluv.supabase.co/',
    `${process.env.API_KEY}`
);

const router = express.Router();

router.get('/', (req, res) => {
    res.render('main', { layout: 'index', title: 'Home' });
});

router.get('/wens-toevoegen', async (req, res) => {
    try {
        const { data: themeData, error: themeError } = await supabase
            .from('theme')
            .select();

        if (themeError) {
            throw new Error(`Error fetching theme data: ${themeError.message}`);
        }

        const { data: suggestionData, error: suggestionError } = await supabase
            .from('suggestion')
            .select();

        if (suggestionError) {
            throw new Error(`Error fetching suggestion data: ${suggestionError.message}`);
        }

        const themeLabels = themeData.map(theme => theme.label);
        console.log(themeLabels);

        console.log(suggestionData);

        res.render('form', { layout: 'index', title: 'Wens toevoegen', themes: themeLabels, whises: suggestionData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/wens', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('suggestion')
            .insert([{ title: req.body.title, description: req.body.description, image: req.body.imageLink }])
            .select(); // De wens wordt toegevoegd aan de suggestion tabel

        const insertId = data[0].id ?? null; // Er wordt een array teruggegeven, maar we willen alleen het id van de eerste entry hebben (die we net hebben toegevoegd) met dank aan de hulp van Maijla

        if (error || !insertId) {
            throw error;  // Als er een error is, of als er geen insertId is wordt er een error gegooid
        }

        const { error: themeError } = await supabase
            .from('suggestion_theme')
            .insert([{
                suggestionId: insertId,
                themaId: req.body.theme
            }]); // De thema's worden toegevoegd aan de suggestion_theme tabel

        if (themeError) {
            throw themeError; // Als er een error is wordt er een error gegooid
        }

        res.render('main', { layout: 'index', message: 'Wens succesvol toegevoegd' });
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van de wens' });
        console.log(error);
        return;
    }
});

export { router }