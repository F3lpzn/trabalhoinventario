const formCadastro = document.getElementById('form-cadastro');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const msgErro = document.getElementById('mensagem-erro');

formCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault(); 

  const email = emailInput.value;
  const senha = senhaInput.value;

  const { data, error } = await window.supabase.auth.signUp({
    email: email,
    password: senha,
  });

  if (error) {
    msgErro.textContent = `Erro: ${error.message}`;
  } else {
    msgErro.textContent = 'Cadastro realizado! Verifique seu email para confirmar.';
    msgErro.style.color = 'green';
    formCadastro.reset();
  }
});