import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.render('form', { layout: 'index', title: 'Home' });
});

export { router }