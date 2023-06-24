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

router.get('/', async (req, res) => {
    try {
        // Fisher-Yates shuffle algorithm
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

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

        const { data: suggestionThemeData, error: suggestionThemeError } = await supabase
            .from('suggestion_theme')
            .select();

        if (suggestionThemeError) {
            throw new Error(`Error fetching suggestion theme data: ${suggestionThemeError.message}`);
        }

        const suggestionsWithThemes = suggestionData.map(suggestion => {
            const themeIds = suggestionThemeData
                .filter(item => item.suggestionId === suggestion.id)
                .map(item => item.themaId);

            const themes = themeIds.map(themeId => {
                const theme = themeData.find(item => item.id === themeId);
                return theme ? theme.label : null;
            });

            return {
                ...suggestion,
                themes: themes
            };
        });

        const themeLabels = themeData.map(theme => theme.label);

        const shuffledWishes = shuffleArray(suggestionsWithThemes);

        res.render('main', { layout: 'index', title: 'Home', wishes: shuffledWishes, themes: themeLabels });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
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

        res.render('form', { layout: 'index', title: 'Wens toevoegen', themes: themeLabels, wishes: suggestionData });
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

        const themes = Array.isArray(req.body.theme) ? req.body.theme : [req.body.theme]; // Als er meerdere thema's zijn geselecteerd wordt er een array gemaakt, anders wordt er een array gemaakt met 1 thema
        const themeInsertPromises = themes.map(async (theme) => { // Voor elk thema wordt er een insert query gemaakt
            const { error: themeError } = await supabase
                .from('suggestion_theme')
                .insert([{
                    suggestionId: insertId,
                    themaId: theme
                }]);
            if (themeError) {
                throw themeError;
            }
        });

        await Promise.all(themeInsertPromises); // De thema's worden toegevoegd aan de suggestion_theme tabel

        res.render('wish', { layout: 'index', message: 'Wens succesvol toegevoegd', wish: { title: req.body.title, description: req.body.description, image: req.body.imageLink } });
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van de wens' });
        console.log(error);
        return;
    }
});

router.get('/wens/:id/:title', async (req, res) => {
    const { id, title } = req.params;

    // Fetch the data from Supabase using the id and title
    const { data, error } = await supabase
        .from('suggestion')
        .select()
        .eq('id', id)
        .eq('title', title);

    if (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }

    const { data: suggestionThemeData, error: suggestionThemeError } = await supabase
        .from('suggestion_theme')
        .select()
        .eq('suggestionId', id);

    // console.log(suggestionThemeData);

    const themes = await Promise.all(suggestionThemeData.map(async (item) => {
        const { data: themeData, error: themeError } = await supabase
            .from('theme')
            .select()
            .eq('id', item.themaId);

        if (themeError) {
            throw new Error(`Error fetching theme data: ${themeError.message}`);
        }

        const themeLabels = themeData.map(theme => theme.label);

        return themeLabels;
    }));

    if (suggestionThemeError) {
        throw new Error(`Error fetching suggestion theme data: ${suggestionThemeError.message}`);
    }

    res.render('wish', { layout: 'index', wish: data[0], themes: themes });
});

export { router }