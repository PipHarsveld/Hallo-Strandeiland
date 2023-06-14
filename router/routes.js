import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import { validationResult, body } from 'express-validator';

dotenv.config();

const router = express.Router();
const supabase = createClient(
    'https://yyufywjwwwmgfjmenluv.supabase.co/rest/v1/',
    `${process.env.API_KEY}`
);

router.get('/', (req, res) => {
    res.render('main', { layout: 'index', title: 'Home' });
});

router.get('/wens-toevoegen', async (req, res) => {
    res.render('form', { layout: 'index', title: 'Wens toevoegen' });
});

router.post('/wens-toevoegen', [
    body('title').notEmpty().withMessage('Voeg alsjeblieft een titel voor je wens toe.'),
    body('description').notEmpty().withMessage('Voeg alsjeblieft een uitleg over je wens toe.'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.render('form', {
            layout: 'index',
            title: 'Wens toevoegen',
            errors: errorMessages,
            formData: req.body
        });
    }

    // Verwerk het formulier als er geen validatiefouten zijn
    // ...

    return res.render('success', {
        layout: 'index',
        title: 'Wens toevoegen',
        message: 'Formulier succesvol verstuurd.'
    });
});



export { router }