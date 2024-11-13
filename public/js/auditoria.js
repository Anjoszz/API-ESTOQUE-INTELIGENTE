document.addEventListener('DOMContentLoaded', () => {
    const auditList = document.getElementById('auditoria-list');

    // Função para exibir os registros de auditoria
    function fetchAuditLogs() {
        fetch('/auditoria') // A URL onde os logs de auditoria são armazenados no seu servidor
            .then(response => response.json())
            .then(logs => {
                auditList.innerHTML = '';
                if (logs.length === 0) {
                    auditList.innerHTML = '<li><strong>Sem registros de auditoria.</strong></li>';
                } else {
                    logs.forEach(log => {
                        const li = document.createElement('li');
                        li.textContent = `${log.timestamp} - Ação: ${log.action} - Produto: ${log.produto.nome}`;
                        auditList.appendChild(li);
                    });
                }
            })
            .catch(err => console.error('Erro ao buscar registros de auditoria:', err));
    }

    // Carregar os registros de auditoria ao carregar a página
    fetchAuditLogs();
});
