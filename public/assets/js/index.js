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

const cam = document.getElementById('cam');
const canvas = document.getElementById('canvasRecon');
const context = canvas.getContext('2d');

const startVideo = () => {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      if (Array.isArray(devices)) {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(videoDevices);
        const deviceOptions = videoDevices.map(device => ({
          label: device.label,
          value: device.deviceId
        }));

        if (videoDevices.length === 1) {
          const selectedDeviceId = videoDevices[0].deviceId;
          navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectedDeviceId }
          })
            .then(stream => {
              cam.srcObject = stream;
            })
            .catch(error => {
              console.error('Error accessing camera:', error);
            });
        } else {
          const selectElement = document.getElementById('cameraSelector');
          selectElement.addEventListener('change', event => {
            const selectedDeviceId = event.target.value;
            const selectedDevice = videoDevices.find(device => device.deviceId === selectedDeviceId);
            if (selectedDevice) {
              navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedDevice.deviceId }
              })
                .then(stream => {
                  cam.srcObject = stream;
                })
                .catch(error => {
                  console.error('Error accessing camera:', error);
                });
            }
          });

          deviceOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.text = option.label;
            selectElement.appendChild(optionElement);
          });

          // Adiciona o elemento <select> ao corpo do documento
          document.body.appendChild(selectElement);
        }
      }
    })
    .catch(error => {
      console.error('Error enumerating video devices:', error);
    });
};

const db = firebase.firestore();

// Função para carregar os dados dos funcionários
const carregarFuncionarios = async () => {
  try {
    const funcionariosSnapshot = await db.collection("funcionarios").get();
    const funcionarios = [];

    funcionariosSnapshot.forEach((doc) => {
      const funcionario = doc.data();
      funcionarios.push(funcionario);
    });

    return funcionarios;
  } catch (error) {
    console.error("Ocorreu um erro ao carregar os dados dos funcionários:", error);
    return [];
  }
};

// Função para carregar as labels (descrições faciais) dos funcionários
const loadLabels = async () => {
  try {
    const funcionarios = await carregarFuncionarios();
    const labeledDescriptors = [];

    for (const funcionario of funcionarios) {
      const descriptions = [];

      for (const fotoURL of funcionario.fotos) {
        try {
          console.log('Carregando...');
          const img = await faceapi.fetchImage(fotoURL);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

          if (detections && detections.descriptor) {
            descriptions.push(detections.descriptor);
          } else {
            console.warn(`Nenhuma face ou descrição facial encontrada na imagem ${fotoURL}`);
          }
        } catch (error) {
          console.error('Erro ao carregar a imagem:', error);
        }
      }

      if (descriptions.length > 0) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(funcionario.nome,  descriptions)
        );
      } else {
        console.warn(`Nenhuma descrição facial encontrada para o funcionário ${funcionario.nome}`);
      }
    }

    if (labeledDescriptors.length === 0) {
      console.warn('Nenhuma descrição facial encontrada para nenhum funcionário.');
    }

    return labeledDescriptors;
  } catch (error) {
    console.error('Erro ao carregar as descrições:', error);
    return [];
  }
};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./assets/lib/face-api/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./assets/lib/face-api/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./assets/lib/face-api/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./assets/lib/face-api/models'),
  faceapi.nets.ageGenderNet.loadFromUri('./assets/lib/face-api/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/lib/face-api/models')
]).then(startVideo);

cam.addEventListener('play', async () => {
  const videoWidth = cam.videoWidth;
  const videoHeight = cam.videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const labels = await loadLabels();
  console.log('Labels:', labels); // Verifica as labels no console

  const faceMatcher = new faceapi.FaceMatcher(labels, 0.5);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(cam).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, { width: videoWidth, height: videoHeight });
    const results = resizedDetections.map(detection => faceMatcher.findBestMatch(detection.descriptor));

    context.clearRect(0, 0, videoWidth, videoHeight);

    results.forEach((result, index) => {
      const box = resizedDetections[index].detection.box;
      const label = result.label;
      
      const drawOptions = {
        label,
        lineWidth: 2,
        boxColor: '#00FF00',
        textColor: '#00FF00',
        drawLabelOptions: {
          fontSize: 14,
          fontFamily: 'Arial',
          anchorPosition: 'TOP_LEFT',
        }
      };
      
      const drawBox = new faceapi.draw.DrawBox(box, drawOptions);
      drawBox.draw(canvas);
    });
    
    // Mover o elemento canvas para a div com a classe "video-container"
    const contentDiv = document.querySelector('.video-container');
    contentDiv.appendChild(canvas);
  }, 1);
});