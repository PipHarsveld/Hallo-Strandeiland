import express from 'express';
import dotenv from 'dotenv';
import wensen from '../data/wensen.js';
import themeFilters from '../data/themes.js';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {

    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledWensen = shuffleArray(wensen);
    res.render('main', { layout: 'index', title: 'Home', wensen: shuffledWensen, themeFilters});
});

router.get('/wens', (req, res) => {
    res.render('wish', { layout: 'index', title: 'Wish' });
});

export { router }