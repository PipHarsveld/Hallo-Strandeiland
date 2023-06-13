import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.render('main', { layout: 'index', title: 'Home' });
});

router.get('/wens', (req, res) => {
    res.render('wish', { layout: 'index', title: 'Wish' });
});

export { router }