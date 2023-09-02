function showLoading() {
  console.log("Exibindo o elemento de loading"); // Verificar se a função está sendo chamada
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "none";
}

hideLoading()

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



// Referência para o formulário
const form = document.getElementById("form");
if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Obtenção dos valores do formulário
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const fotosInput = document.getElementById("fotos");
    const fotos = [];

    // Processamento das fotos selecionadas
    for (let i = 0; i < fotosInput.files.length; i++) {
      const file = fotosInput.files[i];
      fotos.push(file);
    }

    // Criação do objeto pessoa com os dados
    const pessoa = {
      nome: nome,
      cargo: cargo,
      fotos: []
    };

    
    // Função para fazer o upload das fotos
    const uploadFotos = async () => {
      showLoading();
      for (let i = 0; i < fotos.length; i++) {
        const file = fotos[i];
        const employeeFolderRef = firebase.storage().ref().child(nome); // Create a reference to the employee's folder using their name
        const fileRef = employeeFolderRef.child(file.name); // Create a reference to the photo file inside the employee's folder
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        pessoa.fotos.push(downloadURL); // Adicionar a URL da foto ao array "fotos" do objeto "pessoa"
      }
};
    
    const salvarPessoa = async () => {
      try {
        const docRef = await pessoasRef.doc(nome).set(pessoa); // Save the data under a document with the employee's name
        
        console.log("Dados da pessoa foram salvos com sucesso.");
        form.reset();
        hideLoading();
      } catch (error) {
        console.error("Ocorreu um erro ao salvar os dados da pessoa:", error);
      }
    };
    // Executa o upload das fotos e, em seguida, salva os dados da pessoa
    uploadFotos().then(salvarPessoa);
  });
}

