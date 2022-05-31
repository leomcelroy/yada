//offset -> distances: Float32Array, offset: pixels => image: RGBA
export const offset = (distances, offset, width, height) => {
  //TODO: this width and height should be passed properly
  var w = width;
  var h = height;
  var offset = offset;
  var input = distances;
  var output = new Uint8ClampedArray(4 * h * w);
  for (var row = 0; row < h; ++row) {
    for (var col = 0; col < w; ++col) {
      if (input[(h - 1 - row) * w + col] <= offset) {
        output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
        output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
        output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
        output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
      } else {
        output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
      }
    }
  }

  const imgData = new ImageData(output, w, h);

  return imgData;
};