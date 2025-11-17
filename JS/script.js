// Arquivo: script.js (Versão Final)

// --- Variáveis Globais ---
let formProduto;
let selectFornecedores;
let tabelaProdutosCorpo;
let h2Form;
let submitButton;
let cancelButton;
let logoutButton;

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // 🚨 Esta variável é crucial para o seu dropdown
    formProduto = document.getElementById('form-produto');
    selectFornecedores = document.getElementById('fornecedor_id');
    tabelaProdutosCorpo = document.getElementById('tabela-produtos-corpo'); 
    
    h2Form = document.getElementById('h2-form-produto');
    submitButton = document.getElementById('botao-submit');
    cancelButton = document.getElementById('botao-cancelar');
    logoutButton = document.getElementById('botao-logout');

    if (formProduto) {
        formProduto.addEventListener('submit', salvarProduto);
    }
    
    if (tabelaProdutosCorpo) {
        tabelaProdutosCorpo.addEventListener('click', aoClicarNaTabela);
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', resetarFormulario);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

// --- Autenticação ---
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (!session) {
        window.location.href = 'login.html';
    } else {
        console.log('Usuário logado:', session.user.email);
        carregarFornecedores(); 
        carregarProdutos(); 
    }
});


// --- Funções de Dados (Supabase) ---

/**
 * Carrega os fornecedores e preenche o dropdown.
 */
async function carregarFornecedores() {
    // RLS DESATIVADO, busca os dados publicamente
    const { data: fornecedores, error } = await window.supabaseClient
        .from('fornecedores')
        .select('*');

    if (error) {
        console.error('Erro ao buscar fornecedores:', error);
        showToast('Erro ao carregar fornecedores.', 'error');
    } else {
        // 🚨 LIMPA O SELECT ANTES DE ADICIONAR
        selectFornecedores.innerHTML = '<option value="" disabled selected>Selecione um fornecedor</option>';
        
        fornecedores.forEach((fornecedor) => {
            const option = document.createElement('option');
            option.value = fornecedor.id; 
            option.textContent = fornecedor.nome_fornecedor; 
            selectFornecedores.appendChild(option);
        });
        
        // Adiciona uma opção de aviso se a lista estiver vazia
        if (fornecedores.length === 0) {
            selectFornecedores.innerHTML = '<option value="" disabled selected>Nenhum fornecedor cadastrado!</option>';
        }
    }
}

/**
 * Salva um Produto (INSERT ou UPDATE).
 */
async function salvarProduto(evento) {
    evento.preventDefault(); 
    const idParaEditar = formProduto.dataset.editId;
    
    // Sem user_id, RLS removido
    const dadosProduto = {
        nome_produto: document.getElementById('nome_produto').value,
        sku: document.getElementById('sku').value,
        preco_custo: parseFloat(document.getElementById('preco_custo').value),
        preco_venda: parseFloat(document.getElementById('preco_venda').value),
        quantidade_estoque: parseInt(document.getElementById('quantidade_estoque').value, 10),
        fornecedor_id: document.getElementById('fornecedor_id').value,
    };

    let error;
    let successMessage = '';

    if (idParaEditar) {
        // MODO UPDATE
        const { error: updateError } = await window.supabaseClient
            .from('produtos')
            .update(dadosProduto)
            .eq('id', idParaEditar);
        error = updateError;
        successMessage = 'Produto atualizado com sucesso!';
    } else {
        // MODO INSERT
        const { error: insertError } = await window.supabaseClient
            .from('produtos')
            .insert([dadosProduto]);
        error = insertError;
        successMessage = 'Produto cadastrado com sucesso!';
    }

    if (error) {
        console.error('Erro ao salvar produto:', error);
        showToast(`Erro ao salvar: ${error.message}`, 'error');
    } else {
        showToast(successMessage, 'success');
        resetarFormulario(); 
        carregarProdutos(); 
    }
}

/**
 * Carrega a lista de produtos na tabela
 */
async function carregarProdutos() {
    const { data: produtos, error } = await window.supabaseClient
        .from('produtos')
        .select('*')
        .order('id', { ascending: false }); 

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        showToast('Erro ao carregar produtos.', 'error');
        return;
    }
    
    tabelaProdutosCorpo.innerHTML = '';
    produtos.forEach((produto) => {
        const tr = document.createElement('tr');
        
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

/**
 * Funções de Edição/Exclusão
 */
async function excluirProduto(id) {
    const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá reverter esta ação!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
        const { data, error } = await window.supabaseClient.from('produtos').delete().eq('id', id); 
        if (error) {
            console.error('Erro ao excluir produto:', error);
            showToast(`Erro ao excluir: ${error.message}`, 'error');
        } else {
            showToast('Produto excluído com sucesso!', 'success');
            carregarProdutos(); 
        }
    }
}

function aoClicarNaTabela(evento) {
    const elementoClicado = evento.target; 
    if (elementoClicado.classList.contains('botao-excluir')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        excluirProduto(idProduto);
    }
    if (elementoClicado.classList.contains('botao-editar')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        carregarDadosParaEdicao(idProduto);
    }
}

async function carregarDadosParaEdicao(id) {
    const { data: produto, error } = await window.supabaseClient.from('produtos').select('*').eq('id', id).single(); 
    if (error) {
        console.error(error);
        showToast('Erro ao carregar dados para edição.', 'error');
        return;
    }
    document.getElementById('nome_produto').value = produto.nome_produto;
    document.getElementById('sku').value = produto.sku;
    document.getElementById('preco_custo').value = produto.preco_custo;
    document.getElementById('preco_venda').value = produto.preco_venda;
    document.getElementById('quantidade_estoque').value = produto.quantidade_estoque;
    document.getElementById('fornecedor_id').value = produto.fornecedor_id;
    formProduto.dataset.editId = id;
    h2Form.textContent = 'Editar Produto';
    submitButton.textContent = 'Salvar Alterações';
    cancelButton.classList.remove('hidden'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetarFormulario() {
    formProduto.reset(); 
    delete formProduto.dataset.editId; 
    h2Form.textContent = 'Cadastrar Novo Produto';
    submitButton.textContent = 'Cadastrar Produto';
    cancelButton.classList.add('hidden'); 
}

async function handleLogout() {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
        showToast(`Erro ao sair: ${error.message}`, 'error');
    }
}

function showToast(message, type = 'success') {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    Toast.fire({
        icon: type,
        title: message
    });
}