const express = require('express');
const multer = require('multer');
const cors = require('cors');
const speech = require('@google-cloud/speech');
const {convertToWav} = require('./convertToAudio')

const client = new speech.SpeechClient({
  keyFilename: '/Users/lakshaytuteja/GitRepo/Speech-Therapy-App/SpeechTherapyApp/keys/speech-therapy-app-hack-ad55a94efd26.json' 
});

console.log("Starting server...");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const wavBuffer = await convertToWav(req.file.buffer)
    const audioBytes = wavBuffer.toString('base64');
    const audio = { content: audioBytes };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'hi-IN', 
      enableWordConfidence: true,
    };

    const [response] = await client.recognize({ audio, config });


    let transcription = '';
let words = [];

response.results.forEach(result => {
  const alternative = result.alternatives[0];

  transcription += alternative.transcript + ' ';

  if (alternative.words) {
    words.push(...alternative.words.map(wordInfo => ({
      word: wordInfo.word,
      confidence: wordInfo.confidence
    })));
  }
});

res.send({ transcription: transcription.trim(), words });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Transcription failed' });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));