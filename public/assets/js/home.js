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
const contentDiv = document.querySelector("tbody");

const exibirListaFuncionarios = async () => {
    try {
      const querySnapshot = await pessoasRef.get();
      const funcionarios = [];
  
      querySnapshot.forEach((doc) => {
        const funcionario = doc.data();
        funcionarios.push(funcionario);
      });
  
      funcionarios.forEach((funcionario) => {
        const itemTupla = document.createElement("tr");
        
  
        const infoNomeFuncionario = document.createElement("th");
        infoNomeFuncionario.setAttribute('scope', 'row')
        infoNomeFuncionario.textContent = `${funcionario.nome}`;
        itemTupla.appendChild(infoNomeFuncionario);

        const infoMatriculaFuncionario = document.createElement("td");
        infoMatriculaFuncionario.textContent = 'placeHolder';
        itemTupla.appendChild(infoMatriculaFuncionario);

        const infoCadastroFuncionario = document.createElement("td");
        infoCadastroFuncionario.textContent = 'placeHolder';
        itemTupla.appendChild(infoCadastroFuncionario);

        const infoContatoFuncionario = document.createElement("td");
        infoContatoFuncionario.textContent = 'placeHolder';
        itemTupla.appendChild(infoContatoFuncionario);

        contentDiv.appendChild(itemTupla);
      });
    } catch (error) {
      console.error("Ocorreu um erro ao obter a lista de funcionários:", error);
    }
  };
  
  exibirListaFuncionarios();