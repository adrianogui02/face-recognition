// Obtenha os elementos do formulário
var loginForm = document.querySelector('form');
var usernameInput = document.querySelector('input[name="username"]');
var passwordInput = document.querySelector('input[name="password"]');

// Adicione um ouvinte de evento para o envio do formulário
loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio do formulário

  var username = usernameInput.value;
  var password = passwordInput.value;

  // Faça a autenticação com o Firebase
  firebase.auth().signInWithEmailAndPassword(username, password)
    .then(function(userCredential) {
      // Login bem-sucedido, redirecione para a página inicial
      window.location.href = 'home.html';
    })
    .catch(function(error) {
      // Ocorreu um erro durante o login, exiba uma mensagem de erro
      console.error(error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    });
});
