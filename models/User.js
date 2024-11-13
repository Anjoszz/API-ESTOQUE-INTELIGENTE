const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,  // Garantir que o nome seja obrigatório
  },
  email: {
    type: String,
    required: true,  // Garantir que o email seja obrigatório
    unique: true,    // Garantir que o email seja único
  },
  senha: {
    type: String,
    required: true,  // Garantir que a senha seja obrigatória
  }
});

module.exports = mongoose.model('User', userSchema);
