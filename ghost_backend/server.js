const express = require('express');
const multer = require('multer');
const cors = require('cors');
const tf = require('@tensorflow/tfjs');
const wasm = require('@tensorflow/tfjs-backend-wasm');
const faceapi = require('@vladmandic/face-api/dist/face-api.node-wasm.js');
const canvas = require('canvas');
const path = require('path');

faceapi.env.monkeyPatch({
  Canvas: canvas.Canvas,
  Image: canvas.Image,
  ImageData: canvas.ImageData
});

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('photo'), async (req, res) => {
  const img = await canvas.loadImage(req.file.path);
  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks();

  const faces = detections.map(det => ({
    box: det.detection.box,
    landmarks: det.landmarks.positions
  }));

  res.json({
    faceCount: faces.length,
    faces: faces
  });
});

async function startServer() {
  wasm.setWasmPaths(
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/'
  );

  await tf.setBackend('wasm');
  await tf.ready();

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(
    path.join(__dirname, 'models')
  );
  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    path.join(__dirname, 'models')
  );

  app.listen(3000, () => {
    console.log('Backend running on port 3000');
  });
}

startServer().catch(console.error);