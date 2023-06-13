import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.render('main', { layout: 'index', title: 'Home' });
});

router.get('/wens-toevoegen', (req, res) => {
    res.render('form', { layout: 'index', title: 'Wens toevoegen' });
});

export { router }