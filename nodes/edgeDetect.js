//edge detect -> image: RGBA => image: RGBA
export const edgeDetect = imageRGBA => {
  var h = imageRGBA.height;
  var w = imageRGBA.width;
  var input = imageRGBA.data;
  var output = new Uint8ClampedArray(h * w * 4);
  var i00, i0m, i0p, im0, ip0, imm, imp, ipm, ipp, row, col;
  //
  // find edges - interior
  //
  for (row = 1; row < h - 1; ++row) {
    for (col = 1; col < w - 1; ++col) {
      i00 =
        input[(h - 1 - row) * w * 4 + col * 4 + 0] +
        input[(h - 1 - row) * w * 4 + col * 4 + 1] +
        input[(h - 1 - row) * w * 4 + col * 4 + 2];
      i0p =
        input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 0] +
        input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 1] +
        input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 2];
      ip0 =
        input[(h - 2 - row) * w * 4 + col * 4 + 0] +
        input[(h - 2 - row) * w * 4 + col * 4 + 1] +
        input[(h - 2 - row) * w * 4 + col * 4 + 2];
      ipp =
        input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 0] +
        input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 1] +
        input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 2];
      i0m =
        input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 0] +
        input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 1] +
        input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 2];
      im0 =
        input[(h - row) * w * 4 + col * 4 + 0] +
        input[(h - row) * w * 4 + col * 4 + 1] +
        input[(h - row) * w * 4 + col * 4 + 2];
      imm =
        input[(h - row) * w * 4 + (col - 1) * 4 + 0] +
        input[(h - row) * w * 4 + (col - 1) * 4 + 1] +
        input[(h - row) * w * 4 + (col - 1) * 4 + 2];
      imp =
        input[(h - row) * w * 4 + (col + 1) * 4 + 0] +
        input[(h - row) * w * 4 + (col + 1) * 4 + 1] +
        input[(h - row) * w * 4 + (col + 1) * 4 + 2];
      ipm =
        input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 0] +
        input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 1] +
        input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 2];
      if (
        i00 != i0p ||
        i00 != ip0 ||
        i00 != ipp ||
        i00 != i0m ||
        i00 != im0 ||
        i00 != imm ||
        i00 != imp ||
        i00 != ipm
      ) {
        output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
        output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
      } else if (i00 == 0) {
        output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
        output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
      } else {
        output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
        output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
        output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
      }
    }
  }
  //
  // left and right edges
  //
  for (row = 1; row < h - 1; ++row) {
    col = w - 1;
    i00 =
      input[(h - 1 - row) * w * 4 + col * 4 + 0] +
      input[(h - 1 - row) * w * 4 + col * 4 + 1] +
      input[(h - 1 - row) * w * 4 + col * 4 + 2];
    i0m =
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 2];
    imm =
      input[(h - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - row) * w * 4 + (col - 1) * 4 + 2];
    ipm =
      input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 2];
    im0 =
      input[(h - row) * w * 4 + col * 4 + 0] +
      input[(h - row) * w * 4 + col * 4 + 1] +
      input[(h - row) * w * 4 + col * 4 + 2];
    ip0 =
      input[(h - 2 - row) * w * 4 + col * 4 + 0] +
      input[(h - 2 - row) * w * 4 + col * 4 + 1] +
      input[(h - 2 - row) * w * 4 + col * 4 + 2];
    if (i00 != i0m || i00 != ip0 || i00 != ipm || i00 != im0 || i00 != imm) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else if (i00 == 0) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    }
    col = 0;
    i00 =
      input[(h - 1 - row) * w * 4 + col * 4 + 0] +
      input[(h - 1 - row) * w * 4 + col * 4 + 1] +
      input[(h - 1 - row) * w * 4 + col * 4 + 2];
    i0p =
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 2];
    imp =
      input[(h - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - row) * w * 4 + (col + 1) * 4 + 2];
    ipp =
      input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 2];
    im0 =
      input[(h - row) * w * 4 + col * 4 + 0] +
      input[(h - row) * w * 4 + col * 4 + 1] +
      input[(h - row) * w * 4 + col * 4 + 2];
    ip0 =
      input[(h - 2 - row) * w * 4 + col * 4 + 0] +
      input[(h - 2 - row) * w * 4 + col * 4 + 1] +
      input[(h - 2 - row) * w * 4 + col * 4 + 2];
    if (i00 != i0p || i00 != ip0 || i00 != ipp || i00 != im0 || i00 != imp) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else if (i00 == 0) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    }
  }
  //
  // top and bottom edges
  //
  for (col = 1; col < w - 1; ++col) {
    row = h - 1;
    i00 =
      input[(h - 1 - row) * w * 4 + col * 4 + 0] +
      input[(h - 1 - row) * w * 4 + col * 4 + 1] +
      input[(h - 1 - row) * w * 4 + col * 4 + 2];
    i0m =
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 2];
    i0p =
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 2];
    imm =
      input[(h - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - row) * w * 4 + (col - 1) * 4 + 2];
    im0 =
      input[(h - row) * w * 4 + col * 4 + 0] +
      input[(h - row) * w * 4 + col * 4 + 1] +
      input[(h - row) * w * 4 + col * 4 + 2];
    imp =
      input[(h - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - row) * w * 4 + (col + 1) * 4 + 2];
    if (i00 != i0m || i00 != i0p || i00 != imm || i00 != im0 || i00 != imp) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else if (i00 == 0) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    }
    row = 0;
    i00 =
      input[(h - 1 - row) * w * 4 + col * 4 + 0] +
      input[(h - 1 - row) * w * 4 + col * 4 + 1] +
      input[(h - 1 - row) * w * 4 + col * 4 + 2];
    i0m =
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 2];
    i0p =
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 2];
    ipm =
      input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 0] +
      input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 1] +
      input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 2];
    ip0 =
      input[(h - 2 - row) * w * 4 + col * 4 + 0] +
      input[(h - 2 - row) * w * 4 + col * 4 + 1] +
      input[(h - 2 - row) * w * 4 + col * 4 + 2];
    ipp =
      input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 0] +
      input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 1] +
      input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 2];
    if (i00 != i0m || i00 != i0p || i00 != ipm || i00 != ip0 || i00 != ipp) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else if (i00 == 0) {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    } else {
      output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
      output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
      output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
    }
  }
  //
  // corners
  //
  row = 0;
  col = 0;
  i00 =
    input[(h - 1 - row) * w * 4 + col * 4 + 0] +
    input[(h - 1 - row) * w * 4 + col * 4 + 1] +
    input[(h - 1 - row) * w * 4 + col * 4 + 2];
  i0p =
    input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 0] +
    input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 1] +
    input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 2];
  ip0 =
    input[(h - 2 - row) * w * 4 + col * 4 + 0] +
    input[(h - 2 - row) * w * 4 + col * 4 + 1] +
    input[(h - 2 - row) * w * 4 + col * 4 + 2];
  ipp =
    input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 0] +
    input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 1] +
    input[(h - 2 - row) * w * 4 + (col + 1) * 4 + 2];
  if (i00 != i0p || i00 != ip0 || i00 != ipp) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else if (i00 == 0) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  }
  row = 0;
  col = w - 1;
  i00 =
    input[(h - 1 - row) * w * 4 + col * 4 + 0] +
    input[(h - 1 - row) * w * 4 + col * 4 + 1] +
    input[(h - 1 - row) * w * 4 + col * 4 + 2];
  i0m =
    input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 0] +
    input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 1] +
    input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 2];
  ip0 =
    input[(h - 2 - row) * w * 4 + col * 4 + 0] +
    input[(h - 2 - row) * w * 4 + col * 4 + 1] +
    input[(h - 2 - row) * w * 4 + col * 4 + 2];
  ipm =
    input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 0] +
    input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 1] +
    input[(h - 2 - row) * w * 4 + (col - 1) * 4 + 2];
  if (i00 != i0m || i00 != ip0 || i00 != ipm) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else if (i00 == 0) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  }
  row = h - 1;
  col = 0;
  i00 =
    input[(h - 1 - row) * w * 4 + col * 4 + 0] +
    input[(h - 1 - row) * w * 4 + col * 4 + 1] +
    input[(h - 1 - row) * w * 4 + col * 4 + 2];
  i0p =
    input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 0] +
    input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 1] +
    input[(h - 1 - row) * w * 4 + (col + 1) * 4 + 2];
  im0 =
    input[(h - row) * w * 4 + col * 4 + 0] +
    input[(h - row) * w * 4 + col * 4 + 1] +
    input[(h - row) * w * 4 + col * 4 + 2];
  imp =
    input[(h - row) * w * 4 + (col + 1) * 4 + 0] +
    input[(h - row) * w * 4 + (col + 1) * 4 + 1] +
    input[(h - row) * w * 4 + (col + 1) * 4 + 2];
  if (i00 != i0p || i00 != im0 || i00 != imp) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else if (i00 == 0) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  }
  row = h - 1;
  col = w - 1;
  i00 =
    input[(h - 1 - row) * w * 4 + col * 4 + 0] +
    input[(h - 1 - row) * w * 4 + col * 4 + 1] +
    input[(h - 1 - row) * w * 4 + col * 4 + 2];
  i0m =
    input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 0] +
    input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 1] +
    input[(h - 1 - row) * w * 4 + (col - 1) * 4 + 2];
  im0 =
    input[(h - row) * w * 4 + col * 4 + 0] +
    input[(h - row) * w * 4 + col * 4 + 1] +
    input[(h - row) * w * 4 + col * 4 + 2];
  imm =
    input[(h - row) * w * 4 + (col - 1) * 4 + 0] +
    input[(h - row) * w * 4 + (col - 1) * 4 + 1] +
    input[(h - row) * w * 4 + (col - 1) * 4 + 2];
  if (i00 != i0m || i00 != im0 || i00 != imm) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else if (i00 == 0) {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  } else {
    output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
    output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
    output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
  }

  const imgData = new ImageData(output, w, h);

  return imgData;
};