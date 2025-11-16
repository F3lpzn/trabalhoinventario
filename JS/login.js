// Arquivo: login.js
const formLogin = document.getElementById('form-login');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const msgErro = document.getElementById('mensagem-erro');

formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = emailInput.value;
  const senha = senhaInput.value;

  const { data, error } = await window.supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    msgErro.textContent = `Erro: ${error.message}`;
  } else {

    window.location.href = 'index.html';
  }
});