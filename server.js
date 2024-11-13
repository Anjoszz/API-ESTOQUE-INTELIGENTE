const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Importação do módulo path
const Produto = require('./models/Produto');
const Usuario = require('./models/User');

const app = express();
app.use(express.json());

// Configuração do Express para servir arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Rota raiz para redirecionar automaticamente para login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://matheusrrb07:Tchola07@projeto.mh9ga.mongodb.net/?retryWrites=true&w=majority&appName=Projeto')
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB Atlas: ' + err));

// Simulação de auditoria em memória
const auditoriaLogs = [];

// Função para registrar auditoria
function adicionarAuditoria(action, produto) {
  const log = {
    action,
    produto,
    timestamp: new Date().toISOString()
  };
  auditoriaLogs.push(log);
}

// Rota para visualizar auditoria
app.get('/auditoria', (req, res) => {
  res.json(auditoriaLogs);
});

// Rota para adicionar produto
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco } = req.body;
  const novoProduto = new Produto({ nome, descricao, preco });
  novoProduto.save()
    .then((produto) => {
      adicionarAuditoria('Adicionado', produto);
      res.status(201).json(produto);
    })
    .catch((err) => res.status(400).json({ error: 'Erro ao adicionar produto' }));
});

// Rota para listar todos os produtos
app.get('/produtos', (req, res) => {
  Produto.find()
    .then((produtos) => res.json(produtos))
    .catch((err) => res.status(500).json({ error: 'Erro ao listar produtos' }));
});

// Rota para atualizar produto
app.put('/produtos/:id', (req, res) => {
  const { nome, descricao, preco } = req.body;
  Produto.findByIdAndUpdate(req.params.id, { nome, descricao, preco }, { new: true })
    .then((produto) => {
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      adicionarAuditoria('Atualizado', produto);
      res.json(produto);
    })
    .catch((err) => res.status(400).json({ error: 'Erro ao atualizar produto' }));
});

// Rota para remover produto
app.delete('/produtos/:id', (req, res) => {
  Produto.findByIdAndDelete(req.params.id)
    .then((produto) => {
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      adicionarAuditoria('Removido', produto);
      res.json({ message: 'Produto removido com sucesso' });
    })
    .catch((err) => res.status(500).json({ error: 'Erro ao remover produto' }));
});

// Rota para calcular o valor total dos produtos em estoque
app.get('/produtos/valorTotal', (req, res) => {
  Produto.aggregate([
    { $group: { _id: null, total: { $sum: { $multiply: ['$preco', 1] } } } }
  ])
    .then((resultado) => {
      const valorTotal = resultado[0] ? resultado[0].total : 0;
      res.json({ valorTotal });
    })
    .catch((err) => res.status(500).json({ error: 'Erro ao calcular o valor total' }));
});

// Rota para listar todos os usuários
app.get('/usuarios', (req, res) => {
  Usuario.find()
    .then((usuarios) => res.json(usuarios))
    .catch((err) => res.status(500).json({ error: 'Erro ao listar usuários' }));
});

// Rota para registrar o usuário
app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;
  const novoUsuario = new Usuario({ nome, email, senha });
  novoUsuario.save()
    .then((usuario) => res.status(201).json({ message: 'Usuário registrado com sucesso!' }))
    .catch((err) => res.status(400).json({ error: 'Erro ao registrar usuário' }));
});

// Rota para login (simulação sem autenticação de token)
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  Usuario.findOne({ email, senha })
    .then((usuario) => {
      if (usuario) {
        res.status(200).json({ message: 'Usuário logado com sucesso' });
      } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'Erro ao realizar login' }));
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
