const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Certifique-se de que o modelo de usuário está correto

// Registrar usuário
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        res.status(400).json({ message: 'Erro ao registrar usuário.' });
    }
});

// Fazer login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

module.exports = router;
