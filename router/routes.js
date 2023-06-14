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
        const { data, error } = await supabase
            .from('theme')
            .select();

        if (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }

        const themaLabels = data.map(thema => thema.label);
        console.log(themaLabels);

        // res.render('main', { layout: 'index', title: 'Thema', thema: themaLabels });
        res.render('form', { layout: 'index', title: 'Wens toevoegen', thema: themaLabels });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// router.get('/theme', async (req, res) => {
//     try {
//         const { data, error } = await supabase
//             .from('theme')
//             .select();

//         if (error) {
//             throw new Error(`Error fetching data: ${error.message}`);
//         }

//         const themaLabels = data.map(thema => thema.label);
//         console.log(themaLabels);

//         res.render('main', { layout: 'index', title: 'Thema', thema: themaLabels });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// router.get('/themas', async (req, res) => {
//     const { data, error } = await supabase
//         .from('thema')
//         .select();

//     if (error) {
//         // Handle the error appropriately (e.g., send an error response)
//         console.log(error);
//     }

//     if (data === null) {
//         // Handle the case when data is null (e.g., send an empty array [])
//         res.send(['empty array']);
//     } else {
//         res.send(data);
//     }
// });

router.post('/wens', async (req, res) => {
    // console.log(req.body.description)
    try {
        const { error } = await supabase
            .from('suggestion')
            .insert({ title: req.body.title, description: req.body.description, theme: 1, image: req.body.imageLink });
        if (error) {
            throw error;
        }
        res.status(200).json({ message: 'Wens succesvol toegevoegd' });
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van de wens' });
        return; // Stop de uitvoering hier om dubbele reacties te voorkomen
    }
    // Alleen omleiden als er geen fout is opgetreden
    res.redirect('/wens');
});


// router.post('/wens-toevoegen', [
//     body('title').notEmpty().withMessage('Voeg alsjeblieft een titel voor je wens toe.'),
//     body('description').notEmpty().withMessage('Voeg alsjeblieft een uitleg over je wens toe.'),
// ], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const errorMessages = errors.array().map(error => error.msg);

//         return res.render('form', {
//             layout: 'index',
//             title: 'Wens toevoegen',
//             errors: errorMessages,
//             formData: req.body
//         });
//     }

//     // Verwerk het formulier als er geen validatiefouten zijn
//     // ...

//     return res.render('success', {
//         layout: 'index',
//         title: 'Wens toevoegen',
//         message: 'Formulier succesvol verstuurd.'
//     });
// }); 

// app.get('/thema', async (req, res) => {
//     const { data, error } = await supabase
//         .from('thema')
//         .select();
//     console.log(data);
//     res.send(data);
// });

// function isValidImageUrl(url) {
//     const imageRegex = /^https?:\/\/.*\.(png|jpg|jpeg|gif)(\?.*)?$/i;
//     return imageRegex.test(url);
// }

// app.post('/upload', (req, res) => {
//     const imageLink = req.body.imageLink;
//     console.log(imageLink);

//     if (!isValidImageUrl(imageLink)) {
//         return res.status(400).send('Invalid image URL');
//     }

//     res.redirect('/image?link=' + imageLink);
// });

// app.get('/image', (req, res) => {
//     const imageLink = req.query.link;
//     console.log(imageLink + ' in /image');
//     res.render('image', { imageLink });
// });



export { router }