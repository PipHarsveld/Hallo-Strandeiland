import express from 'express';
import dotenv from 'dotenv';
import { shuffledWensen } from '../public/scripts/script.js';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    console.log(shuffledWensen);
    res.render('main', { layout: 'index', title: 'Home', wensen: shuffledWensen });
});

export { router }