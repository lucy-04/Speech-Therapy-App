const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const convertToWav = (inputBuffer, inputExt = 'm4a') => {
  return new Promise((resolve, reject) => {
    const tempInputPath = path.join(__dirname, `temp_input.${inputExt}`);
    const tempOutputPath = path.join(__dirname, 'temp_output.wav');

    // Write the buffer to temp file
    fs.writeFileSync(tempInputPath, inputBuffer);

    ffmpeg(tempInputPath)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('end', () => {
        const convertedBuffer = fs.readFileSync(tempOutputPath);

        // Clean up
        fs.unlinkSync(tempInputPath);
        fs.unlinkSync(tempOutputPath);

        resolve(convertedBuffer);
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(tempOutputPath);
  });
};

module.exports = { convertToWav };
