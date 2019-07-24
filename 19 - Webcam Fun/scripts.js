/*jshint esversion: 6 */

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    }).then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error('Oh no!', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  console.log(width, height);

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take pixels out of img
    let pixels = ctx.getImageData(0, 0, width, height);
    // altered pixels (filters)
    //pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    // display altered pixels
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'screenshot');
  link.innerHTML = `<img src="${data}" alt="screenshot" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] += 100;
    pixels.data[i + 1] -= 50;
    pixels.data[i + 2] *= 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 550] = pixels.data[i + 0]; // red
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 550] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);