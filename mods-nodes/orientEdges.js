//orient edges -> image: RGBA => image: RGBA
export const orientEdges = imageRGBA => {
  var h = imageRGBA.height;
  var w = imageRGBA.width;
  var input = imageRGBA.data;
  var output = new Uint8ClampedArray(h * w * 4);
  var row, col;
  var boundary = 0;
  var interior = 1;
  var exterior = 2;
  var alpha = 3;
  var northsouth = 0;
  var north = 128;
  var south = 64;
  var eastwest = 1;
  var east = 128;
  var west = 64;
  var startstop = 2;
  var start = 128;
  var stop = 64;
  //
  // orient body states
  //
  for (row = 1; row < h - 1; ++row) {
    for (col = 1; col < w - 1; ++col) {
      output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
      if (input[(h - 1 - row) * w * 4 + col * 4 + boundary] != 0) {
        if (
          input[(h - 1 - (row + 1)) * w * 4 + col * 4 + boundary] != 0 &&
          (input[(h - 1 - row) * w * 4 + (col + 1) * 4 + interior] != 0 ||
            input[(h - 1 - (row + 1)) * w * 4 + (col + 1) * 4 + interior] != 0)
        )
          output[(h - 1 - row) * w * 4 + col * 4 + northsouth] |= north;
        if (
          input[(h - 1 - (row - 1)) * w * 4 + col * 4 + boundary] != 0 &&
          (input[(h - 1 - row) * w * 4 + (col - 1) * 4 + interior] != 0 ||
            input[(h - 1 - (row - 1)) * w * 4 + (col - 1) * 4 + interior] != 0)
        )
          output[(h - 1 - row) * w * 4 + col * 4 + northsouth] |= south;
        if (
          input[(h - 1 - row) * w * 4 + (col + 1) * 4 + boundary] != 0 &&
          (input[(h - 1 - (row - 1)) * w * 4 + col * 4 + interior] != 0 ||
            input[(h - 1 - (row - 1)) * w * 4 + (col + 1) * 4 + interior] != 0)
        )
          output[(h - 1 - row) * w * 4 + col * 4 + eastwest] |= east;
        if (
          input[(h - 1 - row) * w * 4 + (col - 1) * 4 + boundary] != 0 &&
          (input[(h - 1 - (row + 1)) * w * 4 + col * 4 + interior] != 0 ||
            input[(h - 1 - (row + 1)) * w * 4 + (col - 1) * 4 + interior] != 0)
        )
          output[(h - 1 - row) * w * 4 + col * 4 + eastwest] |= west;
      }
    }
  }
  //
  // orient edge states
  //
  for (col = 1; col < w - 1; ++col) {
    row = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
    if (input[(h - 1 - row) * w * 4 + col * 4 + boundary] != 0) {
      if (
        input[(h - 1 - (row + 1)) * w * 4 + col * 4 + boundary] != 0 &&
        input[(h - 1 - row) * w * 4 + (col + 1) * 4 + interior] != 0
      ) {
        output[(h - 1 - row) * w * 4 + col * 4 + northsouth] |= north;
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= start;
      }
      if (input[(h - 1 - row) * w * 4 + (col - 1) * 4 + interior] != 0)
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= stop;
    }
    row = h - 1;
    output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
    if (input[(h - 1 - row) * w * 4 + col * 4 + boundary] != 0) {
      if (input[(h - 1 - row) * w * 4 + (col + 1) * 4 + interior] != 0)
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= stop;
      if (
        input[(h - 1 - (row - 1)) * w * 4 + col * 4 + boundary] != 0 &&
        input[(h - 1 - row) * w * 4 + (col - 1) * 4 + interior] != 0
      ) {
        output[(h - 1 - row) * w * 4 + col * 4 + northsouth] |= south;
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= start;
      }
    }
  }
  for (row = 1; row < h - 1; ++row) {
    col = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
    if (input[(h - 1 - row) * w * 4 + col * 4 + boundary] != 0) {
      if (
        input[(h - 1 - row) * w * 4 + (col + 1) * 4 + boundary] != 0 &&
        input[(h - 1 - (row - 1)) * w * 4 + col * 4 + interior] != 0
      ) {
        output[(h - 1 - row) * w * 4 + col * 4 + eastwest] |= east;
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= start;
      }
      if (input[(h - 1 - (row + 1)) * w * 4 + col * 4 + interior] != 0)
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= stop;
    }
    col = w - 1;
    output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
    if (input[(h - 1 - row) * w * 4 + col * 4 + boundary] != 0) {
      if (input[(h - 1 - (row - 1)) * w * 4 + col * 4 + interior] != 0)
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= stop;
      if (
        input[(h - 1 - row) * w * 4 + (col - 1) * 4 + boundary] != 0 &&
        input[(h - 1 - (row + 1)) * w * 4 + col * 4 + interior] != 0
      ) {
        output[(h - 1 - row) * w * 4 + col * 4 + eastwest] |= west;
        output[(h - 1 - row) * w * 4 + col * 4 + startstop] |= start;
      }
    }
  }
  //
  // orient corner states (todo)
  //
  row = 0;
  col = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
  row = h - 1;
  col = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
  row = 0;
  col = w - 1;
  output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;
  row = h - 1;
  col = w - 1;
  output[(h - 1 - row) * w * 4 + col * 4 + northsouth] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + eastwest] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + startstop] = 0;
  output[(h - 1 - row) * w * 4 + col * 4 + alpha] = 255;

  // var display = new Uint8ClampedArray(h*w*4)
  // var r,g,b,i
  // for (row = 0; row < h; ++row) {
  //   for (col = 0; col < w; ++col) {
  //     r = output[(h-1-row)*w*4+col*4+0]
  //     g = output[(h-1-row)*w*4+col*4+1]
  //     b = output[(h-1-row)*w*4+col*4+2]
  //     i = r+g+b
  //     if (i != 0) {
  //        display[(h-1-row)*w*4+col*4+0] = output[(h-1-row)*w*4+col*4+0]
  //        display[(h-1-row)*w*4+col*4+1] = output[(h-1-row)*w*4+col*4+1]
  //        display[(h-1-row)*w*4+col*4+2] = output[(h-1-row)*w*4+col*4+2]
  //        display[(h-1-row)*w*4+col*4+3] = output[(h-1-row)*w*4+col*4+3]
  //        }
  //     else {
  //        display[(h-1-row)*w*4+col*4+0] = 255
  //        display[(h-1-row)*w*4+col*4+1] = 255
  //        display[(h-1-row)*w*4+col*4+2] = 255
  //        display[(h-1-row)*w*4+col*4+3] = 255
  //        }
  //     }
  //  }

  const imgData = new ImageData(output, w, h);

  return imgData;
};