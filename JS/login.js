// Arquivo: login.js

// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Pega os elementos DEPOIS que a página carregou
    const formLogin = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const msgErro = document.getElementById('mensagem-erro');

    // Adiciona o 'listener' ao formulário
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página
        msgErro.textContent = ''; // Limpa mensagens de erro antigas

        const email = emailInput.value;
        const senha = senhaInput.value;

        // *** CORREÇÃO AQUI ***
        // Usamos 'window.supabaseClient' (do seu client.js) 
        // em vez de 'window.supabase'
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        if (error) {
            // Se der erro, mostra na tela
            msgErro.textContent = `Erro: ${error.message}`;
        } else {
            // Se der certo, redireciona para o index.html
            window.location.href = 'index.html';
        }
    });

});