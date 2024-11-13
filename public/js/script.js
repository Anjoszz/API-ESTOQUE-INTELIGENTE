document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const totalPriceElement = document.getElementById('total-price'); // Referência ao elemento de total
    let editingProductId = null; // Para armazenar o ID do produto que está sendo editado
    const userList = document.getElementById('user-list');
    const userForm = document.getElementById('user-form');

    // Função para exibir todos os produtos e calcular o total
    function fetchProducts() {
        fetch('/produtos')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '';
                let total = 0; // Variável para somar os preços dos produtos
                products.forEach(product => {
                    const li = document.createElement('li');
                    li.innerHTML = `${product.nome} - ${product.descricao} - R$${product.preco.toFixed(2)}
                        <button class="edit-btn" data-id="${product._id}">Editar</button>
                        <button class="delete-btn" data-id="${product._id}">Remover</button>`;
                    productList.appendChild(li);
                    total += product.preco; // Somando o preço do produto ao total
                });

                // Atualiza o total de produtos na página
                if (totalPriceElement) {
                    totalPriceElement.textContent = total.toFixed(2);
                }

                // Adiciona o evento de clique nos botões de editar
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = button.getAttribute('data-id');
                        const product = products.find(p => p._id === productId);
                        if (product) {
                            editProduct(product._id, product.nome, product.descricao, product.preco);
                        }
                    });
                });

                // Adiciona o evento de clique nos botões de remover
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = button.getAttribute('data-id');
                        removeProduct(productId);
                    });
                });
            })
            .catch(err => console.error('Erro ao buscar produtos:', err));
    }

    // Função para editar um produto
    function editProduct(id, nome, descricao, preco) {
        editingProductId = id;
        document.getElementById('nome-produto').value = nome;
        document.getElementById('descricao-produto').value = descricao;
        document.getElementById('preco-produto').value = preco;
        document.querySelector('button[type="submit"]').textContent = 'Atualizar Produto'; // Muda o texto do botão
    }

    // Função para remover um produto
    function removeProduct(id) {
        const confirmDelete = confirm('Você tem certeza que deseja remover este produto?');
        if (confirmDelete) {
            fetch(`/produtos/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        alert('Produto removido com sucesso!');
                        fetchProducts(); // Atualiza a lista de produtos após a remoção
                    } else {
                        alert('Erro ao remover produto.');
                    }
                })
                .catch(err => console.error('Erro ao remover produto:', err));
        }
    }

    // Submeter formulário de produto (cadastrar ou atualizar)
    if (productForm) {
        productForm.addEventListener('submit', event => {
            event.preventDefault();
            const nome = document.getElementById('nome-produto').value;
            const descricao = document.getElementById('descricao-produto').value;
            const preco = parseFloat(document.getElementById('preco-produto').value);

            if (editingProductId) {
                // Atualizar produto existente
                fetch(`/produtos/${editingProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, descricao, preco })
                })
                    .then(response => response.json())
                    .then(() => {
                        alert('Produto atualizado com sucesso!');
                        productForm.reset();
                        editingProductId = null;
                        document.querySelector('button[type="submit"]').textContent = 'Cadastrar Produto';
                        fetchProducts(); // Atualiza lista e total de produtos
                    })
                    .catch(err => console.error('Erro ao atualizar produto:', err));
            } else {
                // Cadastrar novo produto
                fetch('/produtos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, descricao, preco })
                })
                    .then(response => response.json())
                    .then(() => {
                        alert('Produto cadastrado com sucesso!');
                        productForm.reset();
                        fetchProducts(); // Atualiza lista e total de produtos
                    })
                    .catch(err => console.error('Erro ao cadastrar produto:', err));
            }
        });
    }

    // Buscar produtos ao carregar a página
    fetchProducts();

    // Função para exibir todos os usuários
    function fetchUsers() {
        fetch('/usuarios')
            .then(response => response.json())
            .then(users => {
                userList.innerHTML = ''; // Limpa a lista
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.innerHTML = `${user.nome} - ${user.email}`;
                    userList.appendChild(li);
                });
            })
            .catch(err => console.error('Erro ao buscar usuários:', err));
    }

    // Submeter formulário de usuário (cadastrar)
    if (userForm) {
        userForm.addEventListener('submit', event => {
            event.preventDefault();

            const nome = document.getElementById('nome-usuario').value;
            const email = document.getElementById('email-usuario').value;
            const senha = document.getElementById('senha-usuario').value;

            fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    userForm.reset();
                    fetchUsers(); // Atualiza a lista de usuários
                })
                .catch(err => console.error('Erro ao registrar usuário:', err));
        });
    }

    // Buscar usuários ao carregar a página
    fetchUsers();
});
