const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto'); // Certifique-se de que o modelo de produto está correto

// Cadastrar produto
router.post('/', async (req, res) => {
    const { nome, preco, quantidade } = req.body;
    try {
        const produto = new Produto({ nome, preco, quantidade });
        await produto.save();
        res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
    } catch (err) {
        res.status(400).json({ message: 'Erro ao cadastrar produto.' });
    }
});

// Listar produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar produtos.' });
    }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco, quantidade } = req.body;
    try {
        const produto = await Produto.findByIdAndUpdate(id, { nome, preco, quantidade }, { new: true });
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado.' });
        res.status(200).json({ message: 'Produto atualizado com sucesso!', produto });
    } catch (err) {
        res.status(400).json({ message: 'Erro ao atualizar produto.' });
    }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await Produto.findByIdAndDelete(id);
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado.' });
        res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar produto.' });
    }
});

// Calcular valor total dos produtos
router.get('/valor-total', async (req, res) => {
    try {
        const produtos = await Produto.find();
        const valorTotal = produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
        res.status(200).json({ valorTotal });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao calcular o valor total.' });
    }
});

module.exports = router;
