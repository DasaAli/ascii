const density = "Ñ@#W$9876543210?!abc;:+=-,._                       ";

let video;
let asciiDiv;

function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.size(80, 60);
  video.hide(); // hides the original video feed
  asciiDiv = createDiv();
  asciiDiv.id('asciiDiv'); // gives the div a proper id
}

function draw() {
  video.loadPixels();
  let asciiImage = '';

  for (let j = 0; j < video.height; j++) {
    for (let i = 0; i < video.width; i++) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      const avg = (r + g + b) / 3;

      // Convert to grayscale (using human-eye weighted average)
      let brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      // Apply gamma correction and slight contrast boost
      const gamma = 0.6;          // <1 brightens, >1 darkens
      brightness = 255 * Math.pow(brightness / 255, gamma);

      // Optional contrast curve (adjust midpoint)
      const contrast = 1.3;       // 1 = neutral, >1 = more contrast
      brightness = ((brightness - 128) * contrast) + 128;

      // Clamp to safe range
      brightness = constrain(brightness, 0, 255);

      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, len, 0));
      const c = density.charAt(charIndex);

      // convert spaces to HTML non-breaking spaces
      asciiImage += (c === ' ') ? '&nbsp;' : c;
    }
    asciiImage += '<br/>';
  }

  asciiDiv.html(asciiImage);
}
