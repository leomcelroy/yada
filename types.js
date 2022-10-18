// FIXME: put all the type tables in one place: defaults, encode, decode
export const defaultValues = {
  "number": 0,
  "string": "",
  "img_uint8": default_img_uint8(), // { data, width, height }
  "img_float32": {"data": new Float32Array(1), "width": 1, "height": 1},
  "boolean": true,
  "path": [], // a list of vectors
};

function default_img_uint8() {
    const w = 100;
    const h = 100;
    const buf = new Uint8ClampedArray(w * h * 4);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            buf[(i * w + j)*4] = i*255/w;
            buf[(i * w + j)*4+1] = j*255/h;
            buf[(i * w + j)*4+2] = 0;
            buf[(i * w + j)*4+3] = 255;
        }
    }

    return { data: buf, width: w, height: h };
}

export function encodeType(type, val) {
  const types = {
    "img_uint8": val => ({
      data: btoa(val.data.reduce((data, byte) => data + String.fromCharCode(byte), '')),
      width: val.width,
      height: val.height
    }),
    // "img_float32": val => ({
    //   // FIXME: float32 doesn't work, need to split into 4 bytes
    //   data: btoa(val.data.reduce((data, byte) => data + String.fromCharCode(byte), '')),
    //   width: val.width,
    //   height: val.height
    // })
  }

  if (type in types) return types[type](val);
  else return val;
}

export function decodeType(type, val) {
  const types = {
    "img_uint8": val => ({
      data: decodeBuf(val.data),
      width: val.width,
      height: val.height
    }),
    // "img_float32": val => ({
    //   // FIXME: float32 doesn't work, need to split into 4 bytes
    //   data: btoa(val.data.reduce((data, byte) => data + String.fromCharCode(byte), '')),
    //   width: val.width,
    //   height: val.height
    // })
  }

  if (type in types) return types[type](val);
  else return val;
}


const decodeBuf = (data) => {
  const decodedString = atob(data);
  const l = decodedString.length;
  const buf = new Uint8ClampedArray(l);
  for (let i = 0; i < l; i++) {
    const char = decodedString[i];
    const byte = char.charCodeAt(0);
    buf[i] = byte;
  }

  return buf;
}
