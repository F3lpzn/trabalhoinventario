// Arquivo: cadastro.js

document.addEventListener('DOMContentLoaded', () => {

    const formCadastro = document.getElementById('form-cadastro');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const msgErro = document.getElementById('mensagem-erro');

    formCadastro.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 
        msgErro.textContent = ''; // Limpa erros antigos

        const email = emailInput.value;
        const senha = senhaInput.value;

        // *** CORREÇÃO AQUI ***
        // Usamos 'window.supabaseClient' (do client.js)
        const { data, error } = await window.supabaseClient.auth.signUp({
            email: email,
            password: senha,
        });

        if (error) {
            msgErro.textContent = `Erro: ${error.message}`;
            msgErro.style.color = 'red';
        } else {
            msgErro.textContent = 'Cadastro realizado! Verifique seu email para confirmar.';
            msgErro.style.color = 'green';
            formCadastro.reset();
        }
    });

});