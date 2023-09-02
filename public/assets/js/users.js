const firebaseConfig = {
    apiKey: "AIzaSyC5HKFe50ptB30rul9vncgiU7nfGwUAHyA",
    authDomain: "valifacecallidus.firebaseapp.com",
    projectId: "valifacecallidus",
    storageBucket: "valifacecallidus.appspot.com",
    messagingSenderId: "472138281594",
    appId: "1:472138281594:web:3212162c5acb9caacb01c3",
    measurementId: "G-8WBVZP06SL"
};
  
// Inicialização do Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use o app existente se já estiver inicializado
}
  
// Referência para o banco de dados
const db = firebase.firestore();
  
// Referência para a coleção "pessoas"
const pessoasRef = db.collection("funcionarios"); // Change the collection name to "funcionarios"

// Referência para a div "content"
const contentDiv = document.querySelector(".users");

const exibirListaFuncionarios = async () => {
    try {
      const querySnapshot = await pessoasRef.get();
      const funcionarios = [];
  
      querySnapshot.forEach((doc) => {
        const funcionario = doc.data();
        funcionarios.push(funcionario);
      });
  
      const listaFuncionariosHTML = document.createElement("ul");
      listaFuncionariosHTML.classList.add("ul");
  
      funcionarios.forEach((funcionario) => {
        const itemLista = document.createElement("li");
        const fotoFuncionario = document.createElement("img");
        fotoFuncionario.src = funcionario.fotos[0]; // URL da foto do funcionário
        fotoFuncionario.alt = "Foto do Funcionário";
        fotoFuncionario.classList.add("funcionario-img"); // Adiciona a classe CSS para a foto do funcionário
        itemLista.appendChild(fotoFuncionario);
  
        const infoNomeFuncionario = document.createElement("span");
        infoNomeFuncionario.textContent = ` ${funcionario.nome}`;
        infoNomeFuncionario.classList.add("nome_fun"); // Adiciona a classe CSS para a foto do funcionário
        itemLista.appendChild(infoNomeFuncionario);

        const infoCargoFuncionario = document.createElement("span");
        infoCargoFuncionario.textContent = `${funcionario.cargo}`;
        infoCargoFuncionario.classList.add("cargo_fun"); // Adiciona a classe CSS para a foto do funcionário
        itemLista.appendChild(infoCargoFuncionario);
  
        listaFuncionariosHTML.appendChild(itemLista);
      });
  
      contentDiv.innerHTML = "";
      contentDiv.appendChild(listaFuncionariosHTML);
    } catch (error) {
      console.error("Ocorreu um erro ao obter a lista de funcionários:", error);
    }
  };
  
  exibirListaFuncionarios();