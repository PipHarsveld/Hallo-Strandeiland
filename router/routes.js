import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { validationResult, body } from 'express-validator';

dotenv.config(); // Load variables from .env file

// Create a Supabase client
const supabase = createClient(
    'https://yyufywjwwwmgfjmenluv.supabase.co/',
    `${process.env.API_KEY}`
);

// Create an Express router
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fisher-Yates shuffle algorithm to shuffle the order of the wishes
        function shuffleArray(array) {
            // Loop over the array
            for (let i = array.length - 1; i > 0; i--) {
                // Pick a random index
                const j = Math.floor(Math.random() * (i + 1));
                // Swap the current item with the random item
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Fetch the themes from Supabase
        const { data: themeData, error: themeError } = await supabase
            .from('theme')
            .select();

        if (themeError) {
            throw new Error(`Error fetching theme data: ${themeError.message}`);
        }

        // Fetch the wishes from Supabase
        const { data: suggestionData, error: suggestionError } = await supabase
            .from('suggestion')
            .select();

        if (suggestionError) {
            throw new Error(`Error fetching suggestion data: ${suggestionError.message}`);
        }

        // Fetch the suggestion themes from Supabase
        const { data: suggestionThemeData, error: suggestionThemeError } = await supabase
            .from('suggestion_theme')
            .select();

        if (suggestionThemeError) {
            throw new Error(`Error fetching suggestion theme data: ${suggestionThemeError.message}`);
        }

        // Map the suggestionData to add the themes to the suggestions
        const suggestionsWithThemes = suggestionData.map(suggestion => {
            // Get the themeIds for the current suggestion
            const themeIds = suggestionThemeData
                .filter(item => item.suggestionId === suggestion.id)
                .map(item => item.themeId);

            // Get which themes belong to the suggestion
            const themes = themeIds.map(themeId => {
                // Find the theme that matches the themeId
                const theme = themeData.find(item => item.id === themeId);
                return theme ? theme.label : null;
            });

            // Return the suggestion with the themes
            return {
                ...suggestion,
                themes: themes
            };
        });

        // Map the themeData to get only the labels
        const themeLabels = themeData.map(theme => theme.label);

        // Shuffle the array with wishes so the order is random
        const shuffledWishes = shuffleArray(suggestionsWithThemes);

        // Render the main page with the shuffled wishes and the list of themes (for the filter)
        res.render('main', { layout: 'index', title: 'Home', wishes: shuffledWishes, themes: themeLabels });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }


});

// WISH FORM PAGE
router.get('/wens-toevoegen', async (req, res) => {
    try {
        // Fetch the themes from Supabase
        const { data: themeData, error: themeError } = await supabase
            .from('theme')
            .select();

        // Throw an error if something went wrong
        if (themeError) {
            throw new Error(`Error fetching theme data: ${themeError.message}`);
        }

        // Fetch the wishes from Supabase
        const { data: suggestionData, error: suggestionError } = await supabase
            .from('suggestion')
            .select();

        // Throw an error if something went wrong
        if (suggestionError) {
            throw new Error(`Error fetching suggestion data: ${suggestionError.message}`);
        }

        // Map the theme data to an array of theme labels
        const themeLabels = themeData.map(theme => theme.label);

        res.render('form', { layout: 'index', title: 'Wens toevoegen', themes: themeLabels, wishes: suggestionData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// ADD WISH
router.post('/wens', async (req, res) => {
    try {
        // The wish will be added to the suggestion table
        const { data, error } = await supabase
            .from('suggestion')
            .insert([{ title: req.body.title, description: req.body.description, image: req.body.imageLink }])
            .select();

        const insertId = data[0].id ?? null; // An array is returned, but we only want the id of the first entry (which we just added) thanks to Maijla's help

        if (error || !insertId) {
            throw error;  // If there is an error, or if there is no insertId an error is thrown
        }

        const themes = Array.isArray(req.body.theme) ? req.body.theme : [req.body.theme]; // If multiple themes are selected an array is created, otherwise an array is created with 1 theme

        const themeInsertPromises = themes.map(async (theme) => { // An insert query is created for each theme
            // The theme is added to the suggestion_theme table
            const { error: themeError } = await supabase
                .from('suggestion_theme')
                .insert([{
                    suggestionId: insertId,
                    themeId: theme
                }]);

            // Throw an error if something went wrong
            if (themeError) {
                throw themeError;
            }
        });

        await Promise.all(themeInsertPromises); // The themes are added to the suggestion_theme table

        res.render('wish', { layout: 'index', message: 'Je wens is succesvol toegevoegd', wish: { title: req.body.title, description: req.body.description, image: req.body.imageLink } });
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van de wens' }); // If something went wrong an error is returned
        return;
    }
});

// DETAIL WISH PAGE
router.get('/wens/:id/:title', async (req, res) => {
    const { id, title } = req.params; // Get the id and title from the request parameters

    // Fetch the data from Supabase using the id and title
    const { data, error } = await supabase
        .from('suggestion')
        .select()
        .eq('id', id)
        .eq('title', title);

    // Throw an error if something went wrong
    if (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }

    // Fetch the themes from Supabase using the id
    const { data: suggestionThemeData, error: suggestionThemeError } = await supabase
        .from('suggestion_theme')
        .select()
        .eq('suggestionId', id);

    // Promise.all is used to wait for all promises to resolve
    const themes = await Promise.all(suggestionThemeData.map(async (item) => {
        // Fetch the theme data from Supabase using the theme id
        const { data: themeData, error: themeError } = await supabase
            .from('theme')
            .select()
            .eq('id', item.themeId);

        // Throw an error if something went wrong
        if (themeError) {
            throw new Error(`Error fetching theme data: ${themeError.message}`);
        }

        const themeLabels = themeData.map(theme => theme.label); // Map the theme data to an array of theme labels

        return themeLabels;
    }));

    // Throw an error if something went wrong
    if (suggestionThemeError) {
        throw new Error(`Error fetching suggestion theme data: ${suggestionThemeError.message}`);
    }

    res.render('wish', { layout: 'index', wish: data[0], themes: themes });
});

// PERSON PAGE
router.get('/persoon', (req, res) => {
    res.render('person', { layout: 'index', title: 'Persoon' });
});

export { router }