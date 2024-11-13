const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true }
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
