// Arquivo: fornecedores.js (Fornecedores CRUD)

// --- Variáveis Globais ---
let formFornecedor;
let tabelaFornecedoresCorpo;
let h2Form;
let submitButton;
let cancelButton;
let logoutButton;

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    formFornecedor = document.getElementById('form-fornecedor');
    tabelaFornecedoresCorpo = document.getElementById('tabela-fornecedores-corpo'); 
    h2Form = document.getElementById('h2-form-fornecedor');
    submitButton = document.getElementById('botao-submit');
    cancelButton = document.getElementById('botao-cancelar');
    logoutButton = document.getElementById('botao-logout');

    if (formFornecedor) {
        formFornecedor.addEventListener('submit', salvarFornecedor);
    }
    
    if (tabelaFornecedoresCorpo) {
        tabelaFornecedoresCorpo.addEventListener('click', aoClicarNaTabela);
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
    }
});


// --- Funções de Dados (Supabase) ---

async function carregarFornecedores() {
    const { data: fornecedores, error } = await window.supabaseClient
        .from('fornecedores')
        .select('*')
        .order('id', { ascending: false }); 

    if (error) {
        console.error('Erro ao buscar fornecedores:', error);
        showToast('Erro ao carregar fornecedores.', 'error');
        return;
    }
    
    tabelaFornecedoresCorpo.innerHTML = '';
    fornecedores.forEach((fornecedor) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${fornecedor.nome_fornecedor}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${fornecedor.id}" class="botao-editar text-indigo-600 hover:text-indigo-900">Editar</button>
                <button data-id="${fornecedor.id}" class="botao-excluir text-red-600 hover:text-red-900 ml-4">Excluir</button>
            </td>
        `;
        tabelaFornecedoresCorpo.appendChild(tr);
    });
}

// Arquivo: fornecedores.js (Substitua toda a função salvarFornecedor)

async function salvarFornecedor(evento) {
    evento.preventDefault(); 
    const idParaEditar = formFornecedor.dataset.editId;

    // Acessamos apenas o nome, sem o user_id
    const dadosFornecedor = {
        nome_fornecedor: document.getElementById('nome_fornecedor').value
        // user_id FOI REMOVIDO DAQUI
    };

    let error;
    let successMessage = '';

    if (idParaEditar) {
        // MODO UPDATE
        const { error: updateError } = await window.supabaseClient
            .from('fornecedores')
            .update(dadosFornecedor)
            .eq('id', idParaEditar);
        error = updateError;
        successMessage = 'Fornecedor atualizado com sucesso!';
    } else {
        // MODO INSERT
        const { error: insertError } = await window.supabaseClient
            .from('fornecedores')
            .insert([dadosFornecedor]);
        error = insertError;
        successMessage = 'Fornecedor cadastrado com sucesso!';
    }

    if (error) {
        console.error('Erro ao salvar fornecedor:', error);
        showToast(`Erro ao salvar: ${error.message}`, 'error');
    } else {
        showToast(successMessage, 'success');
        resetarFormulario(); 
        carregarFornecedores(); 
    }
}

async function excluirFornecedor(id) {
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
        const { data, error } = await window.supabaseClient
            .from('fornecedores')
            .delete()
            .eq('id', id); 

        if (error) {
            console.error('Erro ao excluir fornecedor:', error);
            showToast(`Erro ao excluir: ${error.message}`, 'error');
        } else {
            showToast('Fornecedor excluído com sucesso!', 'success');
            carregarFornecedores(); 
        }
    }
}

// --- Funções Auxiliares (DOM e Logout) ---

function aoClicarNaTabela(evento) {
    const elementoClicado = evento.target; 

    if (elementoClicado.classList.contains('botao-excluir')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        excluirFornecedor(idProduto);
    }
    
    if (elementoClicado.classList.contains('botao-editar')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        carregarDadosParaEdicao(idProduto);
    }
}

async function carregarDadosParaEdicao(id) {
    const { data: fornecedor, error } = await window.supabaseClient
        .from('fornecedores')
        .select('*')
        .eq('id', id)
        .single(); 

    if (error) {
        console.error(error);
        showToast('Erro ao carregar dados para edição.', 'error');
        return;
    }

    document.getElementById('nome_fornecedor').value = fornecedor.nome_fornecedor;

    formFornecedor.dataset.editId = id;

    h2Form.textContent = 'Editar Fornecedor';
    submitButton.textContent = 'Salvar Alterações';
    cancelButton.classList.remove('hidden'); 

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetarFormulario() {
    formFornecedor.reset(); 
    delete formFornecedor.dataset.editId; 
    h2Form.textContent = 'Cadastrar Novo Fornecedor';
    submitButton.textContent = 'Cadastrar Fornecedor';
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