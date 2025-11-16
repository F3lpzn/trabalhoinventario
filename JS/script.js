// Arquivo: script.js
let formProduto;
let selectFornecedores;
let tabelaProdutosCorpo; 

document.addEventListener('DOMContentLoaded', () => {
    formProduto = document.getElementById('form-produto');
    selectFornecedores = document.getElementById('fornecedor_id');
    tabelaProdutosCorpo = document.getElementById('tabela-produtos-corpo'); 

    if (formProduto) {
        formProduto.addEventListener('submit', cadastrarProduto);
    }
    
    if (tabelaProdutosCorpo) {
        tabelaProdutosCorpo.addEventListener('click', aoClicarNaTabela);
    }
});

window.supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      window.location.href = 'login.html';
    } else {
      console.log('Usuário logado:', session.user.email);
      carregarFornecedores();
      carregarProdutos(); 
    }
});


async function carregarFornecedores() {
    const response = await fetch(`${window.supabaseUrl}/rest/v1/fornecedores?select=*`, {
        method: 'GET',
        headers: {
            'apikey': window.supabaseKey // 'apikey' é o suficiente
        }
    });

    if (response.ok) {
        const fornecedores = await response.json();
        
        selectFornecedores.innerHTML = '<option value="" disabled selected>Selecione um fornecedor</option>';
        fornecedores.forEach((fornecedor) => {
            const option = document.createElement('option');
            option.value = fornecedor.id; 
            option.textContent = fornecedor.nome_fornecedor; 
            selectFornecedores.appendChild(option);
        });
    } else {
        console.error('Erro ao buscar fornecedores.');
    }
}

async function cadastrarProduto(evento) {
    evento.preventDefault(); 

    const dadosProduto = {
        nome_produto: document.getElementById('nome_produto').value,
        sku: document.getElementById('sku').value,
        preco_custo: document.getElementById('preco_custo').value,
        preco_venda: document.getElementById('preco_venda').value,
        quantidade_estoque: document.getElementById('quantidade_estoque').value,
        fornecedor_id: document.getElementById('fornecedor_id').value 
    };

    const response = await fetch(`${window.supabaseUrl}/rest/v1/produtos`, {
        method: 'POST',
        headers: {
            'apikey': window.supabaseKey, // 'apikey' é o suficiente
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosProduto) 
    });

    if (response.status === 201) { 
        alert('Produto cadastrado com sucesso!');
        formProduto.reset(); 
        carregarProdutos(); 
    } else {
        const erro = await response.json();
        console.error('Erro ao cadastrar produto:', erro);
        alert(`Erro ao cadastrar: ${erro.message}`);
    }
}


async function carregarProdutos() {
    const response = await fetch(`${window.supabaseUrl}/rest/v1/produtos?select=*&order=id.desc`, {
        method: 'GET',
        headers: {
            'apikey': window.supabaseKey // 'apikey' é o suficiente
        }
    });

    if (!response.ok) {
        console.error('Erro ao buscar produtos.');
        return;
    }

    const produtos = await response.json();
    
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


function aoClicarNaTabela(evento) {
    const elementoClicado = evento.target; 

    if (elementoClicado.classList.contains('botao-excluir')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            excluirProduto(idProduto);
        }
    }
    
    if (elementoClicado.classList.contains('botao-editar')) {
        const idProduto = elementoClicado.getAttribute('data-id');
        alert('Função de editar para o ID ' + idProduto + ' ainda não implementada.');
    }
}


async function excluirProduto(id) {
    const response = await fetch(`${window.supabaseUrl}/rest/v1/produtos?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
            'apikey': window.supabaseKey // 'apikey' é o suficiente
        }
    });

    if (response.ok || response.status === 204) { 
        alert('Produto excluído com sucesso!');
        carregarProdutos(); 
    } else {
        const erro = await response.json();
        console.error('Erro ao excluir produto:', erro);
        alert(`Erro ao excluir: ${erro.message}`);
    }
}