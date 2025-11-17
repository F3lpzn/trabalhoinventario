// Arquivo: script.js

// Variáveis globais para os elementos do DOM
let formProduto;
let selectFornecedores;
let tabelaProdutosCorpo; 

// Espera o DOM carregar para pegar os elementos
document.addEventListener('DOMContentLoaded', () => {
    formProduto = document.getElementById('form-produto');
    selectFornecedores = document.getElementById('fornecedor_id');
    tabelaProdutosCorpo = document.getElementById('tabela-produtos-corpo'); 

    // Adiciona o listener de envio do formulário
    if (formProduto) {
        formProduto.addEventListener('submit', cadastrarProduto);
    }
    
    // Adiciona o listener para cliques na tabela (editar/excluir)
    if (tabelaProdutosCorpo) {
        tabelaProdutosCorpo.addEventListener('click', aoClicarNaTabela);
    }
});

// Verifica o status da autenticação
// Usa 'window.supabaseClient' (definido no client.js)
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (!session) {
        // Se não houver sessão (usuário não logado), redireciona para login
        window.location.href = 'login.html';
    } else {
        // Se estiver logado, carrega os dados
        console.log('Usuário logado:', session.user.email);
        carregarFornecedores();
        carregarProdutos(); 
    }
});


// Carrega os fornecedores para o <select>
async function carregarFornecedores() {
    // Usa o cliente Supabase em vez de fetch
    const { data: fornecedores, error } = await window.supabaseClient
        .from('fornecedores')
        .select('*');

    if (error) {
        console.error('Erro ao buscar fornecedores:', error);
    } else {
        selectFornecedores.innerHTML = '<option value="" disabled selected>Selecione um fornecedor</option>';
        fornecedores.forEach((fornecedor) => {
            const option = document.createElement('option');
            option.value = fornecedor.id; 
            option.textContent = fornecedor.nome_fornecedor; 
            selectFornecedores.appendChild(option);
        });
    }
}

// Cadastra um novo produto no banco
async function cadastrarProduto(evento) {
    evento.preventDefault(); // Impede o recarregamento da página

    // Pega os dados do formulário
    const dadosProduto = {
        nome_produto: document.getElementById('nome_produto').value,
        sku: document.getElementById('sku').value,
        preco_custo: document.getElementById('preco_custo').value,
        preco_venda: document.getElementById('preco_venda').value,
        quantidade_estoque: document.getElementById('quantidade_estoque').value,
        fornecedor_id: document.getElementById('fornecedor_id').value 
    };

    // Usa o cliente Supabase para inserir
    const { data, error } = await window.supabaseClient
        .from('produtos')
        .insert([dadosProduto]); // .insert() espera um array de objetos

    if (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert(`Erro ao cadastrar: ${error.message}`);
    } else {
        alert('Produto cadastrado com sucesso!');
        formProduto.reset(); // Limpa o formulário
        carregarProdutos(); // Recarrega a lista de produtos
    }
}


// Carrega a lista de produtos na tabela
async function carregarProdutos() {
    // Usa o cliente Supabase para buscar os dados
    const { data: produtos, error } = await window.supabaseClient
        .from('produtos')
        .select('*')
        .order('id', { ascending: false }); // Ordena pelos mais recentes

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return;
    }
    
    // Limpa a tabela antes de adicionar os novos dados
    tabelaProdutosCorpo.innerHTML = '';

    // Cria as linhas da tabela para cada produto
    produtos.forEach((produto) => {
        const tr = document.createElement('tr');
        
        // Formata o preço para Reais (BRL)
        let precoFormatado = 'N/A';
        if (produto.preco_venda) {
            precoFormatado = parseFloat(produto.preco_venda).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        }

        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${produto.nome_produto}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${produto.sku}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${produto.quantidade_estoque}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${precoFormatado}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${produto.id}" class="botao-editar text-indigo-600 hover:text-indigo-900">Editar</button>
                <button data-id="${produto.id}" class="botao-excluir text-red-600 hover:text-red-900 ml-4">Excluir</button>
            </td>
        `;
        
        tabelaProdutosCorpo.appendChild(tr);
    });
}


// Lida com cliques nos botões de editar ou excluir
function aoClicarNaTabela(evento) {
    const elementoClicado = evento.target; 

    // Verifica se o clique foi no botão excluir
    if (elementoClicado.classList.contains('botao-excluir')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            excluirProduto(idProduto);
        }
    }
    
    // Verifica se o clique foi no botão editar
    if (elementoClicado.classList.contains('botao-editar')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        alert('Função de editar para o ID ' + idProduto + ' ainda não implementada.');
    }
}


// Exclui um produto do banco
async function excluirProduto(id) {
    // Usa o cliente Supabase para deletar
    const { data, error } = await window.supabaseClient
        .from('produtos')
        .delete()
        .eq('id', id); // Filtra pelo 'id' que queremos excluir

    if (error) {
        console.error('Erro ao excluir produto:', error);
        alert(`Erro ao excluir: ${error.message}`);
    } else {
        alert('Produto excluído com sucesso!');
        carregarProdutos(); // Recarrega a lista
    }
}